using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;
using Maiter.Shared.Security;

namespace Maiter.Shared.ViewModels.Company
{
    [TsClass]
    public class WorkItemConstant
    {
        public const string Visuals = "visuals";
        public const string Employee = "employees";
        public const string Tables = "table";
        public const string Sections = "sections";
        public const string Workhours = "workhours";
    }

    [TsEnum]
    public enum WorkItem
    {
        Visuals,
        Employee,
        Tables,
        Menu,
        Sections,
        Workhours,
        AppMenuItems,
        CustomerRequests
    }

    [TsEnum]
    public enum Completeness
    {
        Done,
        None,
        Partial
    }

    [TsClass]
    public class WorkItemStatus
    {
        public WorkItem Item { get; set; }
        public Completeness Status { get; set; }

        public WorkItemStatus(WorkItem item, Completeness status)
        {
            this.Item = item;
            this.Status = status;
        }
    }


    [TsClass]
    public class CompanyWithWorkItemStatus
    {
        public Maiter.Shared.Entity.Company Company { get; set; }
        public List<WorkItemStatus> WorkItems { get; set; }
    }
}
