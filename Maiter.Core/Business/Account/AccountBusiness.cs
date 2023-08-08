using Maiter.Core.Db;
using Maiter.Core.Security;
using Maiter.Core.Util;
using Maiter.Shared.Entity;
using Maiter.Shared.Operation;
using Maiter.Shared.Security;
using Maiter.Shared.ViewModels.Account;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Maiter.Core.Configuration;
using Maiter.Shared.Util;
using System.Net;
using System.IO;
using Maiter.Core.Business.Common;

namespace Maiter.Core.Business.Account
{
    public class AccountBusiness : IDisposable
    {
        private UserManager<ApplicationUser, string> _userManager;
        private IClaimsBusiness _claimsBusiness;
        private AttachmentBusiness attachBll;
        private bool _disposed = false;

        public AccountBusiness(UserManager<ApplicationUser, string> userManager, IClaimsBusiness claimsBusiness, AttachmentBusiness attach)
        {
            this.UserManager = userManager;
            this._claimsBusiness = claimsBusiness;
            this.attachBll = attach;
        }

        public static ApplicationUser GetUser(string currentUserID)
        {
            AccountBusiness accBll = ServicesConfiguration.GetService<AccountBusiness>();
            return accBll.UserManager.FindById(currentUserID);
        }

        public static ApplicationUser GetUserByEMail(string email)
        {
            AccountBusiness accBll = ServicesConfiguration.GetService<AccountBusiness>();
            return accBll.UserManager.FindByEmail(email);
        }

        public ApplicationUser GenerateNewAppUser(string username, string name, string surname, string email, bool confirmRequired)
        {
            var user = new ApplicationUser();
            user.Id = IdGenerator.New;
            user.Email = email;
            user.EmailConfirmed = !confirmRequired;
            user.UserName = username;
            user.Name = name;
            user.Surname = surname;
            user.Stamp.CreatedBy = user.Id;
            user.Stamp.CreatedAt = DateTime.UtcNow;
            user.Stamp.CreatedByHost = ServicesConfiguration.GetService<IHostInfo>().HostIP;

            user.Claims.Add(new IdentityUserClaim()
            {
                UserId = user.Id,
                ClaimType = ClaimTypes.NameIdentifier,
                ClaimValue = user.Name + " " + user.Surname
            });

            user.Claims.Add(new IdentityUserClaim()
            {
                UserId = user.Id,
                ClaimType = ClaimTypes.Name,
                ClaimValue = user.Id
            });

            user.Claims.Add(new IdentityUserClaim()
            {
                UserId = user.Id,
                ClaimType = ClaimTypes.Role,
                ClaimValue = RoleConstants.Customer
            });

            return user;
        }

        public byte[] DownloadFacebookProfilePicture(string facebookId)
        {
            string pictureEndpoint = "http://graph.facebook.com/{0}/picture?type=large";

            HttpWebRequest pictureRequest = (HttpWebRequest)WebRequest.Create(string.Format(pictureEndpoint, facebookId));
            pictureRequest.UserAgent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; WOW64; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30618) ";
            byte[] retVal;
            using (WebResponse videoR = (HttpWebResponse)pictureRequest.GetResponse())
            {
                using (Stream picResponse = videoR.GetResponseStream())
                {

                    int bytesToRead = 10000;
                    byte[] buffer = new Byte[bytesToRead];
                    int length;
                    int totalBytes = 0;
                    MemoryStream ms = new MemoryStream();
                    do
                    {
                        length = picResponse.Read(buffer, 0, bytesToRead);
                        totalBytes += length;
                        ms.Write(buffer, 0, length);
                        ms.Flush();
                        buffer = new Byte[bytesToRead];

                    } while (length > 0);
                    retVal = ms.ToArray();
                    ms.Close();
                    return retVal;
                }


            }
        }

        public bool GenerateAndSendNewPasswordFromToken(string userId, string code)
        {
            var newPass = IdGenerator.New.Substring(0, 10);
            IdentityResult result = UserManager.ResetPassword(userId, code, newPass);
            var user = UserManager.FindById(userId);
            string body = ServicesConfiguration.GetService<MailTemplater>().ResetPasswordForwardTemplate(user, newPass);
            UserManager.SendEmail(userId, "Şifre Sıfırlama İşlemi", body);
            if (result.Succeeded)
                return true;
            else
            {
                return false;
            }
        }

        public bool SendForgotPasswordConfirmation(string email)
        {

            var user = UserManager.FindByEmail(email);
            if (user != null)
            {
                var token = UserManager.GeneratePasswordResetToken(user.Id);
                var eBll = ServicesConfiguration.GetService<MailTemplater>();
                var tpl = eBll.ForgotPasswordMailTemplater(user, token);
                try
                {
                    UserManager.SendEmail(user.Id, "Mobil Restaurant Parola Sıfırlama İsteği", tpl);
                    return true;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
            else
                return false;

        }

        public bool ConfirmEmail(string userId, string code)
        {
            IdentityResult result = UserManager.ConfirmEmail(userId, code);
            if (result.Succeeded)
                return true;
            else
            {
                return false;
            }
        }

        internal async Task<ApplicationUser> Find(string userName, string password)
        {
            return await UserManager.FindAsync(userName, password);
        }

        private DbCtx Context
        {
            get
            {
                return ServicesConfiguration.GetService<DbCtx>();
            }
        }

        public Client FindClient(string clientId)
        {
            var client = Context.Clients.Find(clientId);

            return client;

        }

        public bool AddRefreshTokenSync(RefreshToken token)
        {

            var existingToken = Context.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

            if (existingToken != null)
            {
                var result = RemoveRefreshTokenSync(existingToken);
            }

            Context.RefreshTokens.Add(token);

            return Context.SaveChanges() > 0;
        }


        public async Task<bool> AddRefreshToken(RefreshToken token)
        {

            var existingToken = Context.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

            if (existingToken != null)
            {
                var result = await RemoveRefreshToken(existingToken);
            }

            Context.RefreshTokens.Add(token);

            return await Context.SaveChangesAsync() > 0;
        }

        public IdentityResult CreateFacebookUser(FacebookAuthUserInfoResult result)
        {

            var user = GenerateNewAppUser(result.Email, result.Name, result.Surname, result.Email, false);

            user.FacebookInfo.ExternalId = result.FacebookId;
            user.Gender = result.Gender.ToLower() == "male" ? Gender.Male : Gender.Female;
            user.FacebookInfo.FacebookAppscopedPageLink = result.FacebookPage;
            user.Logins.Add(new IdentityUserLogin()
            {
                LoginProvider = "Facebook",
                ProviderKey = result.ProvierKey,
                UserId = user.Id
            });

            user.Claims.Add(new IdentityUserClaim()
            {
                ClaimType = ClaimTypes.Role,
                ClaimValue = "FacebookUser",
                UserId = user.Id
            });

            IdentityResult identityResult = this.Create(user);

            if (identityResult.Succeeded)
            {
                try
                {
                    var profilePhoto = this.DownloadFacebookProfilePicture(result.FacebookId);
                    bool set = SetUserProfilePicture(profilePhoto, user.Id, result.FacebookId);
                }
                catch (Exception)
                {
                }


            }

            return identityResult;
        }


        public UserProfile GetUserProfile()
        {
            var appUser = this.UserManager.FindById(_claimsBusiness.CurrentUserId);
            var userProfilePic = attachBll.Get(ApplicationUser.ProfilePictureAttachEntityName, appUser.Id).FirstOrDefault();
            return new UserProfile(appUser, userProfilePic);
        }

        public bool SetUserProfilePicture(byte[] profilePhoto, string appUserId, string facebookId = null)
        {
            if (attachBll.Exists(ApplicationUser.ProfilePictureAttachEntityName, appUserId))
            {
                var profilePic = attachBll.Get(ApplicationUser.ProfilePictureAttachEntityName, appUserId).FirstOrDefault();
                attachBll.Delete(profilePic.Id);
            }

            var photoBytes = CompressHelper.Compress(profilePhoto);
            var ret = attachBll.Create(new EntityAttachment()
            {
                EntityName = ApplicationUser.ProfilePictureAttachEntityName,
                EntityId = appUserId,
                FileName = (string.IsNullOrEmpty(facebookId) ? appUserId : facebookId) + ".jpg",
                Content = photoBytes,
                Length = profilePhoto.Length
            }, true);
            ret.Commit();
            return true;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
            var refreshToken = await Context.RefreshTokens.FindAsync(refreshTokenId);

            if (refreshToken != null)
            {
                Context.RefreshTokens.Remove(refreshToken);
                return await Context.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            Context.RefreshTokens.Remove(refreshToken);
            return await Context.SaveChangesAsync() > 0;
        }

        public bool RemoveRefreshTokenSync(RefreshToken refreshToken)
        {
            Context.RefreshTokens.Remove(refreshToken);
            return Context.SaveChanges() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            var refreshToken = await Context.RefreshTokens.FindAsync(refreshTokenId);

            return refreshToken;
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
            return Context.RefreshTokens.ToList();
        }

        public async Task<ApplicationUser> FindAsync(UserLoginInfo loginInfo)
        {
            ApplicationUser user = await UserManager.FindAsync(loginInfo);

            return user;
        }

        public async Task<ApplicationUser> FindAsync(string loginProvider, string providerKey)
        {
            return await this.FindAsync(new UserLoginInfo(loginProvider, providerKey));
        }

        public async Task<ApplicationUser> FindAsync(string userId)
        {
            return await this.UserManager.FindByIdAsync(userId);
        }

        public IdentityResult Create(ApplicationUser user)
        {
            user.Stamp.CreatedBy = user.Id;
            user.Stamp.CreatedAt = DateTime.UtcNow;
            user.Stamp.CreatedByHost = ServicesConfiguration.GetService<IHostInfo>().HostIP;

            if (user.Claims.FirstOrDefault(d => d.ClaimType == ClaimTypes.Role && d.ClaimValue == Shared.Security.RoleConstants.Customer) == null)
            {
                user.Claims.Add(new IdentityUserClaim()
                {
                    ClaimType = ClaimTypes.Role,
                    ClaimValue = Shared.Security.RoleConstants.Customer,
                    UserId = user.Id
                });

            }

            try
            {
                return UserManager.Create(user);
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                throw;
            }

        }

        public async Task<CodedOperationResult<Identity, RegistrationErrors>> UpdateAppUser(UserProfile userProfile)
        {
            ApplicationUser user = UserManager.FindByEmail(userProfile.Email);
            user.Name = userProfile.Name;
            user.Surname = userProfile.Surname;
            user.Email = userProfile.Email;
            user.BirthDate = userProfile.BirthDate;
            user.Gender = userProfile.Gender;
            user.PhoneNumber = userProfile.Phone;
            CodedOperationResult<Identity, RegistrationErrors> result = new CodedOperationResult<Identity, RegistrationErrors>();
            try
            {
                await UserManager.UpdateAsync(user);
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                result.Errors = result.Errors = new string[] { ex.Message };
                result.ErrorCode = RegistrationErrors.ValidationError;
                return result;
            }
            result.Success = true;
            result.Result = new Identity() { UserName = user.Id, Title = user.Name + " " + user.Surname };

            return result;
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user)
        {
            var result = await UserManager.CreateAsync(user);

            return result;
        }

        public async Task<IdentityResult> AddLoginAsync(string userId, UserLoginInfo login)
        {
            var result = await UserManager.AddLoginAsync(userId, login);

            return result;
        }

        protected UserManager<ApplicationUser, string> UserManager
        {
            get
            {
                return _userManager;
            }
            private set { _userManager = value; }
        }


        public async Task<CodedOperationResult<Identity, RegistrationErrors>> CreateUser(RegisterModel registerModel)
        {
            return await CreateUser(registerModel, true);
        }

        public async Task<CodedOperationResult<Identity, RegistrationErrors>> CreateUser(RegisterModel registerModel, bool confirmRequired)
        {
            ApplicationUser user = UserManager.FindByEmail(registerModel.Email);

            CodedOperationResult<Identity, RegistrationErrors> result = new CodedOperationResult<Identity, RegistrationErrors>();

            if (user != null)
            {
                result.Errors = new string[] { "User Already Exists" };
                result.ErrorCode = RegistrationErrors.UserExists;
                return result;
            }

            user = GenerateNewAppUser(registerModel.Email, registerModel.Name, registerModel.Surname, registerModel.Email, confirmRequired);

            try
            {
                IdentityResult identity = await UserManager.CreateAsync(user, registerModel.Password);
                if (!identity.Succeeded)
                {
                    result.Errors = identity.Errors.ToArray();
                    result.ErrorCode = RegistrationErrors.UnknwownError;
                    return result;
                }
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                List<string> validationErros = new List<string>();
                var errors = ex.EntityValidationErrors.ToList().Select(d => d.ValidationErrors.Select(c => c.PropertyName + " : " + c.ErrorMessage)).ToList();
                errors.ForEach(d => d.ToList().ForEach(c => validationErros.Add(c)));
                result.Errors = validationErros.ToArray();
                result.ErrorCode = RegistrationErrors.ValidationError;
                return result;
            }

            if (confirmRequired)
            {
                string confirmationToken = UserManager.GenerateEmailConfirmationToken(user.Id);
                SendConfirmationMail(user, confirmationToken);
            }

            result.Success = true;
            result.Result = new Identity() { UserName = user.Id, Title = registerModel.Name + " " + registerModel.Surname };

            return result;
        }

        private void SendConfirmationMail(ApplicationUser user, string confirmationToken)
        {
            //TODO : Volkan.  Mail Atmalı
            var eBll = ServicesConfiguration.GetService<MailTemplater>();
            var tpl = eBll.RegisterMailTemplate(user, confirmationToken);
            try
            {
                UserManager.SendEmail(user.Id, "Mobil Restaurant Kullanıcı Kaydı", tpl);

            }
            catch (Exception ex)
            {
                var x = ex;
                throw;
            }
        }


        public ApplicationUser FindByEmail(string email)
        {
            return UserManager.FindByEmail(email);
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                _disposed = true;
            }
        }
    }

    public class ExternalLoginData
    {
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
        public string UserName { get; set; }
        public string ExternalAccessToken { get; set; }
        public string EMail { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        private ExternalLoginData()
        {

        }

        public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
        {
            if (identity == null)
            {
                return null;
            }

            Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

            if (providerKeyClaim == null || string.IsNullOrEmpty(providerKeyClaim.Issuer) || string.IsNullOrEmpty(providerKeyClaim.Value))
            {
                return null;
            }

            if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
            {
                return null;
            }

            return new ExternalLoginData
            {
                LoginProvider = providerKeyClaim.Issuer,
                ProviderKey = providerKeyClaim.Value,
                UserName = identity.FindFirstValue(ClaimTypes.Name),
                ExternalAccessToken = identity.FindFirstValue("ExternalAccessToken"),
                EMail = identity.FindFirstValue(ClaimTypes.Email)
            };
        }
    }
}
