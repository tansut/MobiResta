/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $stateParams} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Entity, ViewModels} from '../../../Data/Models';

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

    initialize() {
        return super.initialize();
    }
}   