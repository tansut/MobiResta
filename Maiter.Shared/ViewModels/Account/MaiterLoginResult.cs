using Maiter.Shared.Security;
using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Account
{
    [TsClass]
    public class WorkerCompanyInfo
    {
        public string CompanyId { get; set; }
        public List<ServiceKind> Roles { get; set; }
        public string CompanyName { get; set; }

        public WorkerCompanyInfo()
        {
            this.Roles = new List<ServiceKind>();
        }
    }
    [TsClass]
    public class WorkerInfo
    {
        public string DefaultCompanyId { get; set; }
        public List<WorkerCompanyInfo> Companies { get; set; }
        public WorkerInfo()
        {
            this.Companies = new List<WorkerCompanyInfo>();
        }
    }

    //[TsClass]
    //public class MaiterLoginResult<T>: LoginResult<T> where T: Identity
    //{
    //    public WorkerInfo Worker { get; set; }
    //}
}
