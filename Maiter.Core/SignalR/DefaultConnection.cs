using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hosting;
using Maiter.Core.Business.Account;
using Maiter.Core.Configuration;
using Maiter.Shared.ViewModels.Messaging;

namespace Maiter.Core.SignalR
{
    public class DefaultConnection : PersistentConnection
    {
        private IClaimsBusiness claims;

        public DefaultConnection()
        {
            this.claims = ServicesConfiguration.GetService<IClaimsBusiness>();
        }

        protected override Task OnReceived(IRequest request, string connectionId, string data)
        {
            var baseObj = Newtonsoft.Json.JsonConvert.DeserializeObject<ClientMessageBase>(data);
            if (!string.IsNullOrEmpty(baseObj.MessageType))
            {
                var type = MessageFactory.Get(baseObj.MessageType);

                return SendToUser(baseObj.MessageContent.ToUserId, data);
            }
            return null;
        }

        public static Task SendToUser<T>(string userId, ClientMessage<T> message) where T : MessageBase, new()
        {
            return GetContext().Groups.Send(userId, message);
        }

        public Task SendToUser(string userId, object data)
        {
            return this.Groups.Send(userId, data);
        }

        protected override Task OnConnected(IRequest request, string connectionId)
        {
            var claims = ServicesConfiguration.GetService<IClaimsBusiness>();
            this.Groups.Add(connectionId, claims.CurrentUserId);
            return base.OnConnected(request, connectionId);
        }

        protected override Task OnDisconnected(IRequest request, string connectionId, bool stopCalled)
        {
            return base.OnDisconnected(request, connectionId, stopCalled);
        }

        protected override Task OnReconnected(IRequest request, string connectionId)
        {
            return base.OnReconnected(request, connectionId);
        }

        protected override bool AuthorizeRequest(IRequest request)
        {
            return claims.IsAuthenticated;
        }

        public override Task ProcessRequest(HostContext context)
        {
            return base.ProcessRequest(context);
        }

        public static IPersistentConnectionContext GetContext()
        {
            return GlobalHost.ConnectionManager.GetConnectionContext<DefaultConnection>();
        }
    }
}