using Maiter.Shared.Attributes;
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
    public class City: EntityBase
    {
        [Updatable]
        [Required]
        public string Name { get; set; }
        
        [ForeignKey("StateId")]
        public virtual CountryState State { get; set; }

        [Required]
        [StringLength(22)]
        public string StateId { get; set; }
    }
}
