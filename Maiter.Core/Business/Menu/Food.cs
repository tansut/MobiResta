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
using System.Data.Entity.Infrastructure;


using System.Data.Entity;
using System.Reflection;
using Maiter.Shared.Security;
using System.Data.Entity.Validation;
using System.Security;
using Maiter.Shared.Attributes;
using Maiter.Core.Business.Common;
using System.Linq.Expressions;

namespace Maiter.Core.Business
{


    public class FoodBusiness : EntityBusiness<Food>
    {
        private IEntityBusiness<MenuSection> menuBusiness;
        private TagBusiness tagBusiness;
        private IEntityBusiness<FoodProperty> foodPropertyBusiness;
        private IEntityBusiness<FoodPropertyItem> foodPropertyItemBusiness;
        public FoodBusiness(IEntityBusiness<MenuSection> menuBusiness, TagBusiness tagBusiness, IEntityBusiness<FoodProperty> foodPropertyBusiness, IEntityBusiness<FoodPropertyItem> foodPropertyItemBusiness)
        {
            this.menuBusiness = menuBusiness;
            this.tagBusiness = tagBusiness;
            this.foodPropertyBusiness = foodPropertyBusiness;
            this.foodPropertyItemBusiness = foodPropertyItemBusiness;

            this.DefaultOrder.Clear();
            this.DefaultOrder.Add(new EntityOrderInfo<Food>() { Direction = OrderDirection.Asc, OrderBy = d => new { d.DisplayOrder } });
            this.DefaultOrder.Add(new EntityOrderInfo<Food>() { Direction = OrderDirection.Asc, OrderBy = d => new { d.Name } });
        }

        public IEntityBusiness<Food> UpdateWithProperties(string id, Food entity)
        {
            var food = this.GetFoodWithProperties(id);

            MergeUpdate(food, entity);

            ValidateFoodPropertyOwnings(entity.FoodProperties.ToList());

            foreach (var newProp in entity.FoodProperties)
            {
                ValidateFoodPropertyItemOwnings(newProp.FoodPropertyItems);
            }

            var newPropertyIds = entity.FoodProperties.Where(d=> !string.IsNullOrEmpty(d.Id)).Select(d => d.Id);
            var removedProperties = food.FoodProperties.Where(c => !newPropertyIds.Contains(c.Id));

            foreach (var item in removedProperties.ToList())
            {
                foodPropertyBusiness.Delete(item.Id);
            }

            foreach (var fProperty in entity.FoodProperties)
            {
                fProperty.FoodId = food.Id;
                if (!string.IsNullOrEmpty(fProperty.Id))
                {
                    var fDb = food.FoodProperties.FirstOrDefault(c => c.Id == fProperty.Id);
                    if (fDb == null)
                        throw new InvalidOperationException("Expected Entity Haven't found on the Database");

                    foodPropertyBusiness.MergeUpdate(fDb, fProperty);
                    UpdatePropertyItems(fDb, fProperty);
                }
                else
                {
                    if (fProperty.FoodPropertyItems.Any(c => !string.IsNullOrEmpty(c.Id)))
                        throw new SecurityException("Cannot Create Food Property with An Existing Food Property Item");
                    foodPropertyBusiness.Create(fProperty);
                    fProperty.FoodPropertyItems.ToList().ForEach(c => c.FoodPropertyId = fProperty.Id);
                }

            }
            this.ensureTags(entity);
            return this;
        }

        private void UpdatePropertyItems(FoodProperty fDb, FoodProperty fCli)
        {
            var newPropertyIds = fCli.FoodPropertyItems.Where(d => !string.IsNullOrEmpty(d.Id)).Select(d => d.Id);
            var removedProperties = fDb.FoodPropertyItems.Where(c => !newPropertyIds.Contains(c.Id));

            foreach (var item in removedProperties.ToList())
            {
                foodPropertyItemBusiness.Delete(item.Id);
            }

            foreach (var fPropertyItem in fCli.FoodPropertyItems)
            {
                fPropertyItem.FoodPropertyId = fDb.Id;
                if (!string.IsNullOrEmpty(fPropertyItem.Id))
                {
                    var fPropItemDb = fDb.FoodPropertyItems.FirstOrDefault(c => c.Id == fPropertyItem.Id);
                    if (fPropItemDb == null)
                        throw new InvalidOperationException("Expected Entity Haven't found on the Database");
                    foodPropertyItemBusiness.MergeUpdate(fPropItemDb, fPropertyItem);
                }
                else
                {
                    foodPropertyItemBusiness.Create(fPropertyItem);
                }

            }
        }

        public override void MergeUpdate(Food orig, Food client)
        {
            base.MergeUpdate(orig, client);
            orig.Tags = client.Tags;
        }

        private void ensureTags(Food entity)
        {
            if (entity.Tags != null && entity.Tags.Any())
            {
                foreach (var tag in entity.Tags)
                {
                    tag.EntityId = entity.Id;
                    tag.EntityName = Food.EntityName;
                }
            }
            tagBusiness.UpdateTags(entity);
        }

        public override IEntityBusinessBase<Food, string> Update(Food entity)
        {
            ensureTags(entity);
            return base.Update(entity);
        }


        public Food GetFoodWithProperties(string foodId)
        {
            return this.Id(foodId, "FoodProperties", "FoodProperties.FoodPropertyItems");
        }

        private void ValidateFoodPropertyOwnings(ICollection<FoodProperty> foodProperties)
        {
            var propIds = foodProperties.Where(d => !string.IsNullOrWhiteSpace(d.Id)).Select(d => d.Id);

            var dbFoodProps = foodPropertyBusiness.Get(c => propIds.Contains(c.Id)).ToList();

            foreach (var fProp in dbFoodProps)
            {
                if (fProp.Stamp.CreatedBy != ClaimsBusiness.CurrentUserId)
                    throw new SecurityException("Cannot save another Company's food property");
            }

            foreach (var fProperty in foodProperties)
            {
                ValidateFoodPropertyItemOwnings(fProperty.FoodPropertyItems.Where(d => !string.IsNullOrWhiteSpace(d.Id)));
            }
        }

        private void ValidateFoodPropertyItemOwnings(IEnumerable<FoodPropertyItem> foodPropertyItems)
        {
            var itemIds = foodPropertyItems.Select(d => d.Id);
            var dbFpropertyItems = foodPropertyItemBusiness.Get(c => itemIds.Contains(c.Id)).ToList();

            foreach (var fPropertyItem in dbFpropertyItems)
            {
                if (fPropertyItem.Stamp.CreatedBy != ClaimsBusiness.CurrentUserId)
                    throw new SecurityException("Cannot save another Company's food property");
            }
        }

        public override IEntityBusinessBase<Food, string> Create(Food entity)
        {
            var menu = menuBusiness.Id(entity.MenuSectionId);
            menuBusiness.CheckUpdateSecurity(menu);
            base.Create(entity);
            ensureTags(entity);
            return this;
        }
    }
}