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
    public class Food : EntityBase, IAttachable, ITaggable
    {
        [StringLength(255)]
        [Updatable]
        public string InternalCode { get; set; }

        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [Updatable]
        [StringLength(256)]
        public string Desc { get; set; }

        [Updatable]
        [StringLength(2048)]
        public string RichDesc { get; set; }

        [ForeignKey("MenuSectionId")]
        [TsIgnore]
        public virtual MenuSection MenuSection { get; set; }

        [Required]
        [Updatable]
        public string MenuSectionId { get; set; }

        [Required]
        [StringLength(5)]
        [Updatable]
        public string Currency { get; set; }

        [Required]
        [Updatable]
        public decimal Price { get; set; }

        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        [NotMapped]
        [Updatable]
        public List<EntityTag> Tags { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }


        [Updatable]
        public ICollection<FoodProperty> FoodProperties { get; set; }

        public Food()
        {
            this.Tags = new List<EntityTag>();
            this.Attachments = new List<EntityAttachment>();
            //this.SubItems = new List<FoodSubItem>();
        }

        public const string EntityName = "Food";

    }



    [TsEnum]
    public enum FoodSubItemType
    {
        SubItem = 1,
        Modifier = 2
    }

    [TsEnum]
    public enum FoodPriceType
    {
        Net = 1,
        Modifier = 2
    }

    [TsEnum]
    public enum FoodPropertySelectionType
    {
        Single = 1,
        Multiple = 2,
        MultipleLimited = 4
    }

    [TsClass]
    public class FoodProperty : EntityBase
    {
        [StringLength(22)]
        [Required]
        public string FoodId { get; set; }

        [ForeignKey("FoodId")]
        public Food Food { get; set; }

        [Updatable]
        public FoodPriceType PriceType { get; set; }

        [Updatable]
        public FoodPropertySelectionType SelectionType { get; set; }

        [Updatable]
        public bool Required { get; set; }

        [Updatable]
        public int ItemSelectionLimit { get; set; }

        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [Updatable]
        [StringLength(256)]
        public string Desc { get; set; }

        [Updatable]
        public ICollection<FoodPropertyItem> FoodPropertyItems { get; set; }

        [Updatable]
        public bool ShowTitleToUser { get; set; }

        [Updatable]
        public bool DisplayInMenu { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }
    }

    public class FoodPropertyItem: EntityBase
    {
        [StringLength(22)]
        [Required]
        public string FoodPropertyId { get; set; }

        [ForeignKey("FoodPropertyId")]
        public FoodProperty Property { get; set; }

        [Required]
        [Updatable]
        public decimal Price { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }

        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [Updatable]
        [StringLength(256)]
        public string Desc { get; set; }

        [Updatable]
        public bool AutoSelect { get; set; }
    }
}
