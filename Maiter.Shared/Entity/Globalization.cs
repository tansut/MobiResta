using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Entity
{
    public class Globalization: EntityInfo
    {
        [Required]
        [StringLength(5)]
        public string Culture { get; set; }

        [Required]
        [StringLength(64)]
        public string EntityColumn { get; set; }

        [Required]
        public string EntityValue { get; set; }
    }

    [TsClass]
    public class Culture
    {
        [Required]
        [StringLength(5)]
        public string Code { get; set; }

        [Required]
        [StringLength(25)]
        public string Name { get; set; }

        [Required]
        [StringLength(25)]
        public string NativeName { get; set; }

        [Required]
        [StringLength(3)]
        public string CurrencySymbol { get; set; }
    }
}
