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

    [TsEnum]
    public enum TagDisplayOption
    {
        Visible,
        Internal
    }

    [TsClass]
    public class EntityTag : EntityInfo
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
}
