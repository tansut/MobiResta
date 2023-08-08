using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Account
{
    [TsEnum(Module = "Kalitte")]
    public enum RegistrationErrors
    {
        UserExists,
        ValidationError,
        UnknwownError
    }

    [TsClass(Module = "Kalitte")]
    public class RegisterModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string PasswordRepeat { get; set; }
    }
}
