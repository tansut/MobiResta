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
    public class AvailableCustomerRequest: EntityBase
    {
        [Required]
        public int CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        [TsIgnore]
        public virtual Company Company { get; set; }

        [Required]
        [StringLength(25)]
        public string Name { get; set; }

        [Required]
        public bool Enabled { get; set; }
    }


}
