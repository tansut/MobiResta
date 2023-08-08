using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Core.Util;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Maiter.Core.Business.Common
{
    public class TagBusiness: EntityBusiness<EntityTag>
    {
        public TagBusiness()
        {
            this.IgnoreDos = true;
        }


        public List<string> SearchForTags(string entityName, string searchText, TagDisplayOption? option = null)
        {
            var q = Get().OrderBy(m=>m.Name).Where(p => p.EntityName == entityName);
            if (option != null)
            {
                if (option.Value == TagDisplayOption.Internal)
                    q = q.Where(p => p.Name.StartsWith(":"));
                else q = q.Where(p => !p.Name.StartsWith(":"));
            }
            q = q.Where(p => p.Name.StartsWith(searchText));
            return q.Select(m => m.Name).Distinct().ToList();
        }

        internal void FillForCheckIn(Company company)
        {
            var ids = new List<string>() {  };
            foreach (var mr in company.MenuRelations)
            {
                foreach (var ms in mr.Menu.Sections)
                {
                    foreach (var fd in ms.Foods)
                    {
                        ids.Add(fd.Id);
                    }
                }
            }

            var tags = this.Get(p => ids.Contains(p.EntityId)).ToList();
            foreach (var mr in company.MenuRelations)
            {
                foreach (var ms in mr.Menu.Sections)
                {
                    foreach (var fd in ms.Foods)
                    {
                        fd.Tags = tags.Where(p => p.EntityName == Food.EntityName && p.EntityId == fd.Id).ToList();
                    }
                }
            }
        }


        public List<EntityTag> Fill(ITaggable entity, TagDisplayOption? option)
        {
            var field = Helper.GetConstants(entity.GetType()).Where(p => p.Name == "EntityName").Single();            
            var entityName = (string)field.GetValue(entity.GetType());
            return entity.Tags = this.GetTags(entityName, entity.Id, option);
        }

        protected List<EntityTag> GetTags(string entityName, string id, TagDisplayOption? option = null)
        {
            var q = Get().OrderBy(m=>m.Name).Where(p => p.EntityId == id && p.EntityName == entityName);
            if (option != null)
            {
                if (option.Value == TagDisplayOption.Internal)
                    q = q.Where(p => p.Name.StartsWith(":"));
                else q = q.Where(p => !p.Name.StartsWith(":"));
            }
            return q.ToList();
        }

        public void UpdateTags(ITaggable entity)
        {
            var tags = entity.Tags;
            var field = Helper.GetConstants(entity.GetType()).Where(p => p.Name == "EntityName").Single();
            var entityName = (string)field.GetValue(entity.GetType());
            var existingTags = this.GetTags(entityName, entity.Id);

            foreach (var item in existingTags)
            {
                Delete(item.Id);
            }
            if (entity.Tags != null)
            {
                var uniuqe = new HashSet<string>();
                foreach (var item in entity.Tags)
                {
                    if (!uniuqe.Contains(item.Name))
                    {
                        Create(item);
                        uniuqe.Add(item.Name);
                    }
                }
            }

        }
    }
}
