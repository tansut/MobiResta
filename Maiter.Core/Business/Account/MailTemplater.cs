using Maiter.Core.Util;
using Maiter.Shared.Entity;
using Maiter.Shared.ViewModels.Account.MailTemplateModels;
using RazorEngine;
using RazorEngine.Templating;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Maiter.Core.Business.Account
{
    public class MailTemplater
    {
        private string ApiBase = Helper.GetBaseHttpUri() + "api/";

        public MailTemplater()
        {

        }

        private string GetTemplateString(string name)
        {
            return File.ReadAllText(HttpContext.Current.Server.MapPath("~/DynamicTemplating/Account/" + name + ".cshtml"));
        }
        public string RegisterMailTemplate(ApplicationUser user, string code)
        {
            RegisterTemplateViewModel model = new RegisterTemplateViewModel();

            model.Name = user.Name;
            model.Surname = user.Surname;
            string confirmLink = CreateConfirmLink(user, code, "emailconfirm");
            model.ConfirmationLink = confirmLink;
            return Razor.Parse<RegisterTemplateViewModel>(GetTemplateString("RegistrationMailTemplate"), model, "RegistrationMailTemplate");
        }

        public string ForgotPasswordMailTemplater(ApplicationUser user, string code)
        {
            ForgotPaasswordViewModel model = new ForgotPaasswordViewModel();
            model.Name = user.Name;
            model.Surname = user.Surname;
            string confirmLink = CreateConfirmLink(user, code, "forgotpassword");
            model.ConfirmationLink = confirmLink;
            return Razor.Parse<ForgotPaasswordViewModel>(GetTemplateString("ForgotPasswordMailTemplate"), model, "ForgotPasswordMailTemplate");
        }

        private string CreateConfirmLink(ApplicationUser user, string code, string action)
        {
            return ApiBase + "account/" + action + "?userId=" + user.Id + "&code=" + code;
        }

        internal string ResetPasswordForwardTemplate(ApplicationUser user, string newPass)
        {
            ForgotPaasswordViewModel model = new ForgotPaasswordViewModel();
            model.Name = user.Name;
            model.Surname = user.Surname;
            model.ConfirmationLink = ApiBase + "/www/web.html#/app/account/login";
            var viewBag = new DynamicViewBag();
            viewBag.AddValue("newPass", newPass);
            return Razor.Parse<ForgotPaasswordViewModel>(GetTemplateString("ResetPasswordForward"), model, viewBag, "ResetPasswordForward");
        }
    }
}
