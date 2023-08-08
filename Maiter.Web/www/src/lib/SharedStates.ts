/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />
import { Account } from '../service/data/AccountService';
import { AnonymousPrincipal, UserPrincipal } from '../lib/Security';

export class SharedStates {
    static Configure($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise('/app');
    }
}

