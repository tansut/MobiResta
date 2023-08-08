/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import { BaseService } from './BaseService';
import { App } from './Application';
import { $rootScope, $state } from '../Vendor/AngularService';
import { Meta, } from './Meta';
import { Account } from '../Data/AccountService';
import { StateInfo, UIState } from './UIState';

@Meta.Service('StateSecurity')
export class StateSecurity extends BaseService {

    stateChanging(event: ng.IAngularEvent, toState: ng.ui.IState, toParams, fromState: ng.ui.IState, fromParams) {
        App.Ready.then(() => {
            var targetState = <UIState>toState;
            var acc = Account;
            if (targetState.data && targetState.data.authenticated &&
                !acc.principal.isAuthenticated) {
                console.log('Unauthorized state ' + targetState.name);
                event.preventDefault();
            }

            var roles = (targetState.data && targetState.data.roles) || [];

            for (var i = 0; i < roles.length; i++)
                if (!Account.principal.IsInRole(roles[i])) {
                    console.log('Unauthorized state ' + targetState.name + ' for ' + roles[i]);
                    event.preventDefault();
                }

            if (event.defaultPrevented)
                $state.go('app.unauthorized');
        });
    }

    constructor() {
        super();
        $rootScope.$on('$stateChangeStart', this.stateChanging.bind(this));
    }
}