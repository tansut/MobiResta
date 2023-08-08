using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Maiter.Core.Util
{
    public class WebHelper
    {
        public static string FullUrlForRequest(string url = "", HttpContext context = null)
        {
            if (context == null)
                context = HttpContext.Current;
            if (context == null || context.Request == null)
                return url;
            return context.Request.Url.AbsoluteUri.Replace(context.Request.Url.AbsolutePath, url);
        }



        public static string GetBaseHttpUri()
        {
            Uri uri = HttpContext.Current.Request.Url;
            return uri.Scheme + "://" + uri.Authority + "/";
        }
    }
}
