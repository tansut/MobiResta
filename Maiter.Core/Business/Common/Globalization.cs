using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Business.Common
{
    public class GlobalizationBusiness: EntityBusiness<Globalization>
    {
        public GlobalizationBusiness()
        {

        }

        public const string NOTSPECIFIED = "<Nne>";
    }
}
