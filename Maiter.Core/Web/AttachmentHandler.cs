using Maiter.Core.Business.Account;
using Maiter.Core.Configuration;
using Maiter.Core.Infrastructor;
using Maiter.Core.Util;
using Maiter.Shared.Entity;
using System;
using System.Drawing;
using System.IO;
using System.Web;

namespace Maiter.Core.Web
{
    public class AttachmentHandler : IHttpHandler
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

            var claimsBll = ServicesConfiguration.GetService<IClaimsBusiness>();

            


            var fileNameAndId = context.Request.Url.Segments[context.Request.Url.Segments.Length - 1];
            var dbId = fileNameAndId.Split(new string[] { "___" }, StringSplitOptions.RemoveEmptyEntries)[0];
            var render = context.Request.QueryString["render"];

            var service = ServicesConfiguration.GetService<IEntityBusiness<EntityAttachment>>();
            var entity = service.Id(dbId);

            MemoryStream output;

            if (entity.AttachmentType == AttachmentType.Image)
            {
                output = (MemoryStream)ImageHelper.GetResized(CompressHelper.Decompress(entity.Content), context.Request.QueryString);
            }
            else
            {
                output = CompressHelper.Decompress(entity.Content);
            }
            context.Response.ClearContent();
            context.Response.ContentType = entity.ContentType;
            context.Response.BinaryWrite(output.ToArray());
            context.Response.Flush();
            context.Response.End();

        }

        #endregion
    }
}
