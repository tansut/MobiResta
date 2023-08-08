using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.Util
{
    public static class IdGenerator
    {
        public static string New
        {
            get
            {
                return ShortGuid.NewGuid().Value;
            }            
        }

        public static string GeneratorName {
            get
            {
                return "*ID//Generatorx*";
            }
        }
    }
}
