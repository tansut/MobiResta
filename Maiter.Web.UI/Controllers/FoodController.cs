using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Web;
using Maiter.Shared.Data;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Maiter.Web.UI.Controllers
{
    public class FoodController : EntityController<Food, FoodBusiness>
    {
        private IClaimsBusiness claimsBusiness;
        private AttachmentBusiness attachBll;
        private TagBusiness tagBll;


        public FoodController(FoodBusiness business, IClaimsBusiness claimsBusiness, AttachmentBusiness attachBll, TagBusiness tagBll)
        {
            this.claimsBusiness = claimsBusiness;
            this.attachBll = attachBll;
            this.tagBll = tagBll;
        }

        [HttpGet]
        public IHttpActionResult GetFoodWithProperties(string foodId)
        {
            var entity = Business.GetFoodWithProperties(foodId);
            return Ok(entity);
        }


        public override IHttpActionResult Create([FromBody]Food entity)
        {

            entity.FoodProperties.ToList().ForEach(c =>
            {
                c.Id = null;
                c.FoodPropertyItems.ToList().ForEach(d => d.Id = null);
            });

            Business.Create(entity);

            entity.FoodProperties.ToList().ForEach(c =>
            {
                c.FoodId = entity.Id;
                c.FoodPropertyItems.ToList().ForEach(d => d.FoodPropertyId = c.Id);
            });

            Business.Commit();
            return Ok(new CreatedResponse()
            {
                Id = entity.Id
            });
        }


        public override IHttpActionResult Update(string id, [FromBody]Food entity)
        {
            Business.UpdateWithProperties(id, entity);
            Business.Commit();
            return Ok();
        }


        [HttpPost]
        public IHttpActionResult List(string menuId, string sectionId, [FromBody] ClientDictionary query)
        {
            if (string.IsNullOrEmpty(menuId))
                return BadRequest("menuId");

            var q = Business.Get();
            if (!string.IsNullOrEmpty(sectionId))
                q = q.Where(p => p.MenuSectionId == sectionId);
            else q = q.Where(p => p.MenuSection.MenuId == menuId);

            var response = q.ToList();

            for (int i = 0; i < response.Count; i++)
            {
                FillAttachments(response[i], query);
                FillTags(response[i], query);
            }


            return Ok(response);
        }
    }
}