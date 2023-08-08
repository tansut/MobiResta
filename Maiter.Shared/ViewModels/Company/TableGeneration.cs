using Maiter.Shared.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Company
{
    [TsClass]
    public class TableGeneration: Entity.EntityBase
    {
        public string CompanySectionId { get; set; }
        public string Prefix { get; set; }
        public string PostFix { get; set; }
        public int Start { get; set; }
        public int Finish { get; set; }
        public int Digits { get; set; }
        public string Group  { get; set; }
        public string [] Tags { get; set; }
    }
}
