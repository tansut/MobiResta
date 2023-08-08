using Maiter.Core.Business;
using Maiter.Core.Infrastructor;
using Maiter.Shared.Entity;

namespace Maiter.Core.Infrastructor.Business
{
    [DefaultDependency(typeof(CompanyBusiness))]
    public interface ICompanyBusiness
    {
        bool CheckUpdateSecurity(Company entity);
        IEntityBusinessBase<Company, string> Create(Company entity);
        bool HasVisuals(string companyId);
    }
}