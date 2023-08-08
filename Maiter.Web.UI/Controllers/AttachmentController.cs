using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Core.Util;
using Maiter.Core.Web;
using Maiter.Shared.Data;
using Maiter.Shared.Entity;
using Maiter.Shared.Resource;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Maiter.Web.UI.Controllers
{

    public class AttachmentController : EntityController<EntityAttachment, AttachmentBusiness>
    {
        private IClaimsBusiness claimsBusiness;

        public AttachmentController(IClaimsBusiness claimsBusiness)
        {
            this.claimsBusiness = claimsBusiness;
        }

        [HttpGet]
        public IEnumerable<EntityAttachment> ListOfEntity(string entityName, string entityId, AttachmentType? attachmentType)
        {
            var userId = claimsBusiness.CurrentUserId;
            var response = Business.Get().Where(p => p.EntityId == entityId && p.EntityName == entityName);
            if (attachmentType != null)
                response = response.Where(p => p.AttachmentType == attachmentType.Value);
            return response.ToList();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                this.Request.CreateResponse(HttpStatusCode.UnsupportedMediaType);
            }

            var provider = GetMultipartProvider();
            MultipartFormDataStreamProvider result = null;

            try
            {
                result  = await Request.Content.ReadAsMultipartAsync(provider);
            }
            catch (Exception exc)
            {
                throw new BusinessException(Resource.FileUploadSizeLimitException, exc);
            }
            
            var editId = result.FormData["EditId"];

            EntityAttachment entity = string.IsNullOrEmpty(editId) ?
                new EntityAttachment()
                {
                    EntityId = result.FormData["Id"],
                    EntityName = result.FormData["Entity"],
                    Title = result.FormData["Title"],
                    Desc = result.FormData["Desc"],
                    DisplayOrder = int.Parse(result.FormData["DisplayOrder"]),
                    AttachmentType = AttachmentType.Image
                } : Business.Id(editId);

            if (result.FileData.Any())
            {
                var originalFileName = GetDeserializedFileName(result.FileData.First());
                var uploadedFileInfo = new FileInfo(result.FileData.First().LocalFileName);
                entity.FileName = originalFileName;

                var maxSize = new Size(1920, 0);

                using (FileStream fs = new FileStream(uploadedFileInfo.FullName, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    var newStream = (MemoryStream)ImageHelper.GetResized(fs, maxSize, true);
                    var imageContent = newStream.ToArray();
                    entity.Content = CompressHelper.Compress(imageContent);
                    entity.Length = imageContent.Length;
                    fs.Close();
                }

                File.Delete(uploadedFileInfo.FullName);
            }

            if (!string.IsNullOrEmpty(editId))
            {
                entity.Title = result.FormData["Title"];
                entity.DisplayOrder = int.Parse(result.FormData["DisplayOrder"]);
                entity.Desc = result.FormData["Desc"];

            }

            return string.IsNullOrEmpty(editId) ? this.Create(entity) : this.Update(entity.Id, entity);

        }

        //[HttpPost]
        //[Authorize]
        //public virtual IHttpActionResult CreateVideo([FromBody]EntityAttachment entity)
        //{
        //    Business.Create(entity).Commit();
        //    return Ok(new CreatedResponse()
        //    {
        //        Id = entity.Id
        //    });
        //}

        //[HttpPut]
        //[Authorize]
        //public virtual IHttpActionResult EditVideo(string id, [FromBody]EntityAttachment entity)
        //{

        //}

        private MultipartFormDataStreamProvider GetMultipartProvider()
        {
            var uploadFolder = "~/App_Data/Tmp/FileUploads";
            var root = HttpContext.Current.Server.MapPath(uploadFolder);
            Directory.CreateDirectory(root);
            return new MultipartFormDataStreamProvider(root);
        }

        private string GetDeserializedFileName(MultipartFileData fileData)
        {
            var fileName = GetFileName(fileData);
            return JsonConvert.DeserializeObject(fileName).ToString();
        }

        public string GetFileName(MultipartFileData fileData)
        {
            return fileData.Headers.ContentDisposition.FileName;
        }
    }
}