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
    public class CountryState : EntityBase
    {
   

        [Updatable]
        [Required]
        public string  Name { get; set; }


        [ForeignKey("CountryId")]
        public virtual Country Country { get; set; }

        [Required]
        [StringLength(22)]
        public string CountryId { get; set; }

        [JsonIgnore]
        public virtual ICollection<City> City { get; set; }

        public CountryState()
        {
            City = new List<City>();
        }
    }
}
