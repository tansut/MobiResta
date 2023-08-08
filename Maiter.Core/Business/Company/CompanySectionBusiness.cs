using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Business
{
    public class CompanySectionBusiness : EntityBusiness<CompanySection>
    {
        private CompanyBusiness companyBusiness;
        public CompanySectionBusiness(CompanyBusiness companyBusiness)
        {
            this.companyBusiness = companyBusiness;
        }




        public override bool CheckInsertSecurity(CompanySection entity)
        {
            var baseSecurity = base.CheckInsertSecurity(entity);


            if (entity.Company == null)
                entity.Company = companyBusiness.Id(entity.CompanyId);

            return baseSecurity && companyBusiness.CheckUpdateSecurity(entity.Company);
        }

    }

}
