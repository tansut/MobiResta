/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {Meta} from '../../Kalitte/Core/Meta';
import {Account} from '../../Kalitte/Data/AccountService';

@Meta.Controller('BaseAccountController', {
    state: {
        name: 'app.account',
        url: '/account',
        abstract: true,
        templateUrl: 'src/web/Account/Account.html',
        data: { authenticated: false }
    }
})

export class BaseAccountController extends ControllerBase {
    public service = Account;

}