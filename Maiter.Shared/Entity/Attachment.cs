using Maiter.Shared.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using TypeLite;

namespace Maiter.Shared.Entity
{
    [TsEnum]
    public enum AttachmentType
    {
        Image = 0,
        VideoLink = 1
    }

    [TsClass]
    public class EntityAttachment: EntityInfo
    {
        [Required]
        [StringLength(255)]
        [Updatable]
        public string FileName { get; set; }

        [StringLength(255)]
        [Updatable]
        public string Title { get; set; }

        [StringLength(512)]
        [Updatable]
        public string Desc { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }
        
        [JsonIgnore]
        public byte[] Content { get; set; }

        [Required]
        [StringLength(25)]
        [Updatable]
        public string ContentType { get; set;}

        [Required]
        [Updatable]
        public AttachmentType AttachmentType { get; set; }

        [Required]
        public long Length { get; set; }
    }
}
