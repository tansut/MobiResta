using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Configuration;
using Maiter.Core.Util;
using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using Maiter.Shared.ViewModels.Account;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.Facebook;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Providers.Authorization
{
    public class FacebookAuthProvider : FacebookAuthenticationProvider
    {

        public override Task Authenticated(FacebookAuthenticatedContext context)
        {
            context.Identity.AddClaim(new Claim("ExternalAccessToken", context.AccessToken));
            context.Identity.AddClaim(new Claim("FacebookID", context.Id));

            AccountBusiness accBll = ServicesConfiguration.GetService<AccountBusiness>();
            AttachmentBusiness attachBll = ServicesConfiguration.GetService<AttachmentBusiness>();
            ApplicationUser user = accBll.FindByEmail(context.Email);

            if (user == null)
            {
                Claim providerKeyClaim = context.Identity.FindFirst(ClaimTypes.NameIdentifier);

                FacebookAuthUserInfoResult result = new FacebookAuthUserInfoResult()
                {
                    Email = context.Email,
                    Name = context.User.GetValue("first_name").ToString(),
                    Surname = context.User.GetValue("last_name").ToString(),
                    ProvierKey = providerKeyClaim.Value,
                    FacebookId = context.Id,
                    Gender = context.User.GetValue("gender").ToString().ToLower(),
                    FacebookPage = context.User.GetValue("link").ToString(),
                    Locale = context.User.GetValue("locale").ToString(),
                    Timezone = context.User.GetValue("timezone").ToString(),
                    ExternalKey = context.AccessToken
                };

                Microsoft.AspNet.Identity.IdentityResult identityResult = accBll.CreateFacebookUser(result);
            }

            return Task.FromResult<object>(null);

        }
    }
}
