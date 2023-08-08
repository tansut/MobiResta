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
    [TsClass]
    public class CompanyMenu: EntityBase
    {
        [Required]
        [StringLength(22)]
        public string CompanyId { get; set; }

        [Required]
        [StringLength(22)]
        public string MenuId { get; set; }

        [ForeignKey("CompanyId")]
        public Company Company { get; set; }

        [ForeignKey("MenuId")]
        public Menu Menu { get; set; }
    }
}
