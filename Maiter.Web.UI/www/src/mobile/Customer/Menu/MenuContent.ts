/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $stateParams} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Entity, ViewModels} from '../../../Data/Models';
import {MenuFoodGroup} from '../../../Data/Company';
import {Session } from '../../../Core/Session/SessionService';

@Meta.Controller('MenuContentController', {
    state: {
        name: 'app.customer.menucontent',
        url: "/menucontent/:menuId/:sectionId/:filter",
        templateUrl: 'src/mobile/Customer/Menu/MenuContent.html',
        data: {
            title: ''
        },
        MobileControllerAs: true
    }
})

export class MenuContentController extends ControllerBase {
    HeaderImages : Array<ViewModels.Mobile.EntityAttachmentViewModel>;
    Menu: ViewModels.Mobile.MenuViewModel;
    Section: ViewModels.Mobile.MenuSectionViewModel;
    ViewItems: Array<ViewModels.Mobile.MenuFoodViewModel>;
    FoodGroups: Array<MenuFoodGroup>;
    HeaderText: string;
    FilterText: string;

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

    BestHeader() {
        if (this.Section) {
            return this.Menu.Name + ' / ' + this.Section.Name;
        } else if (this.Menu)
            return this.Menu.Name;

        return Session.Customer.InitData.CompanyName;
    }

    initialize() {
        if (!this.HeaderImages) {            
            this.FoodGroups = new Array < MenuFoodGroup>();
            this.Menu = _.find(Session.Customer.InitData.Menu, 'Id', $stateParams['menuId']);

            if (this.Menu)
                this.Section = _.find(this.Menu.Sections, 'Id', $stateParams['sectionId']);

            if (this.Menu || this.Section)
                this.HeaderImages = (this.Section ? this.Section : this.Menu).Images;

            this.FilterText = $stateParams['filter'];
            if (this.FilterText) {

            } else if (this.Section) {
                this.FoodGroups.push({
                    Id: this.Section.Id,
                    Items: this.Section.Foods,
                    Title: this.Section.Name,
                    Type: 'section'
                });
            }
            this.HeaderText = this.BestHeader();
        }
        return super.initialize();
    }
}  