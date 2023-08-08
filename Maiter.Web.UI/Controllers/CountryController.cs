using System.Linq;
using Maiter.Core.Business;
using Maiter.Shared.Entity;
using Maiter.Shared.Data;
using Maiter.Core.Web;
using System.Web.Http;
using System.Collections.Generic;
using System.Threading;

using Thinktecture.IdentityModel.Authorization.WebApi;
using System.Security.Claims;
using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Business.Common;

namespace Maiter.Web.UI.Controllers
{    
    public class CountryController : EntityController<Country,CountryBusiness>
    {
        private IClaimsBusiness _claimsBusiness;
        

        public CountryController(CountryBusiness compBusiness, IClaimsBusiness claimsBusiness)
        {
            this._claimsBusiness = claimsBusiness;            
        }
        [HttpGet]
        public IQueryable<Country> List()
        {
            return Business.Get();
        }
        [HttpPost]
        public IQueryable<Country> CountryList()
        {
            return Business.Get();
        }
    }
}
