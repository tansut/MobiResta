using Maiter.Core.Business;
using Maiter.Core.Db;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using Microsoft.AspNet.Http.Features;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Maiter.Web.Core
{
    [Route("api/[controller]/[action]")]
    public abstract class ApiController: Controller
    {
        private HostInfo host;

        protected HostInfo Host {
            get
            {
                if (this.host == null)
                    this.host = new HostInfo(this.Context.GetFeature<IHttpConnectionFeature>().RemoteIpAddress.ToString());
                return this.host;
            }
        }

        public ApiController()
        {
            
        }


    }
}