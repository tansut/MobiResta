/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/lodash/lodash.d.ts" />
/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {$q, $filter, $state, $stateParams} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {ControllerBase} from '../Kalitte/UI/ControllerBase';
import {Entity} from '../Data/Models';
import {Dialog} from '../Kalitte/UI/Web/DialogService';
import { Remote} from '../Kalitte/Data/RemoteService';
import { ViewModels} from '../Data/Models';
import { Session } from '../Core/Session/SessionService';
import {ShoppingCardItem, ShoppingCard, ShoppingCardView, CardGrouping, ShoppingCardViewItem} from '../Core/ShoppingCard';

class ShopcardViewController extends ControllerBase {
    ShoppingCard: ShoppingCard;
    ShoppingCardView: ShoppingCardView;
    Currency: string;


    orderClick(group: ShoppingCardViewItem, item: ShoppingCardItem) {
        $state.go('app.customer.menuitem', {
            Id: item.FoodId,
            editId: item.ClientId
        });
    }

    orderRemove($event: ng.IAngularEvent, group: ShoppingCardViewItem, item: ShoppingCardItem) {
        $event.stopPropagation();
        this.ShoppingCard.RemoveItem(item);
        this.ShoppingCardView.RemoveItem(item);
    }

    initialize() {        
        return super.initialize();
    }


    constructor(scope: ng.IScope) {
        super(scope);
        var self = this;
        scope.$watch( () => {
            return self.ShoppingCard;
        }, function (newVal) {
            if (newVal) {
                console.log('item count is ' + self.ShoppingCard.Items.length);
                self.ShoppingCard.Calculated();
                self.Currency = self.ShoppingCard.Items.length ? self.ShoppingCard.Items[0].FoodRef.Currency : '';
                self.ShoppingCardView = new ShoppingCardView(self.ShoppingCard.Items, CardGrouping.Menu);
            }
            else self.ShoppingCardView = null;
        });
    }
}

@Meta.Directive('shopcardView')
export class ShopcardView {
    controllerAs = 'ctrl';
    controller = ShopcardViewController;
    scope = {};
    bindToController = {
        ShoppingCard: '=card'
    }

    static $Factory(): ShopcardView {
        return new ShopcardView();
    }

    link(scope: any, element: any, attrs: angular.IAttributes, controller) {

    }

    public templateUrl = 'src/UI/ShopcardView.html';

    constructor() {
    }
}