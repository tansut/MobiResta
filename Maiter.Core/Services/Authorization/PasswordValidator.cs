using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Services.Authorization
{
    // Şifre güvenlik kontrolü
    public class AppPasswordValidator : IIdentityValidator<string>
    {
        public int MinLength { get; set; }
        public string Regex { get; set; }
        public AppPasswordValidator()
        {
            MinLength = 6;
            Regex = "";
        }
        public Task<IdentityResult> ValidateAsync(string item)
        {
            List<string> errors = new List<string>();
            IdentityResult result;
            if (item.Length < MinLength)
                errors.Add(string.Format("Şifre {0} karakterden az olamaz", MinLength));
            if (!string.IsNullOrEmpty(Regex) && System.Text.RegularExpressions.Regex.IsMatch(item, Regex))
                errors.Add("Şifre Formata Uymuyor");
            if (errors.Any())
                result = IdentityResult.Failed(errors.ToArray());
            else
                result = IdentityResult.Success;
            return Task.FromResult<IdentityResult>(result);
        }
    }
}
