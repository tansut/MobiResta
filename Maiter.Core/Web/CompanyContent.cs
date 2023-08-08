using Maiter.Core.Business;
using Maiter.Core.Configuration;
using Maiter.Core.Providers.Barcode;
using System;
using System.Drawing;
using System.Web;

namespace Maiter.Core.Web
{
    public class CompanyContentHandler : IHttpHandler
    {
        /// <summary>
        /// You will need to configure this handler in the Web.config file of your 
        /// web and register it with IIS before being able to use it. For more information
        /// see the following link: http://go.microsoft.com/?linkid=8101007
        /// </summary>
        #region IHttpHandler Members

        public bool IsReusable
        {
            // Return false in case your Managed Handler cannot be reused for another request.
            // Usually this would be false in case you have some state information preserved per request.
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.Url.Segments.Length == 0)
                return;         
            var segment = context.Request.Url.Segments[context.Request.Url.Segments.Length - 1];
            var bll = ServicesConfiguration.GetService<CompanyAppMenuItemBusiness>();
            var item = bll.Id(segment);
            context.Response.ClearContent();
            context.Response.Write(item.Content);
            context.Response.Flush();
            context.Response.End();
        }

        #endregion
    }
}
