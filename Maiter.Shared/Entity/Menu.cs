using Maiter.Shared.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TypeLite;

namespace Maiter.Shared.Entity
{
    public enum MenuDisplayOption
    {
        None,
        DisplayAlways,
        DisplayByLanguage
    }

    [TsClass]
    public class Menu: EntityBase, IAttachable
    {
        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [Updatable]
        public string Desc { get; set; }


        public virtual ICollection<MenuSection> Sections { get; set; }

        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        [NotMapped]
        public List<string> CompanyIds { get; set; }

        [StringLength(15)]
        [Updatable]
        public string Language { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }

        [Updatable]
        public MenuDisplayOption DisplayOption { get; set; }

        public Menu()
        {
            this.Sections = new List<MenuSection>();
            this.Attachments = new List<EntityAttachment>();
            this.CompanyIds = new List<string>();
        }


        public const string EntityName = "Menu";

    }

    [TsClass]
    public class MenuSection: EntityBase, IAttachable
    {
        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [StringLength(255)]
        [Updatable]
        public string Desc { get; set; }

        [ForeignKey("MenuId")]
        [TsIgnore]
        public virtual Menu Menu { get; set; }

        [Required]
        public string MenuId { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }

        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        public virtual ICollection<Food> Foods { get; set; }

        public MenuSection()
        {
            this.Foods = new List<Food>();
        }


        public const string EntityName = "MenuSection";
    }


}
