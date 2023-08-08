using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Infrastructor;
using Maiter.Core.Web;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Maiter.Web.UI.Controllers
{
    public class MenuSectionController : EntityController<MenuSection,MenuSectionBusiness>
    {
        private IClaimsBusiness claimsBusiness;
        private AttachmentBusiness attachBll;
        public MenuSectionController(IClaimsBusiness claimsBusiness, AttachmentBusiness attachBll)
        {
            this.claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
        }
    }
}