import {MobileApplication, IMobileApplicationConfig} from '../Kalitte/Core/MobileApplication';
import { $filter } from '../Kalitte/Vendor/AngularService';

export interface IMaiterMobileApplicationConfig extends IMobileApplicationConfig {
}

export class MaiterMobileApplication extends MobileApplication {

    UserSeeChatMessages: boolean = false;

    getDependentModules() {
        return ['ngSanitize', 'ngAnimate', 'ui.router', 'ionic', 'ngCordova', 'ngMessages', 'toaster', 'LocalStorageModule', 'gettext', 'blockUI',
            this.DirectiveNS, this.ServiceNS, this.ControllerNS, this.DirectiveNS, this.FilterNS];
    }


    constructor(config: IMaiterMobileApplicationConfig) {
        super(config);
        this.AngularApp.run(['TranslateService', (service) => {
            
        }]);

        this.AngularApp.config(['$ionicConfigProvider', 'blockUIConfig', (ionicConfig, blockUIConfig) => {
            ionicConfig.tabs.position('bottom');
            blockUIConfig.message = '...';
            blockUIConfig.delay = 1000;
            blockUIConfig.cssClass = 'maiter-block-ui';
            blockUIConfig.requestFilter = (config) => {
                var filter = $filter('translate');
                if (filter)
                    return filter('Loading ...');
                else return 'Loading ...';
            };
        }]);
    }
}