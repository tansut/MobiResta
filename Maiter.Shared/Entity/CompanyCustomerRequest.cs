using Maiter.Shared.Attributes;
using Maiter.Shared.ViewModels.Company;
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
    public class CompanyCustomerRequest: EntityBase
    {
        [Required]
        [StringLength(22)]
        public string CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        [TsIgnore]
        public virtual Company Company { get; set; }

        [Required]
        [StringLength(15)]
        public string RequestName { get; set; }

        [Required]
        [Updatable]
        public bool Disabled { get; set; }

        [Updatable]
        public ServiceKind? TargetService { get; set; }
    }
}
