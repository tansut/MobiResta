

using Maiter.Shared.Entity;
using Maiter.Shared.ViewModels.Company;
using System.Linq;

namespace Maiter.Core.Business
{
    public class CompanyAppMenuItemBusiness : EntityBusiness<CompanyAppMenuItem>
    {
        public CompanyAppMenuItemBusiness()
        {
            this.DefaultOrder.Clear();
            this.DefaultOrder.Add(new EntityOrderInfo<CompanyAppMenuItem>() { Direction = OrderDirection.Asc, OrderBy = d => new { d.DisplayOrder } });

        }

        //public IQueryable<CompanyAppMenuItemViewModel> ForCustomerCheckIn(string companyId)
        //{
        //    return this.Get().Where(p => p.CompanyId == companyId && p.Enabled == true).Select(p=> new CompanyAppMenuItemViewModel()
        //    {
        //        Id = p.Id,
        //        Title = p.Title
        //    });
        //}

        public IQueryable<CompanyAppMenuItem> GetMenuItemsbyCompanyId(string companyId)
        {
            return this.Get().Where(p => p.CompanyId == companyId);
        }
    }
}