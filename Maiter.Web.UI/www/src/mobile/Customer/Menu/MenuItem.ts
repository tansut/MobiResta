/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $stateParams} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Entity, ViewModels} from '../../../Data/Models';
import {Session } from '../../../Core/Session/SessionService';
import {GetYoutubeThumbnail} from '../../../Core/Helpers';
import {ShoppingCardItem, ShoppingCard} from '../../../Core/ShoppingCard';


@Meta.Controller('MenuItemController', {
    state: {
        name: 'app.customer.menuitem',
        url: "/menuitem/:Id/:editId",
        templateUrl: 'src/mobile/Customer/Menu/MenuItem.html',
        data: {
            title: ''
        },
        MobileControllerAs: true
    }
})

export class MenuItemController extends ControllerBase {
    HeaderImages: Array<ViewModels.Mobile.EntityAttachmentViewModel>;
    Item: ViewModels.Mobile.MenuFoodViewModel;
    videoThumbnail = GetYoutubeThumbnail;
    SelectionTypes = Entity.FoodPropertySelectionType;
    PriceTypes = Entity.FoodPriceType;
    CurrentCard: ShoppingCardItem;
    Cards: Array<ShoppingCardItem> = new Array<ShoppingCardItem>();
    ShoppingCard: ShoppingCard;
    editId: string;

    beforeEnter() {
        if (!Session.Customer) {
            $state.go('app.customer.initSession', {
                returnState: $state.current.name,
                returnStateParams: angular.copy($stateParams)
            });
            throw new Error('Session required');
        }
        super.beforeEnter();
    }

    updateSingle(group: ViewModels.Mobile.MenuFoodItem, item: ViewModels.Mobile.MenuFoodSubItem) {
        this.CurrentCard.UpdateSingle(group, item);
    }

    updateMultiple(group: ViewModels.Mobile.MenuFoodItem, item: ViewModels.Mobile.MenuFoodSubItem) {
        this.CurrentCard.UpdateMultiple(group, item);
    }

    AddToShopCard() {
        if (this.CurrentCard.Amount <= 0)
            this.CurrentCard.Amount = 1;
        this.CurrentCard.Calculated();
        if (!this.editId)
            this.ShoppingCard.AddNewItem(this.CurrentCard);
        $timeout(()=>$state.go('app.customer.shoppingcard'));
    }

    removeItem() {
        this.ShoppingCard.RemoveItem(this.CurrentCard);
        $timeout(() => $state.go('app.customer.shoppingcard'));
    }

    TotalPrice(): number {
        return this.CurrentCard && this.CurrentCard.Calculated();
    }


    initialize() {
        this.ShoppingCard = Session.Customer.ShoppingCard;
        this.Item = angular.copy(Session.Customer.AvailableFoods[$stateParams['Id']]);
        this.HeaderImages = this.HeaderImages || this.Item.Images;

        this.editId = $stateParams['editId'];
        if (this.editId) {
            this.CurrentCard = this.ShoppingCard.GetById(this.editId);
            this.CurrentCard.SyncFood(this.Item);
        }
        else this.CurrentCard = this.ShoppingCard.NewItem(this.Item);
        
        return super.initialize();
    }
}  