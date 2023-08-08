/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {BaseController} from '../../lib/BaseController';
import {Registration} from '../../service/RegistrationService';
import { Account } from '../../service/data/AccountService';
import { AnonymousPrincipal, UserPrincipal } from '../../lib/Security';

export class HomeController extends BaseController {
    public static ControllerName = 'HomeController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.home', {
            url:'',
            templateUrl: () => {
                if (Account.principal instanceof AnonymousPrincipal)
                    return "src/app/Home/home.html";
                else return "src/app/Home/user-home.html";
            },
            controller: HomeController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: 'Ana Sayfa' }
        });
    }

    constructor($scope: angular.IScope) {
		super($scope);
    }

    static register = Registration.RegisterController(HomeController.ControllerName, HomeController);

}   