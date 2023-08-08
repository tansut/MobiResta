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
    public class CountryBusiness: EntityBusiness<Country>
    {

        public CountryBusiness()
        {
            
        }

        public IQueryable<Country> CahilUlkeler()
        {
            return this.Get().Where(p => p.Name.StartsWith("RR"));
        }
    }
}
