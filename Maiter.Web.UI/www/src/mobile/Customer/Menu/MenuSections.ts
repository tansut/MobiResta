/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $stateParams} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Entity, ViewModels} from '../../../Data/Models';
import {Session } from '../../../Core/Session/SessionService';

@Meta.Controller('MenuSectionController', {
    state: {
        name: 'app.customer.menusections',
        url: "/menusections/:menuId",
        templateUrl: 'src/mobile/Customer/Menu/MenuSections.html',
        data: {
            title: ''
        },
        MobileControllerAs: true
    }
})

export class MenuSectionController extends ControllerBase {
    HeaderImages : Array<ViewModels.Mobile.EntityAttachmentViewModel>;
    Menu: ViewModels.Mobile.MenuViewModel;

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
            this.Menu = _.find(Session.Customer.InitData.Menu, 'Id', $stateParams['menuId']);
            this.HeaderImages = this.Menu.Images;
        }
        return super.initialize();
    }
}  