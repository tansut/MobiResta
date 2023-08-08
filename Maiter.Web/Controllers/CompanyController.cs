using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Maiter.Web.Core;
using Maiter.Core.Business;
using Maiter.Shared.Entity;
using Maiter.Shared.Data;
using Microsoft.AspNet.Mvc;

namespace Maiter.Web.Controllers
{
    public class CompanyController: EntityController<Company>
    {
        public IQueryable<Company> UserCompanyList()
        {
            return new EntityBusiness<Company>().Get();
        }

        public override CreatedResponse Create([FromBody]Company entity)
        {
            //entity.OwnerId = System.Threading.Thread.CurrentPrincipal.Identity.Name;
            return base.Create(entity);
        }
    }
}
