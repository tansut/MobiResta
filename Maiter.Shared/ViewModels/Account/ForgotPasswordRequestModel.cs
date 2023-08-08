using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Account
{
    public class ForgotPasswordRequestModel
    {
        [Required]
        public string Email { get; set; }
    }
    
}
