/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope, $state} from '../../Kalitte/Vendor/AngularService';
import { SignalRConnection } from '../../Kalitte/Vendor/SignalRConnectionService';
import {$ionicHistory} from '../../Kalitte/Vendor/IonicService';
import {Account} from '../../Kalitte/Data/AccountService';
import {AnonymousPrincipal, Principal} from '../../Kalitte/Core/Principal';
import {Meta} from '../../Kalitte/Core/Meta';
import {App, Application} from '../../Kalitte/Core/Application';
import { WorkerSession } from '../../Core/Session/WorkerSession';
import {ViewModels} from '../../Data/Models';


export var AppControllerInstance: AppController;

@Meta.Controller('WorkerAppController')
export class AppController extends ControllerBase {
    public static ControllerName = 'WorkerAppController';

    Account = Account;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $stateProvider.state('app.worker', {
            url: "/worker",
            abstract: true,
            templateUrl: 'src/mobile/Worker/App.html',
            controller: AppController.ControllerName + ' as app'
        })
    }

    workerStatusChanged(session: WorkerSession) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        if (!session)
            $state.go('app.customer.home');
    }



    constructor($scope: angular.IScope) {
        super($scope);
        AppControllerInstance = this;
        this.on('WorkerSessionCreated', 'WorkerSessionDisconnected', (event, args) => {
            this.workerStatusChanged(args);
        });

        //this.on('SignalRConnection:Received:CustomerRequestMessage', (event, arg) => {
        //    this.customerRequestReceived(arg);
        //});
    }
}   