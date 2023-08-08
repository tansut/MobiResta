/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Kalitte} from '../../Kalitte/Data/Models';
import {$state, $timeout, AngularService} from '../../Kalitte/Vendor/AngularService';
import {BaseAccountController} from './Account';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('SignOffController', {
    state: {
        name: 'app.account.signOff',
        url: '/account/logoff',
        templateUrl: "src/web/Account/SignOff.html",
        data: { title: 'Sistemden çıkış', authenticated: true }
    }})
export class SignOffController extends BaseAccountController {
    public static ControllerName = 'SignOffController';
    
    logOff() {
        return this.service.logOff().then(() => {
            $state.go('app.home');
        });
    }

    initialize() {
        this.logOff().then(() => super.initialize());
    }

    constructor($scope: angular.IScope) {
        super($scope);

    }
}

