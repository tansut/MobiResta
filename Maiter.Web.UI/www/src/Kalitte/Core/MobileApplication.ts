/// <reference path="../../ref/reflect-metadata/reflect-metadata.d.ts" />

import {Application, IApplicationConfig, AppPlatform} from '../../Kalitte/Core/Application';
import {$loading, $toaster, $ionicPopup} from '../Vendor/IonicService';

export interface IMobileApplicationConfig extends IApplicationConfig {
    PublicClientId: string;
    ShortLivedClientId: string;
    AuthStorageKey: string;
    PrincipalStorageKey: string;
}

export var MobileAppConfig: IMobileApplicationConfig;

export class MobileApplication extends Application<IMobileApplicationConfig> {

    FilterNS = "Maiter.Mobile.Filters";
    ControllerNS = "Maiter.Mobile.Controllers";
    ServiceNS = "Maiter.Mobile.Services";
    DirectiveNS = "Maiter.Mobile.Directives";
    Platform = AppPlatform.Mobile;

    getDependentModules() {
        return ['ngSanitize', 'ngAnimate', 'ui.router', 'ionic', 'ngCordova', 'ngMessages', 'toaster', 'LocalStorageModule', /* 'templates',*/
            this.DirectiveNS, this.ServiceNS, this.ControllerNS, this.DirectiveNS, this.FilterNS];
    }


    Alert(content: string, title?: string) {
        title = title || 'Bilgi';
        $toaster.info(title || 'Bilgi', content);
        return null;



    }


    Toast(msg: string, delay?: number) {
        $toaster.info('Bilgi', msg);
        return null;
    }


    Confirm(content: string, title?: string) {
        return $ionicPopup.confirm({
            title: title || 'Onay',
            template: content
        });
    }

    constructor(config: IMobileApplicationConfig) {
        super(config);
        MobileAppConfig = config;


    }
}