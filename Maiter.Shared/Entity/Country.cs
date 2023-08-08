using Maiter.Shared.Attributes;
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
    [TsClass]
    public class Country: EntityBase
    {
        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        
        [StringLength(255)]
        public string NativeName { get; set; }
        [Updatable]
        [StringLength(3)]
        public string SortName { get; set; } 

        [JsonIgnore]
        public virtual ICollection<CountryState> State { get; set; }

        public Country()
        {
            State = new List<CountryState>();
        }
    }
}
