using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Core.Util;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Infrastructure;


using System.Data.Entity;
using System.Reflection;
using Maiter.Shared.Security;
using System.Data.Entity.Validation;
using System.Security;
using Maiter.Shared.Attributes;
using Maiter.Shared.ViewModels.Mobile;

namespace Maiter.Core.Business
{
    public class MenuBusiness : EntityBusiness<Menu>
    {
        private IEntityBusiness<MenuSection> menuSectionBusiness;
        private IEntityBusiness<CompanyMenu> companyRelation;
        CompanyBusiness companyBusiness;

        public MenuBusiness(IEntityBusiness<MenuSection> menuSectionBusiness, IEntityBusiness<CompanyMenu> companyRelation, CompanyBusiness companyBusiness)
        {
            this.menuSectionBusiness = menuSectionBusiness;
            this.companyRelation = companyRelation;
            this.companyBusiness = companyBusiness;
            companyRelation.IgnoreDos = true;

            this.DefaultOrder.Clear();
            this.DefaultOrder.Add(new EntityOrderInfo<Menu>() { Direction = OrderDirection.Asc, OrderBy = d => new { d.DisplayOrder } });
        }




        public override IEntityBusinessBase<Menu, string> Create(Menu entity)
        {
            var mainSection = new MenuSection();
            mainSection.Name = "Default menu section";
            mainSection.Desc = "Created automatically. Click to update";
            entity.Sections.Add(mainSection);
            mainSection.MenuId = entity.GenerateId();
            return base.Create(entity);
        }

        public override Menu Id(string key)
        {
            var result = this.DbSet.Include("Sections").FirstOrDefault(p => p.Id == key);
            result.Sections = result.Sections.OrderBy(p => p.DisplayOrder).ToList();

            return result;
        }

        public IEntityBusiness<Menu> UpdateCompanyAssoc(string menuId, string[] companies)
        {
            var menu = this.Id(menuId);
            var existing = companyRelation.Get().Where(p => p.MenuId == menu.Id);
            foreach (var item in existing)
            {
                companyRelation.Delete(item.Id);
            }

            foreach (var item in companies)
            {
                var company = companyBusiness.Id(item);
                companyBusiness.CheckUpdateSecurity(company);
                companyRelation.Create(new CompanyMenu()
                {
                    MenuId = menu.Id,
                    CompanyId = company.Id
                });
            }

            return this;
        }
    }




}
