using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace Maiter.Core.SignalR
{
    public class DefaultHub : Hub
    {
        public void newRequest(object val)
        {
            Clients.All.pushMessage(val);
        }

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public override Task OnReconnected()
        {
            return base.OnReconnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            return base.OnDisconnected(stopCalled);
        }

        public static IHubContext GetContext()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<DefaultHub>();
            return hubContext;
        }

    }
}