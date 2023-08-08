using System.Linq;
using Maiter.Core.Business;
using Maiter.Shared.Entity;
using Maiter.Shared.Data;
using Maiter.Core.Web;
using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;
using System.Security.Claims;
using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Business.Common;
using Maiter.Shared.Resource;

namespace Maiter.Web.UI.Controllers
{
    public class CompanyAppMenuItemController : EntityController<CompanyAppMenuItem,CompanyAppMenuItemBusiness>
    {

        private IClaimsBusiness _claimsBusiness;

        public CompanyAppMenuItemController(IClaimsBusiness claimsBusiness)
        {
            this._claimsBusiness = claimsBusiness;
        }

        [HttpGet]
        public IQueryable<CompanyAppMenuItem> List(string companyId)
        {
            return Business.GetMenuItemsbyCompanyId(companyId);
        }
    }
}
