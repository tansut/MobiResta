using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Account.MailTemplateModels
{
    public class ForgotPaasswordViewModel
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string ConfirmationLink { get; set; }
    }
}
