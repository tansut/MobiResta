using Maiter.Shared.Entity;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Services.EmailService
{
    public class EmailService : IIdentityMessageService
    {
        public Task SendAsync(IdentityMessage message)
        {
            // Plug in your email service here to send an email.
            sendMail(message);
            return Task.FromResult(0);
        }

        private void sendMail(IdentityMessage message)
        {
           
            MailMessage msj = new MailMessage();
            SmtpClient sc = new SmtpClient();
        
            try
            {
                msj.To.Add(message.Destination);
                msj.Subject = message.Subject;
                msj.SubjectEncoding = Encoding.UTF8;
                msj.BodyEncoding = Encoding.UTF8;
                msj.IsBodyHtml = true;
                msj.Body = message.Body;
                sc.Send(msj);
                msj.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                msj.Dispose();
            }
        }
    }
}
