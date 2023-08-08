/// <reference path="ref/angularjs/angular.d.ts" />
/// <reference path="ref/cordova/cordova.d.ts" />
/// <reference path="ref/ionic/ionic.d.ts" />
var States_1 = require('./lib/States');
var Common_1 = require('./shared/Common');
var MessageView_1 = require('./directive/MessageView');
var AppController_1 = require('./controller/AppController');
var BillRequestController_1 = require('./controller/BillRequestController');
var ChatListController_1 = require('./controller/ChatListController');
var HomeController_1 = require('./controller/HomeController');
var InitSessionController_1 = require('./controller/InitSessionController');
var RequestController_1 = require('./controller/RequestController');
var SendMessageRequestController_1 = require('./controller/SendMessageRequestController');
var WaiterRequestController_1 = require('./controller/WaiterRequestController');
var CallTaxiRequestController_1 = require('./controller/CallTaxiRequestController');
var CarRequestController_1 = require('./controller/CarRequestController');
var HappyRequestController_1 = require('./controller/HappyRequestController');
var SadRequestController_1 = require('./controller/SadRequestController');
var WirelessRequestController_1 = require('./controller/WirelessRequestController');
var ChefRecommendRequestController_1 = require('./controller/ChefRecommendRequestController');
var App = (function () {
    function App($q) {
        this.$q = $q;
        this.initControllers();
        this.initDirectives();
        this.appModule = angular.module('maiter', ['ngSanitize', 'ionic', 'ngCordova', 'maiter.controllers', 'maiter.directives', 'ngMessages', 'toaster']);
        this.appModule.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
                // $ionicConfigProvider.views.maxCache(0);
                /* Ionic framework scroll anında javascript ile hesaplama yaparak
                   Ne Kadar scroll yapacağını belirliyordu. Telefonun kendi scroll'ını kullanmıyor
                   Fakat bu yavaşlığa (kasmaya) sebep olduğu için disable ettim telefonun kendi
                   scroll'ını kullanıyor şu anda
                   Örn : $ionicConfigProvider.scrolling.jsScrolling(false);
                 */
                $ionicConfigProvider.scrolling.jsScrolling(false);
                States_1.AppStates.Configure($stateProvider, $urlRouterProvider);
            }]);
        this.appModule.service('Common', Common_1.CommonService);
        // çirkin bi durum. Inject edebilmek için. (tansu)
        this.appModule.run(['Common', function (common) {
            }]);
    }
    App.Create = function (options) {
        if (App.instance)
            throw new Error('Only one instance is allowed');
        var injector = angular.injector(['ng']);
        App.instance = injector.instantiate(App, {
            options: options
        });
        return App.instance;
    };
    App.prototype.initDirectives = function () {
        var angModule = angular.module('maiter.directives', []);
        angModule.directive('messageView', MessageView_1.MessageView.Factory);
    };
    App.prototype.initControllers = function () {
        var angModule = angular.module('maiter.controllers', []);
        angModule.controller('AppController', AppController_1.AppController);
        angModule.controller('BillRequestController', BillRequestController_1.BillRequestController);
        angModule.controller('ChatListController', ChatListController_1.ChatListController);
        angModule.controller('HomeController', HomeController_1.HomeController);
        angModule.controller('InitSessionController', InitSessionController_1.InitSessionController);
        angModule.controller('RequestController', RequestController_1.RequestController);
        angModule.controller('SendMessageRequestController', SendMessageRequestController_1.SendMessageRequestController);
        angModule.controller('WaiterRequestController', WaiterRequestController_1.WaiterRequestController);
        angModule.controller('CallTaxiRequestController', CallTaxiRequestController_1.CallTaxiRequestController);
        angModule.controller('CarRequestController', CarRequestController_1.CarRequestController);
        angModule.controller('HappyRequestController', HappyRequestController_1.HappyRequestController);
        angModule.controller('SadRequestController', SadRequestController_1.SadRequestController);
        angModule.controller('WirelessRequestController', WirelessRequestController_1.WirelessRequestController);
        angModule.controller('ChefRecommendRequestController', ChefRecommendRequestController_1.ChefRecommendRequestController);
    };
    App.prototype.run = function () {
        var _this = this;
        var defer = this.$q.defer();
        var onDeviceReady = function () {
            angular.bootstrap(document, ['maiter']);
            defer.resolve(_this);
        };
        if (window.cordova)
            document.addEventListener('deviceready', onDeviceReady, false);
        else
            angular.element(document).ready(function () {
                onDeviceReady();
            });
        return defer;
    };
    App.$inject = ['$q'];
    return App;
})();
exports.App = App;
App.Create({}).run();
