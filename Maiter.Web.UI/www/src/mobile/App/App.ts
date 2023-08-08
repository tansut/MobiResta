/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope, $state} from '../../Kalitte/Vendor/AngularService';
import {Account} from '../../Kalitte/Data/AccountService';
import {AnonymousPrincipal, Principal, UserPrincipal} from '../../Kalitte/Core/Principal';
import {Meta} from '../../Kalitte/Core/Meta';
import {App, Application} from '../../Kalitte/Core/Application';
import { CustomerSession } from '../../Core/Session/CustomerSession';
import { Session } from '../../Core/Session/SessionService';
import { ViewModels } from '../../Data/Models';
import {$ionicHistory} from '../../Kalitte/Vendor/IonicService';

export var AppControllerInstance: AppController;

@Meta.Controller('AppController')
export class AppController extends ControllerBase {

    Account = Account;
    Session = Session;

    public static ControllerName = 'AppController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise("/app/customer");
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,

            resolve: {
                app: () => App.Ready
            },

            templateUrl: 'src/mobile/App/App.html',
            controller: AppController.ControllerName + ' as ctrl'
        })
    }



    loginStatusChanged(principal: Principal<any>, initing: boolean = false) {
        
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();

        if (!initing)
            Session.DisconnectAll();

        // we have a logged in user
        if (principal instanceof UserPrincipal) {
            var worker = <ViewModels.Account.WorkerInfo>principal.userData;
            if (worker != null && worker.Companies && worker.Companies.length) {
                if (worker.Companies.length == 1)
                    worker.DefaultCompanyId = worker.Companies[0].CompanyId;
                $state.go("app.worker.companyselect");
            } else if (!initing) {

                $state.go('app.customer.home');
            }
        } else if (!initing)
            $state.go('app.customer.home');
    }

    signalRAnormality() {
        Session.DisconnectAll();
    }


    constructor($scope: angular.IScope) {
        super($scope);
        AppControllerInstance = this;

        this.on('UserLoggedIn', (event, arg) => {
            this.loginStatusChanged(arg);
        });

        this.on('UserLoggedOff', (event, arg) => {
            this.loginStatusChanged(arg);
        });

        this.on('SignalRConnection:DisconnectedAbnormally', (evet, arg) => {
            this.signalRAnormality();
        });

        App.Ready.then(() => {
            $timeout(() => {
                angular.element(document.body).addClass('ready');
            }, 0);

        }).then(() => super.initialize());

        this.loginStatusChanged(Account.principal, true);
    }
}   

// TEMPLATE

/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/lodash/lodash.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


//import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
//import {$timeout, $rootScope, $state, $stateParams} from '../../Kalitte/Vendor/AngularService';
//import {Account} from '../../Kalitte/Data/AccountService';
//import {Meta} from '../../Kalitte/Core/Meta';
//import {Entity, ViewModels} from '../../../Data/Models';

//@Meta.Controller('ContentViewController', {
//    state: {
//        name: 'app.contentview',
//        url: "/contentview/:url",
//        templateUrl: 'src/mobile/App/ContentViewer.html',
//        data: {
//            title: ''
//        },
//        MobileControllerAs: true
//    }
//})
//export class AppController extends ControllerBase {

//    initialize() {
//        return super.initialize();
//    }
//}   

// VIEW

//<ion-view view-title="{{ctrl.$state.current.data.title  || 'MobiResta'}}" >
//<ion-content padding= "true" >
//</ion-content>
//< /ion-view>