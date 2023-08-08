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
    [TsEnum]
    public enum AppMenuDisplayOption
    {
        DisplayAsWelcome,
        DisplayAsHome,
        Both
    }

    [TsClass]
    public class CompanyAppMenuItem: EntityBase, IAttachable
    {
        [Required]
        [StringLength(22)]
        [Updatable]
        public string CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        public Company Company { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }

        [StringLength(64)]
        [Updatable]
        public string Title { get; set; }

        [StringLength(255)]
        [Updatable]
        public string Desc { get; set; }

        [Updatable]
        public string Content { get; set; }

        [StringLength(15)]
        [Updatable]
        public string Language { get; set; }

        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        [Updatable]
        public MenuDisplayOption DisplayOption { get; set; }


        [Updatable]
        public AppMenuDisplayOption DisplayType { get; set; }

        public CompanyAppMenuItem() {
            this.Attachments = new List<EntityAttachment>();
        }

        public const string EntityName = "CompanyAppMenu";


    }
}
