/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/lodash/lodash.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../Kalitte/UI/ControllerBase';
import {Meta} from '../Kalitte/Core/Meta';
import {ViewModels, Entity, Data} from '../Data/Models';
import {Kalitte} from '../Kalitte/Data/Models';

import {$timeout, $location, $rootScope} from '../Kalitte/Vendor/AngularService';
import {Translate} from '../Kalitte/Vendor/TranslateService';
import {Account} from '../Kalitte/Data/AccountService';
import {Remote} from '../Kalitte/Data/RemoteService';
import {AnonymousPrincipal} from '../Kalitte/Core/Principal';


import {WorkerSession } from '../Core/Session/WorkerSession';
import {Session } from '../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../Kalitte/Vendor/AngularService';

import {RequestControllerBase} from './RequestController';

@Meta.Controller('WorkerRequestController')
export class WorkerRequestController extends ControllerBase {
    
    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.worker.request', {
            url: 'request',
            abstract: true,
            template: '<ion-nav-view></ion-nav-view>',
            controller: 'WorkerRequestController as ctrl',
            controllerAs: 'ctrl',
            data: { title: ''  }
        });
    }
}

export class WorkerRequestControllerBase<T extends ViewModels.Mobile.RequestTypes.RequestContent> extends RequestControllerBase<T> {

    initialize() {
        this.UserSession = Session.Worker;
        return super.initialize();
    }

    FromService = ViewModels.Company.ServiceKind.Worker;

    createRequestBag(): ViewModels.Mobile.RequestTypes.RequestBag<T> {
        var result = super.createRequestBag();
        result.CheckInId = Session.Worker.InitData.CheckId;
        result.CompanyId = Session.Worker.InitData.CompanyId;
        return result;
    }

    redirectToChat(withNewMessage) {
        $state.go('app.worker.chat', {
            source: this.FromService,
            highlight: withNewMessage,
            target: this.TargetService,
            ChatUserId: withNewMessage.MessageContent.ToUserId
        });
    }

    
    constructor(scope: ng.IScope, public RequestTypeName: string) {
        super(scope, RequestTypeName);
    }
}