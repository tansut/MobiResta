using System.Linq;
using Maiter.Core.Business;
using Maiter.Shared.Entity;
using Maiter.Shared.Data;
using Maiter.Core.Web;
using System.Web.Http;
using System.Collections.Generic;
using System.Threading;
using System.Data.Entity;

using Thinktecture.IdentityModel.Authorization.WebApi;
using System.Security.Claims;
using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Business.Common;

namespace Maiter.Web.UI.Controllers
{
    public class CityController : EntityController<City,CityBusiness>
    {
        private IClaimsBusiness _claimsBusiness;
        private StateBusiness StateBusiness;
        private CountryBusiness CountryBusiness;
        private CompanyBusiness CompanyBusiness;
        public CityController(CompanyBusiness companyBusiness, StateBusiness stateBusiness,CountryBusiness countryBusiness, IClaimsBusiness claimsBusiness)
        {
            this._claimsBusiness = claimsBusiness;
            this.StateBusiness = stateBusiness;
            this.CountryBusiness = countryBusiness;
            this.CompanyBusiness = companyBusiness;      
        }


        [HttpGet]
        public IQueryable<City> List(string stateId)
        {
            return Business.GetCitiesOfState(stateId);
        }
        
    }
}
