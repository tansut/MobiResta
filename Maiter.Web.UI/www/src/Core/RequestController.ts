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
import {UserSession } from '../Core/Session/UserSession';
import {Session } from '../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../Kalitte/Vendor/AngularService';



export class RequestControllerBase<T extends ViewModels.Mobile.RequestTypes.RequestContent> extends ControllerBase {
    UserSession: UserSession;
    RequestType: ViewModels.Mobile.CustomerRequestType;
    TargetService: ViewModels.Company.ServiceKind;
    FromService: ViewModels.Company.ServiceKind;

    Title = $stateParams['title'];
    $RequestService = Remote.Entity("Request");
    Request: T;
    UserText: string;


    createRequest(): T {
        return null;
    }

    createRequestBag(): ViewModels.Mobile.RequestTypes.RequestBag<T> {
        var requestBag = <ViewModels.Mobile.RequestTypes.RequestBag<T>> {
            Target: this.TargetService,
            Source: this.FromService,
            Location: {
                Lat: 0.0,
                Long: 0.0
            },
            RequestContent: this.Request,
            UserText: this.UserText
        };
        return requestBag;
    }

    redirectToChat(withNewMessage: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) {

    }

    sendRequest(): ng.IPromise<any> {
        if (this.$Dirty) {
            alert('Still sending old message. Please wait for finish');
            return $q.reject();
        }
        this.$Dirty = true;
        var defer = $q.defer();

        $timeout(() => {
            var requestBag = this.createRequestBag();

            var promise = this.errorHandled(this.$RequestService.Call<ViewModels.Messaging.RequestResponse>(this.RequestType.Name + 'Request', {}, requestBag).then((result) => {
                var message = this.createClientMessage(result, requestBag);
                if (message) {
                    this.UserSession.addToMessageList(message);
                    this.redirectToChat(message);
                }
            }));
            promise.finally(() => this.$Dirty = false);
            promise.then(() => defer.resolve(), (err) => defer.reject(err));
        }, 50);

        return defer.promise;
    }

    createClientMessage(response: ViewModels.Messaging.RequestResponse, bag: ViewModels.Mobile.RequestTypes.RequestBag<T>): ViewModels.Messaging.ClientMessage<any> {
        var newMessage = <ViewModels.Messaging.ClientMessage<any>> {
            MessageType: response.MessageType,
            MessageContent: <ViewModels.Messaging.RequestMessage> {
                FromUserId: Account.principal.identity.UserName,
                UserContent: this.UserText,
                ToService: response.ToService,
                ToUserId: response.ToUserId,
                Id: response.Id,
                State: ViewModels.Messaging.MessageState.Transferred,
                FromUserName: Account.principal.identity.Title,
                ToUserName: response.ToUserName,
                FromService: this.FromService,
                CreatedAt: response.CreatedAt
            }
        }
        return newMessage;
    }

    beforeEnter() {
        if (!Account.principal.isAuthenticated) {
            $state.go('app.login', {
                returnState: $state.current.name,
                returnStateParams: angular.copy($stateParams)
            });
            throw new Error('Authentication required');
        }
        super.beforeEnter();
    }

    initialize() {
        this.Request = this.createRequest();
        return super.initialize();
    }

    constructor(scope: ng.IScope, public RequestTypeName: string) {
        super(scope);
    }
}