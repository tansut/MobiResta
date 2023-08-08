using Maiter.Shared.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Maiter.Shared.Security;
using System.ComponentModel.DataAnnotations;
using Maiter.Shared.Util;
using TypeLite;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Maiter.Shared.Entity
{
    public enum Gender
    {
        Unspecified,
        Male,
        Female,
        Other
    }

    public class ApplicationUser : IdentityUser, IEntity, IAttachable
    {
        public class ExternalUserInfo
        {
            public string ExternalId { get; set; }
        }

        public class UserFacebook : ExternalUserInfo
        {
            public string FacebookAppscopedPageLink { get; set; }
        }

        public class GoogleUser : ExternalUserInfo
        {

        }



        public string Display
        {
            get
            {
                //tansu: Belki de gerekmez.
                if (string.IsNullOrEmpty(this.Name))
                    return this.Email;
                else return string.Format("{0} {1}", this.Name, this.Surname);
            }
        }

        public ApplicationUser() : base()
        {
            this.Stamp = new EntitySecurityStamp();
            this.Attachments = new List<EntityAttachment>();
            this.FacebookInfo = new UserFacebook();
            this.GoogleInfo = new GoogleUser();
            this.Active = true;
        }

        [StringLength(22)]
        public override string Id { get { return base.Id; } set { base.Id = value; } }

        public EntitySecurityStamp Stamp { get; set; }

        public bool Active { get; set; }


        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        public string GenerateId()
        {
            return this.Id = IdGenerator.New;
        }

        /// <summary>
        /// Kullanıcının Adı Bilgisi
        /// </summary>
        [StringLength(100)]
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Kullanıcının Soyadı Bilgisi
        /// </summary>
        [Required]
        [StringLength(100)]
        public string Surname { get; set; }

        [TsIgnore]
        [JsonIgnore]
        public UserFacebook FacebookInfo { get; set; }

        [TsIgnore]
        [JsonIgnore]
        public GoogleUser GoogleInfo { get; set; }

        public DateTime? BirthDate { get; set; }

        public Gender? Gender { get; set; }

        public const string ProfilePictureAttachEntityName = "ProfilePicture";
    }


}
