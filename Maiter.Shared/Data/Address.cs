using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.Data
{
    public class Address : EntityBase
    {
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public City City { get; set; }

        public Address()
        {

        }

        public Address(string line1, string line2)
        {

        }
    }
}
