using Maiter.Core.Util;
using Maiter.Shared.Entity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Mobile
{
    public class EntityAttachmentViewModel
    {
        public string Url { get; set; }
        public string Id { get; set; }
        public string Title { get; set; }
        public string Desc { get; set; }
        public string ContentType { get; set; }
        public AttachmentType AttachmentType { get; set; }


        public static List<EntityAttachmentViewModel> FromEntityList(ICollection<EntityAttachment> source)
        {
            var result = new List<EntityAttachmentViewModel>();
            foreach (var item in source)
            {
                result.Add(new EntityAttachmentViewModel()
                {
                    Title = item.Title,
                    Url = item.AttachmentType == AttachmentType.Image ? WebHelper.FullUrlForRequest("/attach/" + item.Id + "___" + item.FileName): item.FileName,
                    Id = item.Id,
                    ContentType = item.ContentType   ,
                    AttachmentType = item.AttachmentType           ,
                    Desc = item.Desc 
                });
            }
            return result;
        }
    }

    public class EntityTagViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public static List<EntityTagViewModel> FromEntityList(ICollection<EntityTag> source)
        {
            var result = new List<EntityTagViewModel>();
            foreach (var item in source)
            {
                result.Add(new EntityTagViewModel()
                {
                    Name = item.Name,
                    Id = item.Id
                });
            }
            return result;
        }
    }
}
