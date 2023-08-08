/// <reference path="./ref/angularjs/angular.d.ts" />
/// <reference path="./ref/cordova/cordova.d.ts" />

import {RegistrationService, Registration} from './service/RegistrationService';
import {AngularService} from './service/AngularService';
import {SitemapService} from './service/SitemapService';
import {RemoteService} from './service/data/RemoteService';
import {AccountService} from './service/data/AccountService';
import {CompanyService} from './service/data/CompanyService';
import {MaterialService} from './service/MaterialService';
import {AppStatesService} from './service/AppStatesService';

import {SharedStates} from './lib/SharedStates';
import {BaseController} from './lib/BaseController';
import {List} from './lib/List';

import {AppController} from './app/App/App';
import {HomeController} from './app/Home/Home';

import {BaseAccountController}  from './app/Account/Account';
import {LoginController}  from './app/Account/Login';
import {SignOffController} from './app/Account/SignOff';

import {CompanyController} from './app/Company/Company';


import {MenuLink} from './directive/Menu/MenuLink';
import {MenuToggle} from './directive/Menu/MenuToggle';
import {NoSpace} from './filter/NoSpace';




export class App {
    static instance: App;

    static $inject = ['$q'];

    static Create(options) {
        if (App.instance)
            throw new Error('Only one instance is allowed');

        var injector = angular.injector(['ng']);
        App.instance = injector.instantiate(App, {
            options: options
        });
        return App.instance;
    }

    private appModule: angular.IModule;

    initFilters() {
        var angModule = angular.module('maiter.filters', []);
        angModule.filter('nospace', NoSpace.Factory);
    }


    initDirectives() {
        var angModule = angular.module('maiter.directives', []);
        angModule.directive('menuLink', MenuLink.Factory);
        angModule.directive('menuToggle', MenuToggle.Factory);
    }

    initControllers() {

        // ugly hack (tansu): Import etmek yetmiyor, kullanığı zaman staticler 
        var appControllers = [AppController, HomeController, BaseAccountController, LoginController, SignOffController, CompanyController];

        var angModule = angular.module('maiter.controllers', []);
        var controllers = Registration.Controllers;

        controllers.GetItems().forEach((item) => angModule.controller(item.Key, item.Value));
    }

    constructor(private $q: angular.IQService) {
        
        this.initDirectives();
        this.initFilters();
        this.initControllers();
        this.appModule = angular.module('maiter', ['ngMaterial', 'ngAnimate', 'ngSanitize', 'ui.router', 'maiter.controllers', 'maiter.directives', 'maiter.filters']);

        this.appModule.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', ($stateProvider, $urlRouterProvider, $mdThemingProvider) => {
            SharedStates.Configure($stateProvider, $urlRouterProvider);
            Registration.Controllers.GetItems().forEach((item) => {
                item.Value.ConfigureStates(($stateProvider))
            });


            $mdThemingProvider.definePalette('docs-blue', $mdThemingProvider.extendPalette('blue', {
                '50': '#DCEFFF',
                '100': '#AAD1F9',
                '200': '#7BB8F5',
                '300': '#4C9EF1',
                '400': '#1C85ED',
                '500': '#106CC8',
                '600': '#0159A2',
                '700': '#025EE9',
                '800': '#014AB6',
                '900': '#013583',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400 A200 A400'
            }));
            $mdThemingProvider.definePalette('docs-red', $mdThemingProvider.extendPalette('red', {
                'A100': '#DE3641'
            }));

            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();

            $mdThemingProvider.theme('default')
                .primaryPalette('docs-blue')
                .accentPalette('docs-red');

        }]);

        this.appModule.service('Angular', AngularService);
        this.appModule.service('Material', MaterialService);
        this.appModule.service('Sitemap', SitemapService);
        this.appModule.service('Account', AccountService);
        this.appModule.service('Company', CompanyService);
        this.appModule.service('AppStates', AppStatesService);
            
        // çirkin bi durum. Inject edebilmek için. (tansu)
        this.appModule.run(['Angular', 'Material', 'Sitemap', 'Account', 'Company', 'AppStates', (common, material, SitemapService, AccountService, CompanyService) => {

        }])
    }

    run() {

        var defer = this.$q.defer<App>();

        var onDeviceReady = () => {
            angular.bootstrap(document, ['maiter']);
            
            defer.resolve(this);
        }
        
        if (window.cordova)
            document.addEventListener('deviceready', onDeviceReady, false);
        else angular.element(document).ready(function () {
            onDeviceReady();
        });

        return defer;
    }
}

App.Create({ss:11}).run();