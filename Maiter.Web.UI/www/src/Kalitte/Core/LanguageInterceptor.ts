/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../ref/angular-local-storage/angularLocalStorage.d.ts" />

import {Account, AuthData} from '../Data/AccountService';
import {$q, $localStorage, $state, $rootScope, AngularService, $http} from '../Vendor/AngularService';
import {Meta} from './Meta';
import {AuthorizationError} from './Errors';
import {BaseFactory} from './BaseFactory';
import {App} from './Application';
import { Translate} from '../Vendor/TranslateService';

@Meta.Factory('LanguageInterceptor')
export class LanguageInterceptor extends BaseFactory {

    static Configure(factory, app: ng.IModule) {

        app.config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('LanguageInterceptor');
        }]);

        BaseFactory.Configure(factory, app);
    }

    request(config: any) {
        config.headers = config.headers || {};
        config.headers.PreferredLanguage = Translate.CurrentLanguage(); 
        return config;
    }

    static $Factory(): LanguageInterceptor {
        return new LanguageInterceptor();
    }
}