using Maiter.Core.Configuration;
using Maiter.Core.Providers.Barcode;
using System;
using System.Drawing;
using System.Web;

namespace Maiter.Core.Web
{
    public class BarcodeHandler : IHttpHandler
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
            var segment = context.Request.Url.Segments[HttpContext.Current.Request.Url.Segments.Length - 1];
            var barcodeGenerator = ServicesConfiguration.GetService<IBarcodeGenerator>();

            string code = context.Request.QueryString["code"];
            string width = context.Request.QueryString["width"];
            string height = context.Request.QueryString["height"];
            Bitmap barcodeImage = barcodeGenerator.Generate(code, int.Parse(width), int.Parse(height));

            context.Response.ClearContent();
            context.Response.ContentType = "image/jpeg";
            barcodeImage.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
            context.Response.Flush();
            context.Response.End();
        }

        #endregion
    }
}
