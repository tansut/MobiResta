using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Infrastructor
{
    public class DefaultDependency : Attribute
    {
        private Type DependantType;

        public DefaultDependency(Type dependantType)
        {
            this.DependantType = dependantType;
        }
    }
}
