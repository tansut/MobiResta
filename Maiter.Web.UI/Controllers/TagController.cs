using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Web;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Maiter.Web.UI.Controllers
{
    public class TagController : EntityController<EntityTag,TagBusiness>
    {
        private IClaimsBusiness claimsBusiness;
        private AttachmentBusiness attachBll;
        private TagBusiness tagBll;


        public TagController( IClaimsBusiness claimsBusiness, AttachmentBusiness attachBll, TagBusiness tagBll)
        {
            this.claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
            this.tagBll = tagBll;
        }

        [HttpGet]
        public List<string> Search(string entityName, string searchText, TagDisplayOption? option = null)
        {
            return Business.SearchForTags(entityName, searchText, option);
        }
    }
}