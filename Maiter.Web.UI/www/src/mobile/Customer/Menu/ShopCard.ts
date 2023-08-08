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
import {ShoppingCardItem, ShoppingCard, ShoppingCardView, CardGrouping, ShoppingCardViewItem} from '../../../Core/ShoppingCard';

@Meta.Controller('ShopCardController', {
    state: {
        name: 'app.customer.shoppingcard',
        url: "/shoppingcard",
        templateUrl: 'src/mobile/Customer/Menu/ShopCard.html',
        data: {
            title: ''
        },
        MobileControllerAs: true
    }
})
export class ShopCardController extends ControllerBase {
    ShoppingCard: ShoppingCard;
    Session = Session;
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




    initialize() {
        this.ShoppingCard = this.ShoppingCard || Session.Customer.ShoppingCard;
        return super.initialize();
    }
}   