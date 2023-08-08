using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Maiter.Shared.ViewModels.Account;
using Maiter.Shared.Util;

namespace Maiter.Core.Business
{
    public class CompanyUserBusiness : EntityBusiness<CompanyUser>
    {
        private TableBusiness tableBusiness;
        private CompanyBusiness companyBusiness;
        private AccountBusiness accountBusiness;

        public CompanyUserBusiness(CompanyBusiness companyBusiness, AccountBusiness accountBusiness, TableBusiness tableBusiness)
        {
            this.companyBusiness = companyBusiness;
            this.accountBusiness = accountBusiness;
            this.tableBusiness = tableBusiness;
        }

        public override void MergeUpdate(CompanyUser orig, CompanyUser client)
        {
            base.MergeUpdate(orig, client);
            orig.Roles = client.Roles;
        }

        public void FillTimingUsers(string companyId, IList<TimingInfo> timings)
        {
            var list = new List<UserWorkLoad>();
            foreach (var timing in timings)
            {
                list.AddRange(timing.GetAllWorkloads());
            }
            var idList = list.Select(p => p.UserId).Distinct();
            var userList = this.Get().Where(p => p.CompanyId == companyId).Where(m => idList.Contains(m.Id)).ToList();

            foreach (var item in list)
            {
                var user = userList.SingleOrDefault(p => p.Id == item.UserId);
                if (user != null)
                {
                    FillUser(new CompanyUser[] { user });
                    item.Display = user.Display;
                }
                else
                {
                    // User seems removed
                }
            }
        }

        public override CompanyUser Id(string key)
        {
            var entity = base.Id(key);
            entity.User = AccountBusiness.GetUser(entity.UserId);
            return entity;
        }

        public CompanyUser FindUser(string companyId, string userId)
        {
            var result = this.Get("User").Where(p => p.CompanyId == companyId && p.UserId == userId).SingleOrDefault();
            return result;
        }

        public WorkerInfo WorkerInfo(string userId)
        {
            var userInCompany = this.Get("Company").Where(p => p.UserId == userId && p.Status == ServiceUserStatus.Accepted).ToList();
            if (userInCompany.Count == 0)
                return null;
            else
            {
                var result = new WorkerInfo();
                foreach (var item in userInCompany)
                {
                    var company = new WorkerCompanyInfo()
                    {
                        CompanyId = item.CompanyId,
                        CompanyName = item.Company.Name,
                        Roles = item.Roles
                    };
                    result.Companies.Add(company);
                }
                return result;
            }
        }

        public CompanyUser FindUserForTable(ResTable table, DateTime time)
        {            
            var section = table.Section;
            TableResponsibility matched = null;
            foreach(var item in section.TableService)
            {
                var query = tableBusiness.ListOfTablesQuery(section, item.ResourceData.Parsed == null? TableSelectionParser.Parse(item.ResourceData.Expression): item.ResourceData.Parsed, section.Tables);
                if (query.Any(p => p.Id == table.Id))
                {
                    matched = item;
                    break;
                }
            }

            if (matched == null)
                throw new BusinessException("Masanıza hizmet tanımı yapılmamış gözüküyor. Lütfen yöneticilerle iletişime geçin.");

            TimingInfo timingInfo = null;


            var lookDay = (int)time.DayOfWeek;
            var lookCount = 1;

            while(lookCount < 8)
            {
                if (lookDay < 0) lookDay = 6;
                if (matched.Timing.TryGetValue(lookDay--, out timingInfo))
                {
                    if (timingInfo.Users.Count > 0)
                        break;
                }
                lookCount++;
            }

            if (timingInfo == null)
                throw new BusinessException("Şu anda bu hizmet maalesef sağlanamamaktadır");

            var bestMatch = timingInfo.Users.Where(p => time.TimeOfDay >= p.Start.TimeOfDay && time.TimeOfDay < p.Finish.TimeOfDay ).FirstOrDefault();

            if (bestMatch == null)
                bestMatch = timingInfo.Users[0];

            if (bestMatch != null)
            {
                var user = bestMatch.Workloads.FirstOrDefault(p => !p.AsBackcup);
                if (user == null)
                    throw new BusinessException("Şu anda bu hizmet maalesef sağlanamamaktadır");

                var companyUser = this.Get().Where(p => p.CompanyId == section.CompanyId && p.Id == user.UserId && p.Enabled).SingleOrDefault();
                if (companyUser == null)
                    throw new BusinessException("Şu anda bu hizmet maalesef sağlanamamaktadır");

                return companyUser;

            }
            else throw new BusinessException("Şu anda bu hizmet maalesef sağlanamamaktadır"); 

        }

        public override bool CheckInsertSecurity(CompanyUser entity)
        {
            var baseSecurity = base.CheckInsertSecurity(entity);

            if (entity.Company == null)
                entity.Company = companyBusiness.Id(entity.CompanyId);

            return baseSecurity && companyBusiness.CheckUpdateSecurity(entity.Company);
        }

        public void FillUser(ICollection<CompanyUser> users)
        {
            foreach (var item in users)
            {
                item.User = AccountBusiness.GetUser(item.UserId);
            }
        }
    }

}
