using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.Entity
{
    public class EntityInfo: EntityBase
    {
        [Required]
        [StringLength(25)]
        public string EntityName { get; set; }

        [Required]
        [StringLength(22)]
        public string EntityId { get; set; }
    }
}
