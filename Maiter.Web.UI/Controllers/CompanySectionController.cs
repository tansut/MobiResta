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
using Maiter.Shared.Util;
using System.Security;
using System.Collections.Generic;

namespace Maiter.Web.UI.Controllers
{
    public class CompanySectionController : EntityController<CompanySection,CompanySectionBusiness>
    {
        private IClaimsBusiness _claimsBusiness;
        private AttachmentBusiness attachBll;
        private TableBusiness tableBusiness;
        private TagBusiness tagBll;
        CompanyUserBusiness serviceUserBusiness;


        public CompanySectionController(IClaimsBusiness claimsBusiness,  AttachmentBusiness attachBll, TableBusiness tableBusiness, TagBusiness tagBll, CompanyUserBusiness serviceUserBusiness)
        {
            this._claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
            this.tableBusiness = tableBusiness;
            this.tagBll = tagBll;
            this.serviceUserBusiness = serviceUserBusiness;
        }

        [HttpPost]
        public void SaveManagementPlan(string sectionId, [FromBody]ManagerResponsibility plan)
        {
            var company = this.Business.Id(sectionId);
            company.ManagementService = plan;
            Business.Update(company).Commit();
        }

        [HttpPost]
        public void SaveTablePlan(string sectionId, [FromBody]ClientArray<TableResponsibility> responsibility)
        {
            var company = this.Business.Id(sectionId);
            company.TableService = responsibility.List;
            Business.Update(company).Commit();
        }

        [HttpPost]
        public int ValidateTableResponsibity(string sectionId, [FromBody] TableResponsibility responsibity)
        {            
            var entity = this.Business.Id(sectionId);
            if (_claimsBusiness.CurrentUserId != entity.Stamp.CreatedBy)
                throw new SecurityException();
            var tables = tableBusiness.ListOfTables(entity, responsibity);

            return tables.Count;
        }

        protected override void FillEntity(CompanySection entity, ClientDictionary query)
        {
            if (query.GetValue<bool>("tables", false))
            {
                entity.Tables = tableBusiness.Get().Where(p => p.SectionId == entity.Id).OrderBy(m=>m.Name).ToList();
                foreach (var table in entity.Tables)
                {
                    FillAttachments(table, query);
                    FillTags(table, query);
                }
            }

            if (!query.GetValue<bool>("schedule", false) || !Business.CheckUpdateSecurity(entity))
            {
                entity.ManagementService = null;
                //entity.ValeService = null;
            }
            else
            {
                serviceUserBusiness.FillTimingUsers(entity.Id, entity.ManagementService.Timing.Select(p => p.Value).ToList());
                //serviceUserBusiness.FillTimingUsers(entity.Id, entity.ValeService.Timing.Select(p => p.Value).ToList());
            }

            base.FillEntity(entity, query);
        }

    }
}
