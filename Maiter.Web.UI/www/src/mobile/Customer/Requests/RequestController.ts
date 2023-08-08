/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {Meta} from '../../../Kalitte/Core/Meta';
import {ViewModels, Entity, Data} from '../../../Data/Models';
import {Kalitte} from '../../../Kalitte/Data/Models';

import {$timeout, $location, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {Translate} from '../../../Kalitte/Vendor/TranslateService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {AnonymousPrincipal} from '../../../Kalitte/Core/Principal';


import {SendMessageRequest} from '../../../Core/Request/SendMessageRequest';
import {Branch, AllBranches} from '../../../Core/Request/Branch';

import {CustomerSession } from '../../../Core/Session/CustomerSession';
import {Session } from '../../../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';

import { PayRequestController } from './pay'; 

@Meta.Controller('CustomerRequestController')
export class CustomerRequestController extends ControllerBase {

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.customer.request', {
            url: '/request',
            abstract: true,
            template: '<ion-nav-view></ion-nav-view>',
            controller: 'CustomerRequestController as ctrl',
            controllerAs: 'ctrl',
            data: { title: ''  }
        });
    }
}

export class RequestControllerBase<T extends ViewModels.Mobile.RequestTypes.RequestContent> extends ControllerBase {

    RequestType: ViewModels.Mobile.CustomerRequestType;
    Target: ViewModels.Company.ServiceKind;
    Title = $stateParams['title'];
    $RequestService = Remote.Entity<Kalitte.CreatedResponse>("Request");
    Request: T;
    UserText: string;

    createRequest(): T {
        return null;
    }

    sendRequest(): ng.IPromise<any> {
        var requestBag = <ViewModels.Mobile.RequestTypes.RequestBag<T>> {
            Target: this.Target,
            Source: ViewModels.Company.ServiceKind.Customer,
            Location: {
                Lat: 0.0,
                Long: 0.0
            },
            RequestContent: this.Request,
            CheckInId: Session.Customer.InitData.CheckId,
            CompanyId: Session.Customer.InitData.CompanyId,
            CompanySectionId: Session.Customer.InitData.SectionId,
            TableId: Session.Customer.InitData.TableId,
            UserText: this.UserText
        };
        return this.errorHandled(this.$RequestService.Call<ViewModels.Messaging.ClientMessage<any>>(this.RequestType.Name + 'Request', {}, requestBag).then((result) => {
            Session.Customer.addToMessageList(result);
        }));
    }

    beforeEnter() {
        if (!Session.Customer) {
            $state.go('app.customer.home');
            throw new Error('Needs customer session');
        }
        else {
            this.Target = ViewModels.Company.ServiceKind[<string>$stateParams['target']];
            this.RequestType = _.find(Session.Customer.InitData.AvailableRequests, "Name", this.RequestTypeName);
            this.Request = this.createRequest();
            super.beforeEnter();
        }
    }

    initialize() {
        return super.initialize();
    }

    constructor(scope: ng.IScope, public RequestTypeName: string) {
        super(scope);
    }
}