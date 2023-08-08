using Maiter.Shared.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Entity
{
    [TsClass]
    public class ResTable: EntityBase, IAttachable, ITaggable
    {

        [Required]
        [StringLength(22)]
        [Updatable]
        public string SectionId { get; set; }

        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [StringLength(255)]
        [Updatable]
        public string TableGroup { get; set; }

        [StringLength(255)]
        [Updatable]
        public string Desc { get; set; }

        [Required]
        [Updatable]
        public int Number { get; set; }



        //[ForeignKey("CompanyId")]
        //[TsIgnore]
        //public Company Company { get; set; }

        [ForeignKey("SectionId")]
        [TsIgnore]
        public CompanySection Section { get; set; }

        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        [NotMapped]
        public List<EntityTag> Tags { get; set; }

        [NotMapped]
        public bool Simulated { get; set; }

        [Required]
        [StringLength(256)]
        public string BarcodeID { get; set; }

        public string BarcodeContent { get; set; }

        [Required]
        [StringLength(16)]
        public string BarcodeVersion { get; set; }


        public ResTable()
        {
            this.Attachments = new List<EntityAttachment>();
            this.Tags = new List<EntityTag>();
        }

        public const string EntityName = "ResTable";


    }
}
