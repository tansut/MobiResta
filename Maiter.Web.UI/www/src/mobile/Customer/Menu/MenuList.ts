﻿/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $stateParams} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Entity, ViewModels} from '../../../Data/Models';
import {Session } from '../../../Core/Session/SessionService';

@Meta.Controller('MenuListController', {
    state: {
        name: 'app.customer.menulist',
        url: "/menulist",
        templateUrl: 'src/mobile/Customer/Menu/MenuList.html',
        data: {
            title: ''
        },
        MobileControllerAs: true
    }
})
export class MenuListController extends ControllerBase {

    Session = Session;
    HeaderImages: Array<ViewModels.Mobile.EntityAttachmentViewModel>;

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
        if (!this.HeaderImages) {
            this.HeaderImages = [];
            Session.Customer.InitData.Menu.forEach((menu) => {
                menu.Images.forEach((item) => this.HeaderImages.push(item));
            });
            
        }
        return super.initialize();
    }
}   