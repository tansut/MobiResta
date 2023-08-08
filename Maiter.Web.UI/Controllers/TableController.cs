using System.Linq;
using Maiter.Core.Business;
using Maiter.Shared.Entity;
using Maiter.Shared.Data;
using Maiter.Core.Web;
using System.Web.Http;
using System.Collections.Generic;
using System.Threading;
using Maiter.Shared.ViewModels.Company;
using Thinktecture.IdentityModel.Authorization.WebApi;
using System.Security.Claims;
using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Business.Common;
using System;

namespace Maiter.Web.UI.Controllers
{
    public class TableController : EntityController<ResTable,TableBusiness>
    {
        private IClaimsBusiness claimsBusiness;
        private AttachmentBusiness attachBll;
        private TagBusiness tagBll;


        public TableController(IClaimsBusiness claimsBusiness, AttachmentBusiness attachBll, TagBusiness tagBll)
        {
            this.claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
            this.tagBll = tagBll;
        }


        [HttpPost]
        public IHttpActionResult Generate(bool simulate, [FromBody] TableGeneration generate)
        {
            var result = Business.Generate(generate, simulate);
            if (!simulate)
                Business.Commit();
            return Ok(result);
        }

        //protected override void FillEntity(ResTable entity, ClientDictionary query)
        //{
        //    if (query.GetValue<Boolean>("attachments", false))
        //        attachBll.Fill(entity, query.Get<string>("contentType"));
        //    if (query.GetValue<Boolean>("tags", false))
        //        tagBll.Fill(entity, query.GetNullableValue<TagDisplayOption>("tagOption"));
        //}

        [HttpPost]
        public IHttpActionResult List(string companyId, string sectionId, [FromBody] ClientDictionary query)
        {
            if (string.IsNullOrEmpty(companyId))
                return BadRequest("companyId");

            var q = Business.Get();
            if (!string.IsNullOrEmpty(sectionId))
                q = q.Where(p => p.SectionId == sectionId);
            else q = q.Where(p => p.Section.CompanyId == companyId);

            var response = q.ToList();

            if (query.GetValue<Boolean>("attachments", false))

                for (int i = 0; i < response.Count; i++)
                {
                    attachBll.Fill(response[i], query.GetValue<AttachmentType>("contentType", AttachmentType.Image));
                }

            if (query.GetValue<Boolean>("tags", false))

            {
                for (int i = 0; i < response.Count; i++)
                {
                    tagBll.Fill(response[i], query.GetNullableValue<TagDisplayOption>("tagOption"));
                }
            }

            return Ok(response);
        }
    }
}