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


import {CustomerSession } from '../Core/Session/CustomerSession';
import {Session } from '../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../Kalitte/Vendor/AngularService';

import {RequestControllerBase} from './RequestController';

@Meta.Controller('CustomerRequestController')
export class CustomerRequestController extends ControllerBase {
    

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.customer.request', {
            url: 'request',
            abstract: true,
            template: '<ion-nav-view></ion-nav-view>',
            controller: 'CustomerRequestController as ctrl',
            controllerAs: 'ctrl',
            data: { title: ''  }
        });
    }
}

export class CustomerRequestControllerBase<T extends ViewModels.Mobile.RequestTypes.RequestContent> extends RequestControllerBase<T> {

    
    FromService = ViewModels.Company.ServiceKind.Customer;

    createRequestBag(): ViewModels.Mobile.RequestTypes.RequestBag<T> {
        var result = super.createRequestBag();
        result.CheckInId = Session.Customer.InitData.CheckId;
        result.CompanyId = Session.Customer.InitData.CompanyId;
        result.CompanySectionId = Session.Customer.InitData.SectionId;
        result.TableId = Session.Customer.InitData.TableId;
        return result;
    }

    beforeEnter() {
        if (!Session.Customer || Session.Customer.SessionType != ViewModels.Mobile.CustomerSessionType.Table) {
            $state.go('app.customer.initSession', {
                returnState: $state.current.name,
                returnStateParams: angular.copy($stateParams)
            });
            throw new Error('Session required');
        }
        super.beforeEnter();
        if (Account.principal.isAuthenticated && Session.Customer) {
            this.TargetService = ViewModels.Company.ServiceKind[<string>$stateParams['targetService']];
            this.RequestType = _.find(Session.Customer.InitData.AvailableRequests, "Name", this.RequestTypeName);            
        } 
    }

    redirectToChat(withNewMessage) {
        $state.go('app.customer.chat', {
            fromService: ViewModels.Company.ServiceKind[this.FromService],
            highlight: withNewMessage,
            targetService: ViewModels.Company.ServiceKind[this.TargetService],
            ChatUserId: withNewMessage.MessageContent.ToUserId,
            ChatUserName: withNewMessage.MessageContent.ToUserName
        });
    }

    initialize() {
        this.UserSession = Session.Customer;
        return super.initialize();
    }
    
    constructor(scope: ng.IScope, public RequestTypeName: string) {
        super(scope, RequestTypeName);
    }
}