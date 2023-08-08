using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Shared.Data;
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
using System.Threading.Tasks;
using Maiter.Shared.Security;
using Maiter.Shared.ViewModels;
using Maiter.Core.SignalR;
using Maiter.Shared.ViewModels.Messaging;
using Maiter.Shared.ViewModels.Account;

namespace Maiter.Core.Business.Mobile
{
    public partial class RequestBusiness: EntityBusiness<RequestLog>
    {
        AttachmentBusiness attachBll;
        TagBusiness tagBll;
        CompanySectionBusiness compSectionBusiness;
        CompanyUserBusiness serviceUserBusiness;
        CompanyBusiness companyBusiness;
        CompanyCustomerRequestsBusiness companyCustomerRequestBusiness;
        CompanyAppMenuItemBusiness companyappMenuBusiness;
        TableBusiness tableBusiness;


        public RequestBusiness(TagBusiness tagBll, CompanyAppMenuItemBusiness companyappMenuBusiness, AttachmentBusiness attachBll, CompanyBusiness companyBusiness, CompanySectionBusiness compSectionBusiness, TableBusiness tableBusiness, CompanyUserBusiness serviceUserBusiness, CompanyCustomerRequestsBusiness customerRequestBusiness, IDbContext ctx, IHostInfo info, IClaimsBusiness _claimsBusiness) {
            this.companyBusiness = companyBusiness;
            this.tableBusiness = tableBusiness;
            this.compSectionBusiness = compSectionBusiness;
            this.serviceUserBusiness = serviceUserBusiness;
            this.attachBll = attachBll;
            this.companyappMenuBusiness = companyappMenuBusiness;
            this.tagBll = tagBll;
            this.companyCustomerRequestBusiness = customerRequestBusiness;
        }

        public RequestResponse PayRequest(RequestBag<PayRequest> request)
        {
            var instance = this.FromRequestBag(request);
            instance.RequestInstance = request.RequestContent;
            instance.RequestType = Maiter.Shared.ViewModels.Mobile.RequestTypes.PayRequest.RequestType;

            this.Create(instance);

            var worker = serviceUserBusiness.FindUserForTable(request.Table, DateTime.UtcNow);

            var message = new CustomerRequestMessage()
            {
                UserContent = instance.UserContent,
                Id = instance.Id,
                RequestType = instance.RequestType,
                RequestContent = request.RequestContent,
                FromUserId = instance.Stamp.CreatedBy,
                FromUserName = instance.TableName,
                ToUserId = worker.UserId,
                ToService = instance.TargetService.Value,
                FromService = ServiceKind.Customer,
                ToUserName = string.IsNullOrEmpty(worker.Display) ? request.Company.Name : worker.Display
            };

            var clientMessage = new ClientMessage<CustomerRequestMessage>()
            {
                MessageContent = message,
                MessageType = CustomerRequestMessage.TYPE
            };

            DefaultConnection.SendToUser<CustomerRequestMessage>(message.ToUserId, clientMessage);

            this.Commit();

            return RequestResponse.FromMessage(clientMessage.MessageType, message);
        }

        public RequestResponse ChatRequest(RequestBag<ChatRequest> request)
        {
            var instance = this.FromRequestBag(request);
            instance.RequestInstance = request.RequestContent;
            instance.RequestType = Maiter.Shared.ViewModels.Mobile.RequestTypes.ChatRequest.RequestType;

            this.Create(instance);

            var targetUser = AccountBusiness.GetUser(request.RequestContent.ToUserId);

            CompanyUser toWorker = request.Company.Users.SingleOrDefault(p => p.UserId == request.RequestContent.ToUserId && p.Enabled);
            CompanyUser fromWorker = request.Company.Users.SingleOrDefault(p => p.UserId == ClaimsBusiness.CurrentUserId && p.Enabled);

            if (request.Source == ServiceKind.Customer)
            {
                if (toWorker == null)
                    throw new BusinessException("It seems we have a wrong to worker");
            } else if (request.Source != ServiceKind.Customer)
            {
                if (fromWorker == null)
                    throw new BusinessException("It seems we have a wrong from worker");
            }


            var message = new CustomerRequestMessage()
            {
                UserContent = instance.UserContent,
                Id = instance.Id,
                RequestType = instance.RequestType,
                RequestContent = request.RequestContent,
                FromUserId = instance.Stamp.CreatedBy,
                FromUserName = request.Source == ServiceKind.Customer ? 
                    instance.TableName: string.IsNullOrEmpty(fromWorker.Display) ? request.Company.Name: fromWorker.Display, 
                ToUserId = targetUser.Id,
                ToService = instance.TargetService.Value,
                FromService = instance.SourceService.Value,
                ToUserName = toWorker != null ? (string.IsNullOrEmpty(toWorker.Display) ? request.Company.Name : toWorker.Display):  targetUser.Display
            };

            var clientMessage = new ClientMessage<ChatMessage>()
            {
                MessageContent = message,
                MessageType = ChatMessage.TYPE
            };

            DefaultConnection.SendToUser<ChatMessage>(message.ToUserId, clientMessage);

            this.Commit();

            return RequestResponse.FromMessage(clientMessage.MessageType, message);
        }

        public RequestResponse CustomRequest(RequestBag<CustomRequest> request)
        {
            var instance = this.FromRequestBag(request);
            instance.RequestInstance = request.RequestContent;
            instance.RequestType = Maiter.Shared.ViewModels.Mobile.RequestTypes.CustomRequest.RequestType;

            this.Create(instance);

            var worker = serviceUserBusiness.FindUserForTable(request.Table, DateTime.UtcNow);

            var message = new CustomerRequestMessage()
            {
                UserContent = instance.UserContent,
                Id = instance.Id,
                RequestType = instance.RequestType,
                RequestContent = request.RequestContent,
                FromUserId = instance.Stamp.CreatedBy,
                FromUserName = instance.TableName,
                ToUserId = worker.UserId,
                ToService = instance.TargetService.Value,
                FromService = ServiceKind.Customer,
                ToUserName = string.IsNullOrEmpty(worker.Display) ? request.Company.Name : worker.Display
            };

            var clientMessage = new ClientMessage<CustomerRequestMessage>()
            {
                MessageContent = message,
                MessageType = CustomerRequestMessage.TYPE
            };

            DefaultConnection.SendToUser<CustomerRequestMessage>(message.ToUserId, clientMessage);

            this.Commit();

            return RequestResponse.FromMessage(clientMessage.MessageType, message);
        }

        private RequestLog FromRequestBag(RequestBagBase request)
        {
            var table = request.Table = !string.IsNullOrEmpty(request.TableId) ? tableBusiness.BarcodeID(request.TableId) : null;
            var section = request.CompanySection = table != null? table.Section: (!string.IsNullOrEmpty(request.CompanySectionId) ? compSectionBusiness.Id(request.CompanySectionId, "Company", "Company.Users") : null);
            var company = request.Company = section != null? section.Company: (companyBusiness.Id(request.CompanyId, "Users"));
            if (section != null)
                section.Tables = tableBusiness.Get(p => p.SectionId == section.Id).ToList();               
            if (request.Source == ServiceKind.Customer)
            {                
                
            }
            else
            {

            }

            var instance = new RequestLog()
            {
                Location = request.Location,                
                CheckInId = request.CheckInId,
                Anonymous = !this.ClaimsBusiness.IsAuthenticated,                
                TargetService = request.Target,
                SourceService = request.Source,
                CompanyId = company.Id,
                SectionId = section != null ? section.Id: null,
                TableId = table != null? table.Id: null,
                CompanyName = company.Name,
                SectionName = section != null ? section.Name : null,
                TableName = table != null ? table.Name : null,
                UserContent = request.UserText,
                RequestContent = ""
            };

            return instance;
        }

        public override bool CheckInsertSecurity(RequestLog entity)
        {
            return true;
        }


        protected internal override void FillSecurityStamp(EntitySecurityStamp stamp, OperationType type)
        {
            //base.FillSecurityStamp(stamp, type);
        }

        public override void PrepareInsert(RequestLog entity)
        {
            base.PrepareInsert(entity);
            if (entity.Anonymous)
            {
                entity.Stamp.CreatedBy = ClaimsBusiness.AnonymousSystemUser.Id; 
                entity.Stamp.CreatedAt = DateTime.UtcNow;
                entity.Stamp.CreatedByHost = this.Host.HostIP;
            }
            else base.FillSecurityStamp(entity.Stamp, OperationType.Insert);
        }



        

        public override IEntityBusinessBase<RequestLog, string> Create(RequestLog entity)
        {
            return base.Create(entity);
        }

        private void ValidateRequest(GeoPoint requestLocation, GeoPoint companyLocation)
        {
            //if (!GeographyHelper.IsInside(companyLocation, requestLocation, 25))
            //    throw new SecurityException("Lokasyon doğrulanamadı");

            //TODO: (Session ile request lokasyonu kontrolü)
            //if (session.Stamp.CreatedAt.AddHours(8) < DateTime.Now)
            //    throw new SecurityException("Session seems expired. Please relogin.");
            //if (!session.Anonymous && session.Stamp.CreatedBy != ClaimsBusiness.CurrentUserId)
            //    throw new SecurityException("Please reelogin");
        }
    }
}
