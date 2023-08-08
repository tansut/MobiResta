using System.Linq;
using Maiter.Core.Business;
using Maiter.Shared.Entity;
using Maiter.Shared.Data;
using Maiter.Core.Web;
using System.Web.Http;
using System.Collections.Generic;
using System.Threading;
using Maiter.Shared.ViewModels.Company;
using Thinktecture.IdentityModel.Authorization.WebApi;
using System.Security.Claims;
using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Business.Common;
using Maiter.Shared.Util;
using System.Security;
using System;

namespace Maiter.Web.UI.Controllers
{
    public class CompanyController : EntityController<Company, CompanyBusiness>
    {
        private IClaimsBusiness _claimsBusiness;
        private AttachmentBusiness attachBll;
        CompanySectionBusiness compSectionBusiness;
        CompanyUserBusiness serviceUserBusiness;
        TableBusiness tableBusiness;
        IEntityBusiness<CompanyMenu> comMenuBusiness;
        CompanyAppMenuItemBusiness menuItemsBusiness;

        private CityBusiness CityBusiness;

        public CompanyController(CompanyAppMenuItemBusiness menuItemsBusiness, IClaimsBusiness claimsBusiness, AttachmentBusiness attachBll, CompanySectionBusiness compSectionBusiness, CompanyUserBusiness serviceUserBusiness, TableBusiness tableBusiness, IEntityBusiness<CompanyMenu> comMenuBusiness, CityBusiness cityBusiness)
        {
            this._claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
            this.compSectionBusiness = compSectionBusiness;
            this.serviceUserBusiness = serviceUserBusiness;
            this.tableBusiness = tableBusiness;
            this.comMenuBusiness = comMenuBusiness;
            this.CityBusiness = cityBusiness;
            this.menuItemsBusiness = menuItemsBusiness;
        }

        [HttpPost]
        public IEnumerable<Company> UserList([FromBody]ClientDictionary query)
        {
            if (query == null)
                query = new ClientDictionary();
            var userId = _claimsBusiness.CurrentUserId;
            var response = Business.Get(p => p.OwnerId == userId).ToList();
            for (int i = 0; i < response.Count; i++)
            {
                this.FillEntity(response[i], query);
            }

            return response.ToList();
        }

        [HttpPost]
        public List<CompanyUser> GetUsers(string companyId, [FromBody]ClientArray<string> userIdList)
        {
            var company = this.Business.Id(companyId);
            if (!Business.CheckUpdateSecurity(company))
                throw new SecurityException("Geçersiz işlem");
            var users = serviceUserBusiness.Get(p => userIdList.List.Contains(p.Id) && p.CompanyId == companyId).ToList();
            serviceUserBusiness.FillUser(users);
            return users;
        }

        [HttpPost]
        public void SaveManagementPlan(string companyId, [FromBody]ManagerResponsibility plan)
        {
            var company = this.Business.Id(companyId);
            company.ManagementService = plan;
            Business.Update(company).Commit();
        }

        [HttpPost]
        public void SaveValePlan(string companyId, [FromBody]ValeResponsibility plan)
        {
            var company = this.Business.Id(companyId);
            company.ValeService = plan;
            Business.Update(company).Commit();
        }

        [HttpGet]
        public List<CompanyUser> SearchUsers(string companyId, string search)
        {
            var company = this.Business.Id(companyId);
            if (!Business.CheckUpdateSecurity(company))
                throw new SecurityException("Geçersiz işlem");
            var query = serviceUserBusiness.Get();
            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.CompanyId == companyId).Where(p => p.User.Email.StartsWith(search) || (p.User.Name + " " + p.User.Surname).Contains(search));
            var list = query.ToList();
            serviceUserBusiness.FillUser(list);
            return list;
        }

        protected override void FillEntity(Company entity, ClientDictionary query)
        {
            if (query.GetValue<bool>("sections", false))
            {
                entity.Sections = compSectionBusiness.Get().Where(p => p.CompanyId == entity.Id).ToList();
                if (query.GetValue<bool>("attachments", false))
                    foreach (var section in entity.Sections)
                    {
                        attachBll.Fill(section, query.GetValue<AttachmentType>("contentType", AttachmentType.Image));
                    }
            }

            if (query.GetValue<bool>("users", false) && Business.CheckUpdateSecurity(entity))
            {
                entity.Users = serviceUserBusiness.Get(p => p.CompanyId == entity.Id).ToList();
                serviceUserBusiness.FillUser(entity.Users);
            }

            if (query.GetValue<bool>("appMenus", false) && Business.CheckUpdateSecurity(entity))
            {
                entity.AppMenuItems = menuItemsBusiness.GetMenuItemsbyCompanyId(entity.Id).ToList();
                if (query.GetValue<bool>("attachments", false))
                    foreach (var section in entity.AppMenuItems)
                    {
                        attachBll.Fill(section, query.GetValue<AttachmentType>("contentType", AttachmentType.Image));
                    }

            }

            if (query.GetValue<bool>("customerRequests", false) && Business.CheckUpdateSecurity(entity))
            {
                //entity.DisabledCustomerRequests = menuItemsBusiness.GetMenuItemsbyCompanyId(entity.Id).ToList();
            }

            if (query.GetValue<bool>("workitems", false) && Business.CheckUpdateSecurity(entity))
            {
                FillWorkItemStatus(entity);
            }

            if (!query.GetValue<bool>("schedule", false) || !Business.CheckUpdateSecurity(entity))
            {
                entity.ManagementService = null;
                entity.ValeService = null;
            }
            else
            {
                serviceUserBusiness.FillTimingUsers(entity.Id, entity.ManagementService.Timing.Select(p => p.Value).ToList());
                serviceUserBusiness.FillTimingUsers(entity.Id, entity.ValeService.Timing.Select(p => p.Value).ToList());
            }

            base.FillEntity(entity, query);
        }


        private void FillWorkItemStatus(Company entity)
        {
            var list = new List<WorkItemStatus>();
            if (entity.Users.Count == 0)
                list.Add(new WorkItemStatus(WorkItem.Employee, serviceUserBusiness.Exists(p => p.CompanyId == entity.Id) ? Completeness.Done : Completeness.None));
            else list.Add(new WorkItemStatus(WorkItem.Employee, Completeness.None));

            if (entity.Attachments.Count == 0)
                list.Add(new WorkItemStatus(WorkItem.Visuals, Business.HasVisuals(entity.Id) ? Completeness.Done : Completeness.None));
            else list.Add(new WorkItemStatus(WorkItem.Visuals, Completeness.None));

            if (entity.Sections.Count == 0)
            {
                entity.Sections = compSectionBusiness.Get(p => p.CompanyId == entity.Id).ToList();
                list.Add(new WorkItemStatus(WorkItem.Sections, entity.Sections.Count > 0 ? Completeness.Done : Completeness.None));
            }
            else list.Add(new WorkItemStatus(WorkItem.Employee, Completeness.None));

            list.Add(new WorkItemStatus(WorkItem.Tables, tableBusiness.Exists(p => p.Section.CompanyId == entity.Id) ? Completeness.Done : Completeness.None));


            var workloads = new List<UserWorkLoad>();

            foreach (var wl in entity.ManagementService.Timing)
            {
                workloads.AddRange(wl.Value.GetAllWorkloads());
                if (workloads.Count > 0) break;
            }

            if (workloads.Count == 0)
                list.Add(new WorkItemStatus(WorkItem.Workhours, Completeness.None));
            else
            {
                foreach (var section in entity.Sections)
                {
                    foreach (var wl in section.ManagementService.Timing)
                    {
                        workloads.AddRange(wl.Value.GetAllWorkloads());
                    }
                    if (workloads.Count > 0) break;

                }
                list.Add(new WorkItemStatus(WorkItem.Workhours, workloads.Count > 0 ? Completeness.Done : Completeness.None));
            }

            list.Add(new WorkItemStatus(WorkItem.Menu, comMenuBusiness.Exists(p => p.CompanyId == entity.Id) ? Completeness.Done : Completeness.None));

            entity.WorkItems = list;

        }

        [HttpGet]
        public City GetCompanyCity(string companyId)
        {
            var newCityId = this.Business.Id(companyId).CityId;
            var newCity = this.CityBusiness.GetCityWithStateAndCountryInfo(newCityId);

            return newCity;
        }
        public override IHttpActionResult Create([FromBody]Company entity)
        {
            entity.OwnerId = _claimsBusiness.CurrentUserId;
           
            return base.Create(entity);
        }
    }
}
