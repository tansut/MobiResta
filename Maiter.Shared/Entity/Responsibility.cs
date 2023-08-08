using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Entity
{
    public class UserWorkLoad
    {
        public string UserId { get; set; }
        public string Display { get; set; }
        public int Workload { get; set; }
        public bool AsBackcup { get; set; }
    }

    public class TimeBasedUsers
    {
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public List<UserWorkLoad> Workloads { get; set; }

        public TimeBasedUsers()
        {
            this.Workloads = new List<UserWorkLoad>();
        }
    }

    public class TimingInfo
    {
        public List<TimeBasedUsers> Users { get; set; }

        public List<UserWorkLoad> GetAllWorkloads()
        {
            var result = new List<UserWorkLoad>();
            foreach (var user in this.Users)
            {
                var list = user.Workloads.Select(p => p.UserId).ToList();
                foreach (var wl in user.Workloads)
                {
                    result.Add(wl);
                }
            }
            return result;

        }

        public TimingInfo()
        {
            this.Users = new List<TimeBasedUsers>();
        }
    }


    public class Responsibility<T>
    {
        public T ResourceData { get; set; }
        public Dictionary<int, TimingInfo> Timing { get; set; }

        public void OrderTimings()
        {
            foreach (var item in Timing)
            {
                item.Value.Users = item.Value.Users.OrderBy(p => p.Start).ToList();
            }
        }

        public Responsibility()
        {
            this.Timing = new Dictionary<int, TimingInfo>();

        }
    }

    public class CompanyManager
    {

    }

    public class Vale
    {

    }

    [TsEnum]
    public enum TableSelectionType
    {
        InSelection,
        All        
    }

    [TsClass]
    public class TableSelection
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public TableSelectionType Selection { get; set; }
        public string Expression { get; set; }
        public int Priority { get; set; }

        [JsonIgnore]
        [TsIgnore]
        public Util.TableExpressionParseResult Parsed { get; set; }
    }
    [TsClass]
    public class ManagerResponsibility : Responsibility<CompanyManager>
    {

    }

    [TsClass]
    public class ValeResponsibility : Responsibility<Vale>
    {

    }

    [TsClass]
    public class TableResponsibility : Responsibility<TableSelection>
    {

    }


    public class Responsibilities
    {
        public ManagerResponsibility Management { get; set; }
        public ValeResponsibility Vale { get; set; }
        public TableResponsibility Waiter { get; set; }
    }
}