using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Business.Mobile;
using Maiter.Core.Infrastructor;
using Maiter.Core.Web;
using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using Maiter.Shared.ViewModels.Mobile;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Maiter.Web.UI.Controllers
{
    public class MobileSessionController: ApiBase
    {
        private IClaimsBusiness _claimsBusiness;
        SessionBusiness sessionBusiness;


        public MobileSessionController(SessionBusiness sessionBusiness, IClaimsBusiness claimsBusiness) : base()
        {
            this._claimsBusiness = claimsBusiness;
            this.sessionBusiness = sessionBusiness;
        }

        [HttpPost]
        public CustomerSessionResponse CreateCustomer(CustomerSessionRequest request)
        {
            return sessionBusiness.CreateCustomer(request);
        }

        [HttpPost]
        public WorkerSessionResponse CreateWorker(WorkerSessionRequest request)
        {
            return sessionBusiness.CreateWorker(request);
        }
    }
}