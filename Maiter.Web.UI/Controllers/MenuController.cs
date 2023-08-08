using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Infrastructor;
using Maiter.Core.Web;
using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Maiter.Web.UI.Controllers
{


    public class MenuController : EntityController<Menu,MenuBusiness>
    {
        private IClaimsBusiness claimsBusiness;
        private AttachmentBusiness attachBll;
        private CompanyBusiness companyBusiness;
        private IEntityBusiness<CompanyMenu> relationBusiness;


        public MenuController(IClaimsBusiness claimsBusiness, AttachmentBusiness attachBll, CompanyBusiness companyBusiness, IEntityBusiness<CompanyMenu> relationBusiness)
        {
            this.claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
            this.companyBusiness = companyBusiness;
            this.relationBusiness = relationBusiness;
        }

        protected override void FillEntity(Menu entity, ClientDictionary query)
        {
            foreach (var section in entity.Sections)
            {
                FillAttachments(section, query);
            }
            if (query.GetValue<bool>("companies", false))
            {
                var companies = relationBusiness.Get().Where(p => p.MenuId == entity.Id).Select(m=>m.CompanyId).ToList();
                entity.CompanyIds = companies;
            }
            base.FillEntity(entity, query);
        }

        [HttpPost]
        public IHttpActionResult UpdateCompanyAssoc(string menuId, [FromBody]ClientArray<string> companies)
        {
            Business.UpdateCompanyAssoc(menuId, companies.List.ToArray()).Commit();
            return Ok();
        }


        [HttpPost]
        public IEnumerable<Menu> UserList([FromBody]ClientDictionary query)
        {
            var userId = claimsBusiness.CurrentUserId;
            var response = Business.Get("Sections").Where(p => p.Stamp.CreatedBy == userId).ToList();
            foreach (var menu in response)
            {
                menu.Sections = menu.Sections.OrderBy(p => p.DisplayOrder).ToList();
            }
            if (query.GetValue<bool>("attachments", false))
            {
                for (int i = 0; i < response.Count; i++)
                {
                    attachBll.Fill(response[i], query.GetValue<AttachmentType>("contentType", AttachmentType.Image));

                    foreach (var section in response[i].Sections)
                    {
                        attachBll.Fill(section, query.GetValue<AttachmentType>("contentType", AttachmentType.Image));
                    }
                }
            }

            return response.ToList();
        }
    }
}