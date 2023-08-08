/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {Registration} from '../../service/RegistrationService';
import {BaseController} from '../../lib/BaseController';
import {Security} from '../../lib/Models';
import {SignOffController} from './SignOff';

import {Account} from '../../service/data/AccountService';
import {$state, $timeout} from '../../service/AngularService';


export class BaseAccountController extends BaseController {
    public static ControllerName = 'BaseAccountController';


    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.account', {
            url: '/account',
            abstract: true,
            templateUrl:'src/app/Account/Account.html'
        })
    }

    public service = Account;
    
    static register = Registration.RegisterController(BaseAccountController.ControllerName, BaseAccountController);

}