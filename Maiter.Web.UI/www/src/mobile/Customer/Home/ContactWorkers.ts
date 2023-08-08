/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {Meta} from '../../../Kalitte/Core/Meta';
import {ViewModels, Entity} from '../../../Data/Models';

import {$timeout, $location, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {SignalRConnection} from '../../../Kalitte/Vendor/SignalRConnectionService';
import {Translate} from '../../../Kalitte/Vendor/TranslateService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {RemoteService} from '../../../Kalitte/Data/RemoteService';
import {AnonymousPrincipal} from '../../../Kalitte/Core/Principal';

import {CustomerSession } from '../../../Core/Session/CustomerSession';
import {Session } from '../../../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';

@Meta.Controller('ContactWorkersHomeController')
export class HomeController extends ControllerBase {
    Session = Session;
    Principal = Account.principal;
    ServiceKinds = ViewModels.Company.ServiceKind;

    requestGroups: {
        [id: string]: Array<ViewModels.Mobile.CustomerRequestType>
    }

    public static ControllerName = 'ContactWorkersHomeController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.customer.contactworkers', {
            url: '/contactworkers',
            templateUrl: "src/mobile/Customer/Home/ContactWorkers.html",
            controller: HomeController.ControllerName + ' as ctrl',
            controllerAs: 'ctrl',
            data: { title: 'MobiResta' }
        });
    }

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
        this.requestGroups = Session.Customer ? this.requestGroups : null;
        if (!this.requestGroups && Session.Customer)
            this.setupCustomerSession();
        return super.initialize();
    }

    setupCustomerSession() {
        this.requestGroups = Session.Customer ? _.groupBy<ViewModels.Mobile.CustomerRequestType>(Session.Customer.InitData.AvailableRequests.filter((item) => item.DisplayOrder > 0), (item) => item.Group.Value) : {};
        var menus = Session.Customer ? Session.Customer.InitData.Menu : [];
    }

    constructor(scope: ng.IScope) {
        super(scope);


    }
}   