using Maiter.Shared.Entity;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Services.Authorization
{
    // Kullanıcı bilgileri zorunlu alan vs. kontrolü
    public class AppUserValidator : IIdentityValidator<ApplicationUser>
    {
        private readonly UserManager<ApplicationUser, string> userManager;

        public AppUserValidator(UserManager<ApplicationUser, string> manager)
        {
            userManager = manager;
        }
        public Task<IdentityResult> ValidateAsync(ApplicationUser item)
        {
            List<string> errors = new List<string>();

            if (string.IsNullOrWhiteSpace(item.UserName))
                errors.Add("Kullanıcı adı alanı boş girilemez");
            else if (string.IsNullOrWhiteSpace(item.Email))
                errors.Add("EMail alanı boş girilemez");
            IdentityResult result;
            if (errors.Any())
                result = IdentityResult.Failed(errors.ToArray());
            else
                result = IdentityResult.Success;
            return Task.FromResult<IdentityResult>(result);
        }
    }
}
