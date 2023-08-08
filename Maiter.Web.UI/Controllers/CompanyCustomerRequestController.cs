using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Web;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Maiter.Web.UI.Controllers
{
    public class CompanyCustomerRequestController : EntityController<CompanyCustomerRequest, CompanyCustomerRequestsBusiness>
    {

        private IClaimsBusiness _claimsBusiness;
        public CompanyCustomerRequestController(IClaimsBusiness claimsBusiness)
        {
            this._claimsBusiness = claimsBusiness;
        }
        [HttpGet]
        public IHttpActionResult List(string companyId)
        {
            return Ok(Business.GetAvailableRequests(companyId));
        }
        [HttpGet]
        public IHttpActionResult Get(string requestname, string companyId)
        {
            return Ok(Business.Get(requestname, companyId));
        }
        [HttpPost]
        public IHttpActionResult Save([FromBody] CompanyCustomerRequest req)
        {

            var customerRequest = Business.GetCustomerRequestCompanyId( req.CompanyId).FirstOrDefault(p=>p.RequestName== req.RequestName);
            if (customerRequest == null)
            {
                Business.Create(req).Commit();
            }
            else
            {
               this.Update(customerRequest.Id, req);
            }
            return Ok(req.Id);

        }
    }
}
