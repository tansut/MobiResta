using Maiter.Shared.Entity;
using Maiter.Shared.ViewModels.Mobile;
using Maiter.Shared.ViewModels.Mobile.RequestTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Business
{
    public class CompanyCustomerRequestsBusiness : EntityBusiness<CompanyCustomerRequest>
    {
        private CompanyCustomerRequestsBusiness companyCustomRequestBusiness;

        public IQueryable<CompanyCustomerRequest> GetCustomerRequestCompanyId(string companyId)
        {
            return this.Get().Where(p => p.CompanyId == companyId);
        }
        public IQueryable<CompanyCustomerRequest> GetCompanyDisabledRequest(string companyId)
        {
            return GetCustomerRequestCompanyId(companyId).Where(p => p.Disabled);

        }

        public List<RequestType> GetAvailableRequests(string companyId)
        {
            var allRequests = RequestTypeFactory.AllCustomerRequests();
            var customrequest = GetCustomerRequestCompanyId(companyId);
            var companyNonRequests = new List<string>();
            foreach (var item in allRequests)
            {
                var data = customrequest.Any(p => p.RequestName == item.Name);

                if (data)
                {
                    var retval = customrequest.FirstOrDefault(p => p.RequestName == item.Name);
                    item.TargetService = retval.TargetService.Value;
                    item.Disabled = retval.Disabled;
                }

            }

            return allRequests.ToList();

        }
        public CompanyCustomerRequest Get(string name, string companyId)
        {
            var retVal = GetCustomerRequestCompanyId(companyId).Where(p => p.RequestName == name);
            if (retVal.Any())
                return retVal.FirstOrDefault();
            else
            {
                var requests = RequestTypeFactory.AllCustomerRequests().FirstOrDefault(p => p.Name == name);
                return new CompanyCustomerRequest()
                {
                    RequestName = requests.Name,
                    CompanyId = companyId,
                    Disabled = false,
                    TargetService = Shared.ViewModels.Company.ServiceKind.Default
                };
            }
        }
    }
}
