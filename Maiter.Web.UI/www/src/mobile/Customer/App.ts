/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope, $state} from '../../Kalitte/Vendor/AngularService';
import {Account} from '../../Kalitte/Data/AccountService';
import {AnonymousPrincipal, Principal} from '../../Kalitte/Core/Principal';
import {Meta} from '../../Kalitte/Core/Meta';
import {App, Application} from '../../Kalitte/Core/Application';
import {ViewModels, Entity} from '../../Data/Models';
import { CustomerSession } from '../../Core/Session/CustomerSession';
import {$ionicHistory} from '../../Kalitte/Vendor/IonicService';
import {Session } from '../../Core/Session/SessionService';



export var AppControllerInstance: AppController;

@Meta.Controller('CustomerAppController')
export class AppController extends ControllerBase {
    public static ControllerName = 'CustomerAppController';

    Account = Account;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $stateProvider.state('app.customer', {
            url: "/customer",
            abstract: true,
            templateUrl: 'src/mobile/Customer/App.html',
            controller: AppController.ControllerName + ' as app'
        })
    }

    customerStatusChanged(session: CustomerSession) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        if (Session.Customer) {
            //$state.go('app.customer.home', {}, { reload: true });
        } else $state.go('app.customer.home', {}, { reload: true });
    }


    constructor($scope: angular.IScope) {
        super($scope);
        AppControllerInstance = this;
        this.on('CustomerSessionCreated', 'CustomerSessionDisconnected', (event, args) => {
            this.customerStatusChanged(args);
        });
    }
}   