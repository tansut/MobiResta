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


@Meta.Controller('ProfileController', {
    state: {
        name: 'app.profile',
        params: { notify: null },
        url: '/profile',
        MobileControllerAs: true,
        templateUrl: 'src/mobile/Account/Profile.html',
        data: { title: 'My Profile' }
    }
})
export class ProfileController extends ControllerBase {
    static $inject = ['$scope'];
    public service = Account;
    profileModel: any;
    public lan: string;

    Translate = Translate;
    Languages = TranslateService.Configuration.Languages;

    changeLanguage() {
        Translate.SetLanguage(this.lan);
        $ionicHistory.clearCache();
    }

    update() {
        this.service.updateAccount(this.profileModel).then(() => {
            $state.go('app.profile');
        });
    }



    constructor(scope) {
        super(scope);        
        this.lan = this.Translate.Catalog.currentLanguage;

        this.service.getUserProfile().then((response) => {
            this.profileModel = response.data;
        });

    }
}   