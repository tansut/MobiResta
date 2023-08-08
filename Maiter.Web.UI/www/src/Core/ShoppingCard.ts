/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/lodash/lodash.d.ts" />

import {ViewModels, Entity} from '../Data/Models';

export class ShoppingCardItem implements ViewModels.Mobile.ShoppingCardItem {
    ClientId: string;
    FoodId: string;
    Desc: string;
    Amount: number;
    Extras: number;
    BasePrice: number;
    TotalPrice: number;
    FoodRef: ViewModels.Mobile.MenuFoodViewModel;

    OrderItems: { [key: string]: ViewModels.Mobile.FoodSubItemSelection } = {};

    SyncFood(food: ViewModels.Mobile.MenuFoodViewModel) {
        food.Items.forEach((food) => {
            food.SingleSelectedItem = undefined;
            food.SubItems.forEach((si) => si.IsSelected = false);
        });
        for (var subId in this.OrderItems) {
            var orderInfo = this.OrderItems[subId];
            var group = _.find(food.Items, 'Id', orderInfo.ItemId);
            if (group.SelectionType == Entity.FoodPropertySelectionType.Single) {
                group.SingleSelectedItem = orderInfo.Id;
                group.SubItems.forEach((sitem) => sitem.IsSelected = sitem.Id == orderInfo.Id);
            } else {
                var sitem = _.find(group.SubItems, 'Id', orderInfo.Id);
                sitem.IsSelected = true;
            }
        }
    }

    Calculated(): number {
        var food = this.$Card.AvailableFoods[this.FoodId];
        var basePrice = food.Price;
        var extras = 0;

        for (var subId in this.OrderItems) {
            var orderInfo = this.OrderItems[subId];
            var group = _.find(food.Items, 'Id', orderInfo.ItemId);
            if (group.PriceType == Entity.FoodPriceType.Net)
                basePrice = orderInfo.Price
            else
                extras = extras + orderInfo.Price;
        }
        this.Extras = extras;
        this.BasePrice = basePrice;
        this.TotalPrice = this.Amount * (basePrice + extras);

        return this.TotalPrice;
    }

    UpdateSingle(group: ViewModels.Mobile.MenuFoodItem, item: ViewModels.Mobile.MenuFoodSubItem) {
        var deletedList = new Array<string>();
        for (var subId in this.OrderItems) {
            var orderInfo = this.OrderItems[subId];
            if (orderInfo.ItemId == group.Id)
                deletedList.push(subId);
        }

        deletedList.forEach((item) => delete this.OrderItems[item]);

        this.OrderItems[group.SingleSelectedItem] = {
            Id: item.Id,
            Desc: '',
            ItemId: group.Id,
            Price: item.Price,
            ItemRef: group,
            SubItemRef: item
        }
    }

    UpdateMultiple(group: ViewModels.Mobile.MenuFoodItem, item: ViewModels.Mobile.MenuFoodSubItem) {
        delete this.OrderItems[item.Id];
        if (item.IsSelected) {
            this.OrderItems[item.Id] = {
                Id: item.Id,
                Desc: '',
                ItemId: group.Id,
                Price: item.Price,
                ItemRef: group,
                SubItemRef: item
            }
        }
    }

    constructor(public $Card: ShoppingCard, defaults?: ViewModels.Mobile.ShoppingCardItem) {
        if (defaults)
            angular.extend(this, defaults);
        if (!this.ClientId)
            this.ClientId = '_' + Math.random().toString(36).substr(2, 9);
        this.FoodRef = this.$Card.AvailableFoods[this.FoodId];
    }

    
}

export class ShoppingCard {
    Items: Array<ShoppingCardItem> = new Array<ShoppingCardItem>();
    TotalPrice: number;

    public Calculated() {
        var result = 0;

        this.Items.forEach((item) => result += item.Calculated());

        this.TotalPrice = result;
    }

    public AddNewItem(item: ShoppingCardItem) {
        this.Items.push(item);
    }

    public RemoveItem(item: ShoppingCardItem) {
        var index = this.Items.indexOf(item);
        if (index >= 0)
            this.Items.splice(index, 1);
    }

    GetById(clientId: string) {
        var result = _.find(this.Items, 'ClientId', clientId);
        if (!result)
            throw new Error('Cannot find card item with clientId ' + clientId);
        return result;
    }

    public NewItem(food: ViewModels.Mobile.MenuFoodViewModel): ShoppingCardItem {

        var item = <ViewModels.Mobile.ShoppingCardItem> {
            Amount: 1,
            FoodId: food.Id,
            TotalPrice: food.Price,
            OrderItems: {}
        };

        food.Items.forEach((prop) => {
            prop.SubItems.forEach((pi) => {
                if (pi.IsSelected || pi.Id == prop.SingleSelectedItem)
                    item.OrderItems[prop.Id] = {
                        Id: pi.Id,
                        Desc: '',
                        ItemId: prop.Id,
                        Price: pi.Price,
                        ItemRef: prop,
                        SubItemRef: pi
                    }
            });
        });

        return new ShoppingCardItem(this, item);
    }

    public FoodGroups(foodId: string) {
        return _.groupBy<string, ShoppingCardItem>(this.Items, 'FoodId');
    }

    public FilterByFood(foodId: string) {
        return this.Items.filter((item) => item.FoodId == foodId);
    }

    constructor(public SourceMenu: ViewModels.Mobile.MenuViewModel[], public AvailableFoods: { [id: string]: ViewModels.Mobile.MenuFoodViewModel }) {

    }
}

export class ShoppingCardViewItem {
    //GroupKey: string;
    GroupTitle: string;
    GroupTotal: number;
    GroupOrder: number;
    GroupItems = new Array<ShoppingCardItem>();
}

export enum CardGrouping {
    Menu,
    MenuSection,
    Tag,
    None
}

interface GroupInfo {
    Name: string;
    Order: number
}

export class ShoppingCardView {
    Items = new Array<ShoppingCardViewItem>();

    public RemoveItem(item: ShoppingCardItem) {
        var removeList = new Array<ShoppingCardViewItem>();

        this.Items.forEach((group) => {
            var index = group.GroupItems.indexOf(item);
            if (index >= 0) {
                group.GroupItems.splice(index, 1);
                if (!group.GroupItems.length)
                    removeList.push(group);
            }
        });
        removeList.forEach((group) => {
            var index = this.Items.indexOf(group);
            this.Items.splice(index, 1);
        });
        this.Recalculate();
    }

    public Recalculate() {
        this.Items.forEach((group) => {
            group.GroupTotal = 0;
            group.GroupItems.forEach((item) => {
                group.GroupTotal += item.Calculated();
            });
        });
    }

    getGroupInfo(item: ShoppingCardItem): GroupInfo {
        if (this.Group == CardGrouping.Menu)
            return {
                Name: item.FoodRef.Section.Menu.Name,
                Order: item.FoodRef.Section.Menu.DisplayOrder
            }
        else if (this.Group == CardGrouping.MenuSection)
            return {
                Name: item.FoodRef.Section.Menu.Name + '/' + item.FoodRef.Section.Name,
                Order: item.FoodRef.Section.Menu.DisplayOrder * 100 + item.FoodRef.Section.DisplayOrder
            };
        else return {
            Name: '',
            Order: 0
        }
    }

    constructor(public Source: ShoppingCardItem[], public Group: CardGrouping = CardGrouping.Menu) {
        Source.forEach((item) => {
            var group = this.getGroupInfo(item);
            var existing = _.find(this.Items, 'GroupTitle', group.Name);
            if (!existing) {
                this.Items.push({
                    GroupTotal: item.Calculated(),
                    GroupTitle: group.Name,
                    GroupOrder: group.Order,
                    GroupItems: [item]
                });
            } else {
                existing.GroupTotal = existing.GroupTotal + item.Calculated();
                existing.GroupItems.push(item);
            }   
        });
        this.Items = _.sortBy(this.Items, 'GroupOrder');
    }
}