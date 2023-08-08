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
using Maiter.Core.Business.Mobile;
using Maiter.Shared.ViewModels.Mobile.RequestTypes;
using Microsoft.AspNet.SignalR;

using Maiter.Shared.ViewModels.Mobile;
using Maiter.Shared.ViewModels.Messaging;

namespace Maiter.Web.UI.Controllers
{
    [ClaimsAuthorize()]
    public class RequestController : EntityController<RequestLog, RequestBusiness>
    {
        private IClaimsBusiness _claimsBusiness;


        public RequestController(RequestBusiness bll, IClaimsBusiness claimsBusiness) 
        {
            this._claimsBusiness = claimsBusiness;
        }

        public override IHttpActionResult Update(string id, [FromBody] RequestLog entity)
        {
            return null;
        }

        [HttpPost]
        public RequestResponse PayRequest([FromBody]RequestBag<PayRequest> request)
        {
            return Business.PayRequest(request);
        }

        [HttpPost]
        public RequestResponse CustomRequest([FromBody]RequestBag<CustomRequest> request)
        {
            return Business.CustomRequest(request);
        }


        [HttpPost]
        public RequestResponse ChatRequest([FromBody]RequestBag<ChatRequest> request)
        {
            return Business.ChatRequest(request);
        }

        [HttpPost]
        [AllowAnonymous]
        public CustomerCheckInResponse CustomerCheckInRequest([FromBody]RequestBag<CheckInRequest> request)
        {
            var dbResult = Business.CustomerCheckInRequest(request);
            return dbResult;
        }

        [HttpPost]
        public WorkerCheckInResponse WorkerCheckInRequest([FromBody]RequestBag<CheckInRequest> request)
        {
            var dbResult = Business.WorkerCheckInRequest(request);
            return dbResult;
        }

        


        public override IHttpActionResult Create([FromBody] RequestLog entity)
        {
            return null;
        }

    }
}
