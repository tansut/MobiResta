/// <reference path="ref/angularjs/angular.d.ts" />
/// <reference path="ref/cordova/cordova.d.ts" />
/// <reference path="ref/ionic/ionic.d.ts" />
import {AppStates} from './lib/States';
import {CommonService} from './shared/Common';
import {MessageView} from './directive/MessageView';

import {AppController} from './controller/AppController';
import {BillRequestController} from './controller/BillRequestController';
import {ChatListController} from './controller/ChatListController';
import {HomeController} from './controller/HomeController';
import {InitSessionController} from './controller/InitSessionController';
import {RequestController} from './controller/RequestController';
import {SendMessageRequestController} from './controller/SendMessageRequestController';
import {WaiterRequestController} from './controller/WaiterRequestController';
import {CallTaxiRequestController} from './controller/CallTaxiRequestController';
import {CarRequestController} from './controller/CarRequestController';
import {HappyRequestController} from './controller/HappyRequestController';
import {SadRequestController} from './controller/SadRequestController';
import {WirelessRequestController} from './controller/WirelessRequestController';
import {ChefRecommendRequestController} from './controller/ChefRecommendRequestController';




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

    initDirectives() {
        var angModule = angular.module('maiter.directives', []);
        angModule.directive('messageView', MessageView.Factory)
    }

    initControllers() {
        var angModule = angular.module('maiter.controllers', []);
        angModule.controller('AppController', AppController);
        angModule.controller('BillRequestController', BillRequestController);
        angModule.controller('ChatListController', ChatListController);
        angModule.controller('HomeController', HomeController);
        angModule.controller('InitSessionController', InitSessionController);
        angModule.controller('RequestController', RequestController);
        angModule.controller('SendMessageRequestController', SendMessageRequestController);
        angModule.controller('WaiterRequestController', WaiterRequestController);
        angModule.controller('CallTaxiRequestController', CallTaxiRequestController);
        angModule.controller('CarRequestController', CarRequestController);
        angModule.controller('HappyRequestController', HappyRequestController);
        angModule.controller('SadRequestController', SadRequestController);
        angModule.controller('WirelessRequestController', WirelessRequestController);
        angModule.controller('ChefRecommendRequestController', ChefRecommendRequestController);
    }

    constructor(private $q: angular.IQService) {
        this.initControllers();
        this.initDirectives();
        this.appModule = angular.module('maiter', ['ngSanitize', 'ionic', 'ngCordova', 'maiter.controllers', 'maiter.directives','ngMessages','toaster']);

        this.appModule.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', ($stateProvider, $urlRouterProvider, $ionicConfigProvider) => {
            // $ionicConfigProvider.views.maxCache(0);

            /* Ionic framework scroll anında javascript ile hesaplama yaparak
               Ne Kadar scroll yapacağını belirliyordu. Telefonun kendi scroll'ını kullanmıyor
               Fakat bu yavaşlığa (kasmaya) sebep olduğu için disable ettim telefonun kendi
               scroll'ını kullanıyor şu anda 
               Örn : $ionicConfigProvider.scrolling.jsScrolling(false); 
             */
            $ionicConfigProvider.scrolling.jsScrolling(false); 
            AppStates.Configure($stateProvider, $urlRouterProvider);
        }]);
        
        this.appModule.service('Common', CommonService);
            
        // çirkin bi durum. Inject edebilmek için. (tansu)
        this.appModule.run(['Common', (common) => {

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
        else angular.element(document).ready(function() {
            onDeviceReady();
        });

        return defer;
    }
}

App.Create({}).run();