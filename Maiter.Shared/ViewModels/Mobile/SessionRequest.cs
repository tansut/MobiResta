using Maiter.Shared.Data;
using Maiter.Shared.Entity;
using Maiter.Shared.ViewModels.Common;
using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile
{
    [TsEnum]
    public enum CustomerSessionType
    {
        Offline = 0,
        Restaurant = 1,
        Table = 2
    }

    [TsClass]
    public class CheckInResponse
    {
        public string CheckId { get; set; }
    }

    [TsClass]
    public class CustomerCheckInResponse: CheckInResponse
    {
        public string CompanyName { get; set; }
        public string CompanyDesc { get; set; }
        public string SectionName { get; set; }
        public string TableName { get; set; }
        public CustomerSessionType SessionType { get; set; }

        public string CompanyId { get; set; }
        public string SectionId { get; set; }
        public string TableId { get; set; }
        public List<EntityAttachmentViewModel> CompanyAttachments { get; set; }
        public List<RequestType> AvailableRequests { get; set; }
        public List<CompanyAppMenuItemViewModel> AppMenuItems { get; set; }
        public List<MenuViewModel> Menu { get; set; }


        public CustomerCheckInResponse()
        {
            this.CompanyAttachments = new List<EntityAttachmentViewModel>();
            this.AvailableRequests = new List<RequestType>();
            this.AppMenuItems = new List<CompanyAppMenuItemViewModel>();
            this.Menu = new List<MenuViewModel>();
            this.SessionType = CustomerSessionType.Offline;
        }
    }

    [TsClass]
    public class WorkerCheckInResponse : CheckInResponse
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyDesc { get; set; }
        public List<ServiceKind> Roles { get; set; }
        public List<RequestType> AvailableRequests { get; set; }

        public WorkerCheckInResponse()
        {
            this.Roles = new List<ServiceKind>();
            this.AvailableRequests = new List<RequestType>();
        }

    }
}
