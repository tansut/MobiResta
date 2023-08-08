using Maiter.Shared.Entity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile
{
    public class MenuViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public string Language { get; set; }
        public int DisplayOrder { get; set; }
        public List<EntityAttachmentViewModel> Images { get; set; }
        public List<EntityAttachmentViewModel> Videos { get; set; }
        public List<EntityTagViewModel> AllTags { get; set; }
        public List<MenuSectionViewModel> Sections { get; set; }

        [JsonIgnore]
        public List<MenuFoodViewModel> Foods { get; set; }

        public static MenuViewModel FromEntity(Menu entity)
        {
            var obj = new MenuViewModel()
            {
                Id = entity.Id,
                Name = entity.Name,
                Desc = entity.Desc,
                Language = entity.Language,
                DisplayOrder = entity.DisplayOrder
            };

            var attaches = EntityAttachmentViewModel.FromEntityList(entity.Attachments);

            obj.Images = attaches.Where(p => p.AttachmentType == AttachmentType.Image).ToList();
            obj.Videos = attaches.Where(p => p.AttachmentType == AttachmentType.VideoLink).ToList();

            foreach (var section in entity.Sections.OrderBy(p=>p.DisplayOrder))
            {
                obj.Sections.Add(MenuSectionViewModel.FromEntity(section));
            }


            return obj;
        }
        

        public MenuViewModel()
        {
            this.Images = new List<EntityAttachmentViewModel>();
            this.Videos = new List<EntityAttachmentViewModel>();
            this.AllTags = new List<EntityTagViewModel>();
            this.Sections = new List<MenuSectionViewModel>();
            this.Foods = new List<MenuFoodViewModel>();
        }

    }

    public class MenuSectionViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public int DisplayOrder { get; set; }
        public List<EntityAttachmentViewModel> Images { get; set; }
        public List<EntityAttachmentViewModel> Videos { get; set; }
        public List<EntityTagViewModel> AllTags { get; set; }
        public List<MenuFoodViewModel> Foods { get; set; }

        [JsonIgnore]
        public MenuViewModel Menu { get; set; }


        public static MenuSectionViewModel FromEntity(MenuSection entity)
        { 
            var obj = new MenuSectionViewModel()
            {
                Id = entity.Id,
                Name = entity.Name,
                Desc = entity.Desc,
                DisplayOrder = entity.DisplayOrder
            };

            var attaches = EntityAttachmentViewModel.FromEntityList(entity.Attachments);

            obj.Images = attaches.Where(p => p.AttachmentType == AttachmentType.Image).ToList();
            obj.Videos = attaches.Where(p => p.AttachmentType == AttachmentType.VideoLink).ToList();

            foreach (var food in entity.Foods.OrderBy(p=>p.DisplayOrder))
            {
                obj.Foods.Add(MenuFoodViewModel.FromEntity(food));
            };

            return obj;
        }

        public MenuSectionViewModel()
        {

            this.Images = new List<EntityAttachmentViewModel>();
            this.Videos = new List<EntityAttachmentViewModel>();
            this.AllTags = new List<EntityTagViewModel>();
            this.Foods = new List<MenuFoodViewModel>();
        }
    }

    public class MenuFoodItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public List<MenuFoodSubItem> SubItems { get; set; }
        public FoodPropertySelectionType SelectionType { get; set; }
        public bool Required { get; set; }
        public int ItemSelectionLimit { get; set; }
        public bool ShowTitleToUser { get; set; }
        public bool DisplayInMenu { get; set; }
        public FoodPriceType PriceType { get; set; }
        public string SingleSelectedItem { get; set; }

        public MenuFoodItem()
        {
            this.SubItems = new List<MenuFoodSubItem>();
        }

        public static MenuFoodItem FromEntity(FoodProperty item)
        {
            var faItem = new MenuFoodItem()
            {
                Desc = item.Desc,
                Id = item.Id,
                Name = item.Name,
                ItemSelectionLimit = item.ItemSelectionLimit,
                Required = item.Required,
                SelectionType = item.SelectionType,
                DisplayInMenu = item.DisplayInMenu,
                ShowTitleToUser = item.ShowTitleToUser,
                PriceType = item.PriceType              
            };

            var properties = item.FoodPropertyItems.OrderBy(p => p.DisplayOrder).ToList();
            
            foreach (var sitem in properties)
            {
                var subItem = MenuFoodSubItem.FromEntity(sitem);
                faItem.SubItems.Add(subItem);
                if (faItem.SelectionType == FoodPropertySelectionType.Single && string.IsNullOrEmpty(faItem.SingleSelectedItem) && subItem.IsSelected)
                    faItem.SingleSelectedItem = subItem.Id;
            }

            if (faItem.SelectionType == FoodPropertySelectionType.Single && string.IsNullOrEmpty(faItem.SingleSelectedItem) && faItem.SubItems.Count > 0)
                faItem.SingleSelectedItem = faItem.SubItems[0].Id;

            return faItem;
        }
    }

    public class MenuFoodSubItem
    {
        public string Id { get; set; }
        public decimal Price { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }        
        public bool IsSelected { get; set; }


        public static MenuFoodSubItem FromEntity(FoodPropertyItem item)
        {
            var siItem = new MenuFoodSubItem()
            {
                Desc = item.Desc,
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                IsSelected = item.AutoSelect
               
            };
            return siItem;
        }
    }

    public class MenuFoodViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public string RichDesc { get; set; }
        public List<EntityAttachmentViewModel> Images { get; set; }
        public List<EntityAttachmentViewModel> Videos { get; set; }
        public List<EntityTagViewModel> Tags { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public List<MenuFoodItem> Modifiers { get; set; }
        public List<MenuFoodItem> Items { get; set; }

        [JsonIgnore]
        public MenuSectionViewModel Section { get; set; }

        public static MenuFoodViewModel FromEntity(Food entity)
        {
            var obj = new MenuFoodViewModel()
            {
                Id = entity.Id,
                Name = entity.Name,
                Desc = entity.Desc,
                RichDesc = entity.RichDesc
            };

            var attaches = EntityAttachmentViewModel.FromEntityList(entity.Attachments);

            obj.Images = attaches.Where(p => p.AttachmentType == AttachmentType.Image).ToList();
            obj.Videos = attaches.Where(p => p.AttachmentType == AttachmentType.VideoLink).ToList();
            obj.Tags = EntityTagViewModel.FromEntityList(entity.Tags);
            obj.Price = entity.Price;
            obj.Currency = entity.Currency;

            var foodItems = entity.FoodProperties.OrderBy(p=>p.DisplayOrder).ToList();
            //var modifiers = entity.FoodProperties.Where(p => p.PriceType == FoodPriceType.Modifier).ToList();

            foreach (var item in foodItems)
            {
                obj.Items.Add(MenuFoodItem.FromEntity(item));
            }

            //foreach (var item in modifiers)
            //{
            //    obj.Modifiers.Add(MenuFoodItem.FromEntity(item));
            //}

            return obj;
        }



        public MenuFoodViewModel()
        {
            this.Images = new List<EntityAttachmentViewModel>();
            this.Videos = new List<EntityAttachmentViewModel>();
            this.Tags = new List<EntityTagViewModel>();
            this.Items = new List<MenuFoodItem>();
            this.Modifiers = new List<MenuFoodItem>();
            //this.OrderItem = new Dictionary<string, FoodSubItemSelection>();
        }
    }

    



}
