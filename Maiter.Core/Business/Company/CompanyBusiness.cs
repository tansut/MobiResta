using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Infrastructor;
using Maiter.Core.Infrastructor.Business;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using Maiter.Shared.ViewModels.Common;
using Maiter.Shared.ViewModels.Mobile;
using Maiter.Shared.ViewModels.Mobile.RequestTypes;
using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Business
{
    public class CompanyBusiness : EntityBusiness<Company>, ICompanyBusiness
    {
        private AttachmentBusiness attachBll;

        public CompanyBusiness(AttachmentBusiness attachBll)
        {
            this.attachBll = attachBll;
            this.DefaultOrder.Clear();
            this.DefaultOrder.Add(new EntityOrderInfo<Company>() { OrderBy = d => new { d.Name }, Direction = OrderDirection.Asc });
        }

        internal Company GetCompanyFromTag(TagContent content)
        {
            var entity = this.Get(p => p.BarcodeID == content.Id, "Users", "AppMenuItems",
                 "MenuRelations", "MenuRelations.Menu",
                "MenuRelations.Menu.Sections", "MenuRelations.Menu.Sections.Foods", "MenuRelations.Menu.Sections.Foods.FoodProperties", "MenuRelations.Menu.Sections.Foods.FoodProperties.FoodPropertyItems").SingleOrDefault();

            return entity;
        }

        public override IEntityBusinessBase<Company, string> Update(Company entity)
        {
            if (string.IsNullOrEmpty(entity.BarcodeID))
            {
                var tag = TagContent.Create(TagType.Restaurant, "1.0");
                tag.Id = IdGenerator.New;
                entity.BarcodeID = tag.Id;
                entity.BarcodeVersion = tag.Version;
                entity.BarcodeContent = tag.Serialize();
            }
            return base.Update(entity);
        }

        public override IEntityBusinessBase<Company, string> Create(Company entity)
        {
            var mainSection = new CompanySection();
            mainSection.Name = "Genel";
            mainSection.Desc = "Restaurant Geneli";
            entity.Sections.Add(mainSection);
            mainSection.CompanyId = entity.GenerateId();

            var tag = TagContent.Create(TagType.Restaurant, "1.0");
            tag.Id = IdGenerator.New;
            entity.BarcodeID = tag.Id;
            entity.BarcodeVersion = tag.Version;
            entity.BarcodeContent = tag.Serialize();

            return base.Create(entity);
        }


      


        public override bool CheckUpdateSecurity(Company entity)
        {
            var baseSecurity = base.CheckUpdateSecurity(entity);

            if (entity.OwnerId != ClaimsBusiness.CurrentUserId)
                return false;
            return true;
        }

        public bool HasVisuals(string companyId)
        {
            return attachBll.Exists(Company.EntityName, companyId);
        }
    }

}
