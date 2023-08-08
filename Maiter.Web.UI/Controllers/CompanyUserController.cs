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
    public class CompanyUserController : EntityController<CompanyUser,CompanyUserBusiness>
    {
        private IClaimsBusiness _claimsBusiness;
        private AttachmentBusiness attachBll;
        private TableBusiness tableBusiness;
        private TagBusiness tagBll;

        public CompanyUserController(IClaimsBusiness claimsBusiness,  AttachmentBusiness attachBll, TableBusiness tableBusiness, TagBusiness tagBll) 
        {
            this._claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
            this.tableBusiness = tableBusiness;
            this.tagBll = tagBll;
        }

        public override IHttpActionResult Update(string id, [FromBody] CompanyUser entity)
        {
            return base.Update(id, entity);
        }

        public override IHttpActionResult Create([FromBody] CompanyUser entity)
        {
            var user = AccountBusiness.GetUserByEMail(entity.EMail);
            if (user == null)
                return BadRequest(Resource.InvalidCompanyUserMessage);
            entity.UserId = user.Id;
            entity.Status = ServiceUserStatus.Accepted;
            entity.User = user;
            return base.Create(entity);
        }
    }
}
