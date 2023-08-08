using Maiter.Core.Business.Account;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Core.Util;
using Maiter.Shared.Entity;
using Maiter.Shared.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Maiter.Core.Business.Common
{
    public class AttachmentBusiness : EntityBusiness<EntityAttachment>
    {
        public AttachmentBusiness()
        {
            this.DefaultOrder.Clear();
            this.DefaultOrder.Add(new EntityOrderInfo<EntityAttachment>() { Direction = OrderDirection.Asc, OrderBy = d => new { d.DisplayOrder } });
        }

        public override IEntityBusinessBase<EntityAttachment, string> Create(EntityAttachment entity)
        {
            if (string.IsNullOrEmpty(entity.ContentType))
                entity.ContentType = MimeMapping.GetMimeMapping(entity.FileName);
            return base.Create(entity);
        }

        public IEntityBusinessBase<EntityAttachment, string> Create(EntityAttachment entity, bool isAnonymous)
        {
            var created = this.Create(entity);
            if (!isAnonymous)
                return created;
            else
            {
                entity.Stamp.CreatedBy = ClaimsBusiness.AnonymousSystemUser.Id;
                entity.Stamp.CreatedByHost = this.Host.HostIP;
                return created;
            }
        }

        public override void PrepareInsert(EntityAttachment entity)
        {
            base.PrepareInsert(entity);
        }

        public override bool CheckInsertSecurity(EntityAttachment entity)
        {
            return true;
        }

        public override bool CheckDeleteSecurity(EntityAttachment entity)
        {
            var userIsAdmin = ClaimsBusiness.HasRole(RoleConstants.Admin);


            if (userIsAdmin)
            {
                return true;
            }

            var userId = ClaimsBusiness.CurrentUserId;

            if (ApplicationUser.ProfilePictureAttachEntityName == entity.EntityName)
            {
                return entity.EntityId == userId || entity.Stamp.CreatedBy == userId;
            }


            if (entity.Stamp.CreatedBy == userId)
                return true;

            return false;
        }



        public List<EntityAttachment> Fill(IAttachable entity)
        {
            var field = Helper.GetConstants(entity.GetType()).Where(p => p.Name == "EntityName").Single();
            var entityName = (string)field.GetValue(entity.GetType());
            return entity.Attachments = this.Get(entityName, entity.Id).ToList();
        }

        public List<EntityAttachment> Fill(IAttachable entity, AttachmentType? attachType)
        {
            var field = Helper.GetConstants(entity.GetType()).Where(p => p.Name == "EntityName").Single();
            var entityName = (string)field.GetValue(entity.GetType());
            if (!attachType.HasValue)
                attachType = AttachmentType.Image;
            return entity.Attachments = attachType.HasValue ? this.Get(entityName, entity.Id, attachType.Value).ToList() :
                this.Get(entityName, entity.Id).ToList();
        }


        public IQueryable<EntityAttachment> Get(string entityName, string id)
        {
            var q = Get(p => p.EntityId == id && p.EntityName == entityName);
            return q;
        }

        public IQueryable<EntityAttachment> Get(string entityName, string id, AttachmentType attachType)
        {
            var q = Get(p => p.EntityId == id && p.EntityName == entityName && p.AttachmentType == attachType);
            return q;
        }

        internal void FillForCheckIn(Company company)
        {
            var ids = new List<string>() { company.Id };
            ids.AddRange(company.MenuRelations.Select(p => p.Menu).Select(p => p.Id));
            ids.AddRange(company.AppMenuItems.Select(p => p.Id));
            foreach (var mr in company.MenuRelations)
            {
                ids.Add(mr.MenuId);
                foreach (var ms in mr.Menu.Sections)
                {
                    ids.Add(ms.Id);

                    foreach (var fd in ms.Foods)
                    {
                        ids.Add(fd.Id);
                    }
                }
            }

            var attachments = this.Get(p => ids.Contains(p.EntityId)).ToList();
            company.Attachments = attachments.Where(p => p.EntityName == Company.EntityName).ToList();

            foreach (var appMenu in company.AppMenuItems)
            {
                appMenu.Attachments = attachments.Where(p => p.EntityName == CompanyAppMenuItem.EntityName && p.EntityId == appMenu.Id).ToList();
            }

            foreach (var mr in company.MenuRelations)
            {
                mr.Menu.Attachments = attachments.Where(p => p.EntityName == Menu.EntityName && p.EntityId == mr.Menu.Id).ToList();
                foreach (var ms in mr.Menu.Sections)
                {
                    ms.Attachments = attachments.Where(p => p.EntityName == MenuSection.EntityName && p.EntityId == ms.Id).ToList();

                    foreach (var fd in ms.Foods)
                    {
                        fd.Attachments = attachments.Where(p => p.EntityName == Food.EntityName && p.EntityId == fd.Id).ToList();
                    }
                }
            }
        }

        public bool Exists(string entityName, string id, string contentType)
        {
            return this.Exists(d => d.EntityName == entityName && d.EntityId == id && d.ContentType == contentType);
        }

        public bool Exists(string entityName, string id)
        {
            return this.Exists(d => d.EntityName == entityName && d.EntityId == id);
        }
    }
}
