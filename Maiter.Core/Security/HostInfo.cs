using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Maiter.Core.Security
{
    public interface IHostInfo
    {
        string HostIP { get; }
    }

    public class HostInfo : IHostInfo, IDisposable
    {
        private string _hostIp = null;

        public string HostIP
        {
            get
            {
                if (_hostIp == null)
                    _hostIp = GetIPAddress();

                return _hostIp;
            }
        }

        public const string NoIp = "<NoIp>";
        private static IHostInfo none = new HostInfo(NoIp);

        public static IHostInfo None
        {
            get
            {
                return none;
            }
        }

        public HostInfo(string ip)
        {
            this._hostIp = ip;
        }

        public string GetIPAddress()
        {
            HttpContext context = HttpContext.Current;
            if (context != null && context.Request != null)
            {
                string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                if (!string.IsNullOrEmpty(ipAddress))
                {
                    string[] addresses = ipAddress.Split(',');
                    if (addresses.Length != 0)
                    {
                        return addresses[0];
                    }
                }

                return context.Request.ServerVariables["REMOTE_ADDR"];
            }
            else
            {
                return NoIp;
            }
        }

        public void Dispose()
        {

        }

        public HostInfo()
        {
        }
    }
}
