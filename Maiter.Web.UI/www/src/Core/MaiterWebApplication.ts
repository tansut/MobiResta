import {WebApplication, IWebApplicationConfig} from '../Kalitte/Core/WebApplication';

export interface IMaiterWebApplicationConfig extends IWebApplicationConfig {
}

export class MaiterWebApplication extends WebApplication {

    getDependentModules() {
        return ['ngMaterial', 'ngAnimate', 'ngSanitize', 'ui.router', 'LocalStorageModule', 'angular-loading-bar', 'blockUI', 'ngFileUpload', 'ngMessages', 'gettext', 'angular-carousel', 'ngMap', 'textAngular',
            this.DirectiveNS, this.ServiceNS, this.ControllerNS, this.DirectiveNS, this.FilterNS];
    }

    constructor(config: IMaiterWebApplicationConfig) {
        super(config);
        this.AngularApp.run(['TranslateService', (service) => {
            
        }]);
    }
}