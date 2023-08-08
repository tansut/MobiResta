

using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Account
{
    [TsClass]
    public class UserProfile
    {
        public UserProfile()
        {

        }

        public UserProfile(ApplicationUser appuser, EntityAttachment attachmentInfo)
        {
            this.Name = appuser.Name;
            this.Surname = appuser.Surname;
            this.BirthDate = appuser.BirthDate;
            this.Gender = appuser.Gender;
            this.Email = appuser.Email;
            this.Phone = appuser.PhoneNumber;

            this.ProfilePictureAttachmentInfo = attachmentInfo;
            
        }

        public string Name { get; set; }

        public string Surname { get; set; }

        public DateTime? BirthDate { get; set; }

        public Gender? Gender { get; set; }

        public EntityAttachment ProfilePictureAttachmentInfo { get; set; }

        public string Email { get; set; }
        public string Phone { get; set; }

    }
}

