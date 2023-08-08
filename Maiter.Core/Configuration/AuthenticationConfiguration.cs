using Maiter.Core.Providers.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Facebook;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Configuration;
using Maiter.Core.Business.Account;
using System.Web;

namespace Maiter.Core.Configuration
{
    public static class AuthenticationConfiguration
    {
        public static readonly int AccessTokenTimeoutMinute = 30;
        public static readonly int ExternalAccessTokenTimeoutMinute = 60 * 24;

        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }


        public static GoogleOAuth2AuthenticationOptions googleAuthOptions { get; private set; }
        public static FacebookAuthenticationOptions facebookAuthOptions { get; private set; }
        public static OAuthAuthorizationServerOptions OAuthServerOptions { get; private set; }
        public const string DefaultAuthType = DefaultAuthenticationTypes.ExternalCookie;

        public const string FacebookAppToken = "553761251435219|-UgnXGbt-hnaEjwxRsJg3sLbkHA";
        public const string PublicClientId = "kalitteMaiter";

        public static string GetFacebookAppId()
        {
            return facebookAuthOptions.AppId;
        }

        public static string GetGoogleClientId()
        {
            return googleAuthOptions.ClientId;
        }

        public static void Configure(IAppBuilder app)
        {

            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
            OAuthAuthorizationServerOptions _OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                TokenEndpointPath = new PathString("/api/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(AccessTokenTimeoutMinute),
                Provider = new AuthorizationServerProvider(),
                RefreshTokenProvider = new AuthorizationRefreshTokenProvider(),
#if DEBUG
                ApplicationCanDisplayErrors = true,
                AllowInsecureHttp = true
#endif

            };

            app.Use(async (context, next) =>
            {
                if (context.Request.QueryString.HasValue)
                {
                    if (string.IsNullOrWhiteSpace(context.Request.Headers.Get("Authorization")))
                    {
                        var queryString = HttpUtility.ParseQueryString(context.Request.QueryString.Value);
                        string token = queryString.Get("access_token");

                        if (!string.IsNullOrWhiteSpace(token))
                        {
                            context.Request.Headers.Add("Authorization", new[] { string.Format("Bearer {0}", token) });
                        }
                    }
                }

                await next.Invoke();
            });

            // Token Generation
            app.UseOAuthAuthorizationServer(_OAuthServerOptions);
            OAuthServerOptions = _OAuthServerOptions;

            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();
            app.UseOAuthBearerAuthentication(OAuthBearerOptions);



            facebookAuthOptions = new FacebookAuthenticationOptions()
            {
                AppId = "553761251435219",
                AppSecret = "e4ec9355d122c7da0ca7e0022d751bb9",
                Provider = new FacebookAuthProvider()
            };
            app.UseFacebookAuthentication(facebookAuthOptions);


            facebookAuthOptions.Scope.Add("public_profile");
            facebookAuthOptions.Scope.Add("email");
            facebookAuthOptions.Scope.Add("user_photos");

        }

    }
}
