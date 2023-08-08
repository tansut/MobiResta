using Maiter.Core.Business;
using Maiter.Shared.Data;
using Maiter.Shared.Entity;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Maiter.Web.Core
{
    public abstract class EntityController<E> : ApiController where E : EntityBase, new()
    {
        private EntityBusiness<E> business;

        //protected IQueryable<E> AsQueryable()
        //{
        //    return Business.Get();
        //}

        [HttpGet("{id}")]
        public E Id(string id)
        {
            return Business.Id(id);
        }

        [Route("api/[controller]")]
        [HttpDelete("{id}")]
        public void Remove(string id)
        {
            Business.Delete(id);
        }

        [HttpPost]
        public virtual CreatedResponse Create([FromBody]E entity)
        {
            var result = Business.Create(entity);
            return new CreatedResponse()
            {
                Id = result.Id
            };
        }

        protected EntityBusiness<E> Business
        {
            get
            {
                if (business == null)
                    business = new EntityBusiness<E>(this.Host);
                return business;

            }
        }
    }
}
