/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {Meta} from '../../Kalitte/Core/Meta';
import {Account, ExternalAuthData} from '../../Kalitte/Data/AccountService';
import {$stateParams, $q, $log, $state, $localStorage} from '../../Kalitte/Vendor/AngularService';
import {$ionicHistory} from '../../Kalitte/Vendor/IonicService';
import {Kalitte} from '../../Kalitte/Data/Models';
import {$cordovaFacebook} from '../../Kalitte/Vendor/CordovaService';
import {MobileAppConfig} from '../../Kalitte/Core/MobileApplication';
import { Translate, TranslateService } from '../../Kalitte/Vendor/TranslateService';



@Meta.Controller('SettingsController', {
    state: {
        name: 'app.settings',
        params: { notify: null },
        url: '/Settings',
        MobileControllerAs: true,
        templateUrl: 'src/mobile/Account/Settings.html',
        data: { title: 'Settings' }
    }
})
export class SettingsController extends ControllerBase {
    static $inject = ['$scope'];



    Translate = Translate;
    Languages = TranslateService.Configuration.Languages;

    changeLanguage(lang) {
        Translate.SetLanguage(lang);
        $ionicHistory.clearCache();
    }

    constructor(scope) {
        super(scope);
    }
}   