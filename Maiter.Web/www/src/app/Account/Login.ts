/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {Registration} from '../../service/RegistrationService';
import {Security} from '../../lib/Models'
import {$state, $timeout} from '../../service/AngularService';
import {BaseAccountController} from './Account';

export class LoginController extends BaseAccountController {
    public static ControllerName = 'LoginController';

    model: Security.Credential;
    

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('app.account.login', {
            url: '/login',
            templateUrl: "src/app/Account/Login.html",
            controller: LoginController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: 'Sistem giri?i' }
        })

            .state('app.account.resetpassword', {
            url: '/reset-password',
            templateUrl: "src/app/Account/reset-password.html",
            controller: LoginController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: '?ifremi unuttum' }
        })
    }

    loginAsCustomer() {
        this.service.login(this.model).then((identity) => {
            $state.go('app.home');
        })
    }


	
    //   loginAsService() {
    //       this.service.companyLogin(this.model).then((identity) => {
            
    //		$state.go('home');
    //	})
    //}
	


    constructor($scope: angular.IScope) {
        super($scope);
        this.model = {
            ID: 'tansu@gmail',
            Password: '1',
            CompanyID: '112'
        };
    }

    static register = Registration.RegisterController(LoginController.ControllerName, LoginController);

}

