using Maiter.Core.Security;
using Maiter.Core.Util;
using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using Maiter.Shared.ViewModels.Company;
using Maiter.Shared.ViewModels.Mobile;
using Maiter.Shared.ViewModels.Mobile.RequestTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Maiter.Core.Business.Mobile
{
    public partial class RequestBusiness : EntityBusiness<RequestLog>
    {

        public List<MenuViewModel> MenuForCompany(Company company, bool fillItems)
        {
            var result = new List<MenuViewModel>();
            var userCulture = Thread.CurrentThread.CurrentCulture.Name;
            company.MenuRelations = company.MenuRelations.OrderBy(p => p.Menu.DisplayOrder).ToList();

            foreach (var mr in company.MenuRelations)
            {
                
                if (mr.Menu.DisplayOption == MenuDisplayOption.None)
                    continue;
                if (mr.Menu.DisplayOption == MenuDisplayOption.DisplayByLanguage && mr.Menu.Language != userCulture)
                    continue;

                var mvm = MenuViewModel.FromEntity(mr.Menu);


                result.Add(mvm);
            }

            return result;
        }

        public WorkerCheckInResponse WorkerCheckInRequest(RequestBag<CheckInRequest> request)
        {
            var checkInReq = request.RequestContent;
            var company = companyBusiness.Id(request.CompanyId, "Users");
            var user = company.Users.SingleOrDefault(p => p.UserId == ClaimsBusiness.CurrentUserId);
            if (user == null)
                throw new SecurityException("User is not assigned to company");
            if (!user.Enabled)
                throw new SecurityException("User is disabled");


            var recId = IdGenerator.New;

            var instance = new RequestLog()
            {
                Id = recId,
                Location = request.Location,
                RequestInstance = request.RequestContent,
                CheckInId = recId,
                CompanyId = company.Id,
                CompanyName = company.Name,
                Anonymous = !this.ClaimsBusiness.IsAuthenticated,
                RequestType = Maiter.Shared.ViewModels.Mobile.RequestTypes.CheckInRequest.RequestType,
                TargetService = ServiceKind.Worker,
                SourceService = ServiceKind.Worker,
            };

            this.Create(instance).Commit();

            var viewResult = new WorkerCheckInResponse()
            {
                CheckId = recId,
                CompanyName = company.Name,
                CompanyDesc = company.Desc,
                CompanyId = company.Id,
                Roles = user.Roles,
            };

            viewResult.AvailableRequests = RequestTypeFactory.AllCustomerRequests();

            return viewResult;
        }

        public CustomerCheckInResponse CustomerCheckInRequest(RequestBag<CheckInRequest> request)
        {
            var checkInReq = request.RequestContent;
            if (checkInReq.Tag.Type != Shared.ViewModels.Common.TagType.Offline && !checkInReq.Tag.VerifySign())
                throw new BusinessException("Geçersiz etiket");


            ResTable table;
            CompanySection section;
            Company company;
            if (checkInReq.Tag.Type == Shared.ViewModels.Common.TagType.Table)
            {
                table = tableBusiness.GetTableFromTag(checkInReq.Tag);
                if (table == null)
                    throw new BusinessException("Geçersiz masa numarası");
                section = table.Section;
                company = section.Company;
            } else if (checkInReq.Tag.Type == Shared.ViewModels.Common.TagType.Restaurant)
            {
                company = companyBusiness.GetCompanyFromTag(checkInReq.Tag);
                section = null;
                table = null;
            } else
            {
                company = companyBusiness.GetCompanyFromTag(checkInReq.Tag);
                section = null;
                table = null;
            }

            attachBll.FillForCheckIn(company);
            tagBll.FillForCheckIn(company);
            

            if (!ClaimsBusiness.IsAuthenticated)
            {

            }

            var recId = IdGenerator.New;

            var instance = new RequestLog()
            {
                Id = recId,
                Location = request.Location,
                RequestInstance = request.RequestContent,
                CheckInId = recId,
                CompanyId = company.Id,
                SectionId = section != null ? section.Id: "",
                TableId = table != null ? table.Id: "",
                CompanyName = company.Name,
                SectionName = section != null ? section.Name: "",
                TableName = table != null ? table.Name: "",
                Anonymous = !this.ClaimsBusiness.IsAuthenticated,
                RequestType = Maiter.Shared.ViewModels.Mobile.RequestTypes.CheckInRequest.RequestType,
                TargetService = ServiceKind.Customer,
                SourceService = ServiceKind.Customer
            };

            this.Create(instance).Commit();

            var appMenus = company.AppMenuItems.Where(p => p.DisplayOption != MenuDisplayOption.None && (p.DisplayOption == MenuDisplayOption.DisplayAlways || (p.DisplayOption == MenuDisplayOption.DisplayByLanguage && p.Language == Thread.CurrentThread.CurrentCulture.Name))).OrderBy(p => p.DisplayOrder).Select(p => CompanyAppMenuItemViewModel.FromEntity(p)).ToList();

            var attachments = EntityAttachmentViewModel.FromEntityList(company.Attachments);

            var viewResult = new CustomerCheckInResponse()
            {
                CheckId = recId,
                SessionType = (CustomerSessionType)checkInReq.Tag.Type,
                CompanyName = company.Name,
                CompanyDesc = company.Desc,
                SectionName = section != null ? section.Name: "",
                TableName = table != null ? table.Name: "",
                CompanyId = company.Id,
                SectionId = section != null ? section.Id: "",
                TableId = table != null ? table.BarcodeID: "",
                CompanyAttachments =  attachments,
                AvailableRequests = companyCustomerRequestBusiness.GetAvailableRequests(company.Id),
                AppMenuItems = appMenus,
                Menu = MenuForCompany(company, true)
            };

            return viewResult;
        }
    }
}
