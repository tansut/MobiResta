using Maiter.Core.Business;
using Maiter.Core.Business.Common;
using Maiter.Core.Configuration;
using Maiter.Core.Infrastructor;
using Maiter.Shared.Data;
using Maiter.Shared.Entity;
using System;
using System.Data.Entity.Infrastructure;
using System.Security;
using System.Web.Http;
namespace Maiter.Core.Web
{
    public abstract class EntityController<E, TBusiness> : ApiBase where E : class, IEntity, new() where TBusiness : class, IEntityBusiness<E>
    {
        private TBusiness business;
        private AttachmentBusiness attachBll;
        private TagBusiness tagBll;

        public TBusiness Business
        {
            get
            {
                return business;
            }
            private set
            {
                if (business != null)
                    throw new InvalidOperationException("The Business For Type " + this.GetType().ToString() + " has aldready been injected trough IoC Container");
                business = value;
            }
        }

        public EntityController()
        {
            this.Business = ServicesConfiguration.GetService<TBusiness>(); // injector kendisi yüklemeli
            this.SetTagBusiness(ServicesConfiguration.GetService<TagBusiness>()); // injector kendisi yüklemeli
            this.SetAttachmentBusiness(ServicesConfiguration.GetService<AttachmentBusiness>()); // injector kendisi yüklemeli
        }

        private void SetAttachmentBusiness(AttachmentBusiness attachBll)
        {
            if (this.attachBll != null)
                throw new InvalidOperationException("The Attachment Business For Type " + this.GetType().ToString() + " has aldready been injected trough IoC Container");
            this.attachBll = attachBll;
        }


        private void SetTagBusiness(TagBusiness tagBll)
        {
            if (this.tagBll != null)
                throw new InvalidOperationException("The Tag Business For Type " + this.GetType().ToString() + " has aldready been injected trough IoC Container");
            this.tagBll = tagBll;
        }


        [HttpGet]
        public virtual IHttpActionResult Id(string id)
        {
            return this.Id(id, null);
        }

        protected virtual void FillEntity(E entity, ClientDictionary query)
        {
            if (entity is IAttachable)
                FillAttachments((IAttachable)entity, query);

            if (entity is ITaggable)
                FillTags((ITaggable)entity, query);
        }

        protected virtual void FillAttachments(IAttachable entity, ClientDictionary query)
        {
            if (query.GetValue<Boolean>("attachments", false))
                attachBll.Fill(entity, query.GetValue<AttachmentType> ("contentType", AttachmentType.Image));
        }

        protected virtual void FillTags(ITaggable entity, ClientDictionary query)
        {
            if (query.GetValue<Boolean>("tags", false))
                tagBll.Fill(entity, query.GetNullableValue<TagDisplayOption>("tagOption"));
        }

        [HttpPost]
        public IHttpActionResult Id(string id, [FromBody] ClientDictionary query)
        {
            try
            {
                var entity = Business.Id(id);

                FillEntity(entity, query == null ? new ClientDictionary() : query);
                return Ok<E>(entity);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        [HttpDelete]
        [Authorize]
        public IHttpActionResult Remove(string id)
        {
            try
            {
                Business.Delete(id).Commit();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (SecurityException)
            {
                return Unauthorized();
            }
            catch (Exception e)
            {

                return BadRequest();
            }

            return Ok();

        }

        [HttpPost]
        [Authorize]
        public virtual IHttpActionResult Create([FromBody]E entity)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            Business.Create(entity).Commit();
            return Ok(new CreatedResponse()
            {
                Id = entity.Id
            });
        }

        [HttpPut]
        [Authorize]
        public virtual IHttpActionResult Update(string id, [FromBody]E entity)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            var sourceEntity = Business.Id(id);
            Business.MergeUpdate(sourceEntity, entity);

            try
            {
                Business.Update(sourceEntity).Commit();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (SecurityException)
            {
                return Unauthorized();
            }
            catch
            {
                return BadRequest();
            }

            return Ok();
        }

    }
}
