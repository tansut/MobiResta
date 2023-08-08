using Maiter.Core.Services.Authorization;
using Maiter.Core.Services.EmailService;
using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Security
{
    public class ApplicationUserManager : UserManager<ApplicationUser, string>
    {
        protected class AppDataProtector : IDataProtector
        {
            public byte[] Protect(byte[] userData)
            {
                return userData;
            }

            public byte[] Unprotect(byte[] protectedData)
            {
                return protectedData;
            }
        }

        public ApplicationUserManager(IUserStore<ApplicationUser, string> store)
            : base(store)
        {

            this.UserValidator = new AppUserValidator(this);
            // Configure validation logic for usernames
            // Configure validation logic for passwords
            this.PasswordValidator = new PasswordValidator();

            // Configure user lockout defaults
            this.UserLockoutEnabledByDefault = true;
            this.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            this.MaxFailedAccessAttemptsBeforeLockout = 10;

            this.EmailService = new EmailService();
            this.SmsService = new SmsService();

            this.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(new AppDataProtector())
            {
                TokenLifespan = TimeSpan.FromDays(1)
            };
        }
    }
}
