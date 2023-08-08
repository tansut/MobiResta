using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace Maiter.Core.Business.Common
{
    public class CityBusiness : EntityBusiness<City>
    {
        public CityBusiness() 
        {

        }



        public IQueryable<City> GetCitiesOfState(string stateId)
        {
            return this.Get().Where(p => p.StateId == stateId);
        }

        public City GetCityWithStateAndCountryInfo(string cityId)
        {
            var cityWithStateAndCountry = this.Id(cityId,"State", "State.Country");
            
            return cityWithStateAndCountry;
        }
    }
}
