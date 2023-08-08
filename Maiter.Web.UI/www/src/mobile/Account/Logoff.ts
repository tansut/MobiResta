/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {Meta} from '../../Kalitte/Core/Meta';
import {Account, ExternalAuthData} from '../../Kalitte/Data/AccountService';
import {$stateParams, $q, $log, $state, $localStorage} from '../../Kalitte/Vendor/AngularService';
import {Kalitte} from '../../Kalitte/Data/Models';
import {$cordovaFacebook} from '../../Kalitte/Vendor/CordovaService';
import {MobileAppConfig} from '../../Kalitte/Core/MobileApplication';



@Meta.Controller('LogoffController',
    {
        state:
        {
            params: { notify: null },
            name: 'app.logoff',
            url: '/logoff',
            MobileControllerAs: true,
            templateUrl: 'src/mobile/Account/Logoff.html',
            data: { title: 'Çıkış' }
        }
    })

export class LogoffController extends ControllerBase {
    LogOff() {
        Account.logOff();
        $state.go("app.customer.home");
    }
}   