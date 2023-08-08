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



namespace Maiter.Core.Business
{

    public class MenuSectionBusiness : EntityBusiness<MenuSection>
    {
        private IEntityBusiness<Menu> menuBusiness;

        public MenuSectionBusiness(IEntityBusiness<Menu> menuBusiness)
        {
            this.menuBusiness = menuBusiness;
            this.DefaultOrder.Clear();
            this.DefaultOrder.Add(new EntityOrderInfo<MenuSection>() { Direction = OrderDirection.Asc, OrderBy = d => new { d.DisplayOrder } });

        }

        public override IEntityBusinessBase<MenuSection, string> Create(MenuSection entity)
        {
            var menu = menuBusiness.Id(entity.MenuId);
            menuBusiness.CheckUpdateSecurity(menu);
            return base.Create(entity);
        }
    }


}