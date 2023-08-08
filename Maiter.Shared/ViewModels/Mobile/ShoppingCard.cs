using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile
{
    [TsClass]
    public class ShoppingCardItem
    {
        public string FoodId { get; set; }
        public string Desc { get; set; }
        public int Amount { get; set; }
        public decimal TotalPrice { get; set; }

        [JsonIgnore]
        public MenuFoodViewModel FoodRef { get; set; }

        public Dictionary<string, FoodSubItemSelection> OrderItems { get; set; }

        public ShoppingCardItem()
        {
            this.OrderItems = new Dictionary<string, FoodSubItemSelection>();
            this.Amount = 1;
        }
    }

    [TsClass]
    public class FoodSubItemSelection
    {
        public string ItemId { get; set; }
        public string Id { get; set; }
        public string Desc { get; set; }
        public decimal Price { get; set; }

        [JsonIgnore]
        public MenuFoodItem ItemRef { get; set; }

        [JsonIgnore]
        public MenuFoodSubItem SubItemRef { get; set; }

    }
}
