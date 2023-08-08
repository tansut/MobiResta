/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Registration} from '../../service/RegistrationService';
import {Security} from '../../lib/Models'
import {$state, $timeout} from '../../service/AngularService';
import {BaseAccountController} from './Account';


export class SignOffController extends BaseAccountController {
    public static ControllerName = 'SignOffController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        
        $stateProvider.state('app.account.signOff', {
            url: '/account/logoff',
            templateUrl: "src/app/Account/SignOff.html",
            controller: SignOffController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: 'Sistemden çıkış' }
        })
    }
    
    logOff() {
        this.service.logOff().then(() => {
            $state.go('app.home');
        });
    }

    constructor($scope: angular.IScope) {
        super($scope);
        if (this.service.principal.isAuthenticated)
            $timeout(this.logOff.bind(this), 1500);
    }

    static register = Registration.RegisterController(SignOffController.ControllerName, SignOffController);
}

