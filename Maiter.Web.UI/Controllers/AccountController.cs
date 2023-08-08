using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Maiter.Core.Db;
using Maiter.Shared.Security;
using Maiter.Core.Web;
using System.Web.Http;
using Maiter.Shared.ViewModels.Account;
using Maiter.Core.Business.Account;
using System.Net;
using Maiter.Shared.Entity;
using Maiter.Core.Configuration;
using System.Security.Claims;
using System.Net.Http;
using Microsoft.Owin.Security;
using Newtonsoft.Json.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.OAuth;
using Maiter.Core.Util;
using System.Threading;
using Thinktecture.IdentityModel.Authorization.WebApi;
using Maiter.Core.Web.Results;
using Maiter.Core.Business;

namespace Maiter.Web.UI.Controllers
{
    [ClaimsAuthorize(ClaimTypes.Role, Shared.Security.RoleConstants.Customer)]
    public class AccountController : ApiBase
    {
        AccountBusiness AccountBll;
        CompanyUserBusiness companyUSerBll;
        IClaimsBusiness _claimsBusiness;
        public AccountController(AccountBusiness accountBll, IClaimsBusiness claimsBusiness, CompanyUserBusiness companyUSerBll)
        {
            AccountBll = accountBll;
            this._claimsBusiness = claimsBusiness;
            this.companyUSerBll = companyUSerBll;
        }

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }


        [HttpPost]
        public LoginResult<Identity> Login()
        {
            ApplicationUser user = AccountBusiness.GetUser(_claimsBusiness.CurrentUserId);
            return new LoginResult<Identity>()
            {
                Identity = new Identity() { UserName = _claimsBusiness.CurrentUserId, Title = user.Name + " " + user.Surname },
                Roles = _claimsBusiness.UserRoles(),
                UserData = companyUSerBll.WorkerInfo(_claimsBusiness.CurrentUserId)
            };
        }


        [HttpGet]
        public IHttpActionResult GetUserProfile()
        {
            var userProfile = AccountBll.GetUserProfile();
            return Ok(userProfile);
        }

        [AllowAnonymous]
        [HttpGet]
        public IHttpActionResult EmailConfirm(string userId, string code)
        {
            if (AccountBll.ConfirmEmail(userId, code))
                return Redirect(Helper.GetBaseHttpUri() + "/www/web.html#/app/account/emailconfirmed"); // bunun dinamik olması lazım
            else
                return Redirect(Helper.GetBaseHttpUri() + "/www/web.html#/app/unauthorized"); // bunun dinamik olması lazım  
        }

        [HttpPost]
        [AllowAnonymous]
        public IHttpActionResult ForgotPassword(ForgotPasswordRequestModel model)
        {
            if (AccountBll.SendForgotPasswordConfirmation(model.Email))
                return Ok();
            else
                return BadRequest();
        }

        [HttpPost]
        public async Task<IHttpActionResult> UpdateAccount(UserProfile userModel)
        {
            var result = await AccountBll.UpdateAppUser(userModel);
            if (!result.Success)
            {
                ModelState.AddModelError(result.ErrorCode.ToString(), result.Errors.First());
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [HttpGet]
        [AllowAnonymous]
        public IHttpActionResult ForgotPassword(string userId, string code)
        {
            if (AccountBll.GenerateAndSendNewPasswordFromToken(userId, code))
                return Redirect(Helper.GetBaseHttpUri() + "/www/web.html#/app/account/login?rbcb=1"); // bunun dinamik olması lazım
            else
                return Redirect(Helper.GetBaseHttpUri() + "/www/web.html#/app/unauthorized"); // bunun dinamik olması lazım  
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Register([FromBody]RegisterModel registirationData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await AccountBll.CreateUser(registirationData, true);
            if (!result.Success)
            {
                ModelState.AddModelError(result.ErrorCode.ToString(), result.Errors.First());
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [HttpGet]
        [OverrideAuthentication]
        [OverrideAuthorization]
        [HostAuthentication(AuthenticationConfiguration.DefaultAuthType)]
        [AllowAnonymous]
        public IHttpActionResult UserExists(string email)
        {
            var user = AccountBll.FindByEmail(email);
            return Ok(user != null);
        }

        [HttpGet]
        [OverrideAuthentication]
        [HostAuthentication(AuthenticationConfiguration.DefaultAuthType)]
        [AllowAnonymous]
        [Route("api/Account/ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            string redirectUri = string.Empty;

            if (error != null)
            {
                return BadRequest(Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            var redirectUriValidationResult = ValidateClientAndRedirectUri(this.Request, ref redirectUri);

            if (!string.IsNullOrWhiteSpace(redirectUriValidationResult))
            {
                return BadRequest(redirectUriValidationResult);
            }

            ClaimsIdentity identity = User.Identity as ClaimsIdentity;

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(identity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(AuthenticationConfiguration.DefaultAuthType);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await AccountBll.FindAsync(externalLogin.LoginProvider, externalLogin.ProviderKey);

            bool hasRegistered = user != null;

            redirectUri = string.Format(@"{0}#external_access_token={1}&provider={2}&external_user_name={3}&haslocalaccount={4}&email={5}",
                                            redirectUri,
                                            externalLogin.ExternalAccessToken,
                                            externalLogin.LoginProvider,
                                            externalLogin.UserName,
                                            hasRegistered.ToString(),
                                            externalLogin.EMail);

            return Redirect(redirectUri);

        }


        private string ValidateClientAndRedirectUri(HttpRequestMessage request, ref string redirectUriOutput)
        {

            Uri redirectUri;

            var redirectUriString = GetQueryString(Request, "redirect_uri");

            if (string.IsNullOrWhiteSpace(redirectUriString))
            {
                return "redirect_uri is required";
            }

            bool validUri = Uri.TryCreate(redirectUriString, UriKind.Absolute, out redirectUri);

            if (!validUri)
            {
                return "redirect_uri is invalid";
            }

            var clientId = GetQueryString(Request, "client_id");

            if (string.IsNullOrWhiteSpace(clientId))
            {
                return "client_Id is required";
            }

            var client = AccountBll.FindClient(Helper.GetHash(clientId));

            if (client == null)
            {
                return string.Format("Client_id '{0}' is not registered in the system.", clientId);
            }

            if (client.AllowedOrigin != "*" && !string.Equals(client.AllowedOrigin, redirectUri.GetLeftPart(UriPartial.Authority), StringComparison.OrdinalIgnoreCase))
            {
                return string.Format("The given URL is not allowed by Client_id '{0}' configuration.", clientId);
            }

            redirectUriOutput = redirectUri.AbsoluteUri;

            return string.Empty;

        }

        private string GetQueryString(HttpRequestMessage request, string key)
        {
            var queryStrings = request.GetQueryNameValuePairs();

            if (queryStrings == null) return null;

            var match = queryStrings.FirstOrDefault(keyValue => string.Compare(keyValue.Key, key, true) == 0);

            if (string.IsNullOrEmpty(match.Value)) return null;

            return match.Value;
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private async Task<ParsedExternalAccessToken> VerifyExternalAccessToken(string provider, string accessToken)
        {
            ParsedExternalAccessToken parsedToken = null;

            var verifyTokenEndPoint = "";

            if (provider == "Facebook")
            {
                var appToken = AuthenticationConfiguration.FacebookAppToken;
                verifyTokenEndPoint = string.Format("https://graph.facebook.com/debug_token?input_token={0}&access_token={1}", accessToken, appToken);
            }
            else if (provider == "Google")
            {
                verifyTokenEndPoint = string.Format("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={0}", accessToken);
            }
            else
            {
                return null;
            }

            var client = new HttpClient();
            var uri = new Uri(verifyTokenEndPoint);
            var response = await client.GetAsync(uri);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                dynamic jObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(content);

                parsedToken = new ParsedExternalAccessToken();

                if (provider == "Facebook")
                {
                    parsedToken.user_id = jObj["data"]["user_id"];
                    parsedToken.app_id = jObj["data"]["app_id"];

                    if (!string.Equals(AuthenticationConfiguration.GetFacebookAppId(), parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }
                }
                else if (provider == "Google")
                {
                    parsedToken.user_id = jObj["user_id"];
                    parsedToken.app_id = jObj["audience"];

                    if (!string.Equals(AuthenticationConfiguration.GetGoogleClientId(), parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }

                }

            }

            return parsedToken;
        }


        [AllowAnonymous]
        [Route("api/account/RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(model.Provider, model.ExternalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            ApplicationUser user = await AccountBll.FindAsync(model.Provider, verifiedAccessToken.user_id);
            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                return BadRequest("External user is already registered");
            }

            user = AccountBll.FindByEmail(model.UserName);
            IdentityResult result;
            if (user == null)
            {
                var appUser = AccountBll.GenerateNewAppUser(model.UserName, model.Name, model.Surname, model.UserName, false);

                result = AccountBll.Create(appUser);
                var userPhoto = AccountBll.DownloadFacebookProfilePicture(verifiedAccessToken.user_id);
                AccountBll.SetUserProfilePicture(userPhoto, appUser.Id, verifiedAccessToken.user_id);

                if (!result.Succeeded)
                {
                    return GetErrorResult(result);
                }
            }

            var info = new ExternalLoginInfo()
            {
                DefaultUserName = model.UserName,
                Login = new UserLoginInfo(model.Provider, verifiedAccessToken.user_id)
            };

            result = await AccountBll.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            //generate access token response
            var accessTokenResponse = GenerateLocalAccessTokenResponse(user, model.ClientId);

            return Ok(accessTokenResponse);
        }


        private LocalAccessTokenResponse GenerateLocalAccessTokenResponse(ApplicationUser user, string clientId = "")
        { // external access token içine claim gömdüğümüz yer.

            TimeSpan tokenExpiration;
            if (string.IsNullOrEmpty(clientId))
                tokenExpiration = TimeSpan.FromMinutes(AuthenticationConfiguration.ExternalAccessTokenTimeoutMinute);
            else
            {
                Client client = AccountBll.FindClient(Helper.GetHash(clientId));
                if (client == null)
                    tokenExpiration = TimeSpan.FromMinutes(AuthenticationConfiguration.ExternalAccessTokenTimeoutMinute);
                else
                    tokenExpiration = TimeSpan.FromMinutes(client.RefreshTokenLifeTime);
            }

            ClaimsIdentity identity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);

            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            var roles = user.Claims.Where(d => d.ClaimType == ClaimTypes.Role);

            foreach (var r in roles)
            {
                identity.AddClaim(new Claim(r.ClaimType, r.ClaimValue));
            }

            var props = new AuthenticationProperties(new Dictionary<string, string>
                {
                    {
                        "as:client_id", string.IsNullOrEmpty(clientId) ? "theClientId" : clientId
                    },
                    {
                        "userName", user.UserName
                    }
                })
            {
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.Add(tokenExpiration),
            };

            var ticket = new AuthenticationTicket(identity, props);


            var accessToken = AuthenticationConfiguration.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);

            RefreshToken refToken = new RefreshToken();
            var refreshTokenId = Guid.NewGuid().ToString("n");
            refToken.Id = Helper.GetHash(refreshTokenId);
            refToken.ProtectedTicket = AuthenticationConfiguration.OAuthServerOptions.RefreshTokenFormat.Protect(ticket);
            refToken.Subject = identity.Name;
            refToken.ClientId = string.IsNullOrEmpty(clientId) ? "theClientId" : clientId; // ??
            refToken.IssuedUtc = DateTime.UtcNow;
            refToken.ExpiresUtc = DateTime.UtcNow.Add(tokenExpiration);

            AccountBll.AddRefreshTokenSync(refToken);

            LocalAccessTokenResponse tokenResponse = new LocalAccessTokenResponse()
            {
                UserName = user.UserName,
                AccessToken = accessToken,
                TokenType = "bearer",
                ExpiresIn = tokenExpiration.TotalSeconds,
                Issued = ticket.Properties.IssuedUtc.Value.ToUnixTimeMilliseconds().ToString(),
                Expires = ticket.Properties.ExpiresUtc.Value.ToUnixTimeMilliseconds().ToString(),
                Id = user.Id,
                Refresh_Token = refreshTokenId
            };
            return tokenResponse;
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("api/account/ObtainLocalAccessToken")]
        public async Task<IHttpActionResult> ObtainLocalAccessToken(string provider, string externalAccessToken, string clientId = "")
        {

            if (string.IsNullOrWhiteSpace(provider) || string.IsNullOrWhiteSpace(externalAccessToken))
            {
                return BadRequest("Provider or external access token is not sent");
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(provider, externalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            ApplicationUser user = await AccountBll.FindAsync(new UserLoginInfo(provider, verifiedAccessToken.user_id));

            bool hasRegistered = user != null;

            if (!hasRegistered)
            {
                return BadRequest("External user is not registered");
            }

            //generate access token response
            var accessTokenResponse = GenerateLocalAccessTokenResponse(user, clientId);

            return Ok(accessTokenResponse);

        }
    }
}
