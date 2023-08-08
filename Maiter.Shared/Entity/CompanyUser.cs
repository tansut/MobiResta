using Maiter.Shared.Attributes;
using Maiter.Shared.ViewModels.Company;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Entity
{
    public enum ServiceUserStatus
    {
        Requested,
        Accepted,
        Declined
    }

    [TsClass]
    public class CompanyUser : EntityBase
    {
        private string _email;

        [Required]
        [StringLength(22)]
        public string UserId { get; set; }

        [NotMapped]
        public string Display
        {
            get
            {
                if (!string.IsNullOrEmpty(this.Desc))
                    return this.Desc;
                else if (this.User != null)
                    return string.Format("{0}", this.User.Display);
                else return "";
            }
        }

        [StringLength(255)]
        [Updatable]
        public string Desc { get; set; }

        [Required]
        [StringLength(22)]
        public string CompanyId { get; set; }

        [NotMapped]
        public string EMail
        {
            get
            {
                if (!string.IsNullOrEmpty(this._email))
                    return this._email;
                else if (this.User != null)
                    return this.User.Email;
                else return "";
            }
            set
            {
                this._email = value;
            }
        }

        [Required]
        [Updatable]
        public ServiceUserStatus Status { get; set; }

        [ForeignKey("CompanyId")]
        public Company Company { get; set; }

        [ForeignKey("UserId")]
        [JsonIgnore]
        [TsIgnore]
        public ApplicationUser User { get; set; }

        [Updatable]
        public bool Enabled { get; set; }

        [StringLength(100)]
        [JsonIgnore]
        [TsIgnore]
        public string RolesData { get; set; }

        public List<ServiceKind> _roles { get; set; }

        [NotMapped]
        [Updatable]
        public List<ServiceKind> Roles
        {
            get
            {
                return this._roles == null ?
                    (this._roles = this.Deserialize<List<ServiceKind>>(RolesData)) :
                    this._roles;
            }
            set
            {
                this.RolesData = this.Serialized(value);
                this._roles = null;
            }

        }

        public const string EntityName = "Menu";

        public CompanyUser()
        {
            this.Enabled = true;
            this.Roles = new List<ServiceKind>();
            this.Status = ServiceUserStatus.Requested;
        }
    }
}
