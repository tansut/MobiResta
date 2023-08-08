using Maiter.Core.Util;
using Maiter.Shared.Entity;
using Maiter.Shared.ViewModels.Mobile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Company
{
    public class CompanyAppMenuItemViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Desc { get; set; }
        public string Url { get; set; }
        public string Content { get; set; }

        public AppMenuDisplayOption DisplayType { get; set; }

        public List<EntityAttachmentViewModel> Images { get; set; }
        public List<EntityAttachmentViewModel> Videos { get; set; }

        public CompanyAppMenuItemViewModel()
        {
            this.Images = new List<EntityAttachmentViewModel>();
            this.Videos = new List<EntityAttachmentViewModel>();
        }
        public static CompanyAppMenuItemViewModel FromEntity(CompanyAppMenuItem entity)
        {
            var obj = new CompanyAppMenuItemViewModel()
            {
                Id = entity.Id,
                Title = entity.Title,
                Url = string.Format(WebHelper.FullUrlForRequest("/companycontent/{0}"), entity.Id),
                Desc = entity.Desc,
                DisplayType = entity.DisplayType,
                Content = entity.DisplayType != AppMenuDisplayOption.DisplayAsHome ?
                entity.Content: null
                
            };

            var attaches = EntityAttachmentViewModel.FromEntityList(entity.Attachments);

            obj.Images = attaches.Where(p => p.AttachmentType == AttachmentType.Image).ToList();
            obj.Videos = attaches.Where(p => p.AttachmentType == AttachmentType.VideoLink).ToList();


            return obj;
        }
    }
}
