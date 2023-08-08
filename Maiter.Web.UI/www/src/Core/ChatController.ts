/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../Kalitte/UI/ControllerBase';
import {EntityListController} from '../Kalitte/UI/EntityListController';
import {Meta} from '../Kalitte/Core/Meta';
import {ViewModels} from '../Data/Models';
import {UserSession} from '../Core/Session/UserSession';
import {List} from '../Kalitte/Core/List';
import {Dictionary} from '../Kalitte/Core/Dictionary';
import {Session} from '../Core/Session/SessionService';
import {$stateParams, $q, $log, $state, $filter} from '../Kalitte/Vendor/AngularService';
import {$ionicScrollDelegate} from '../Kalitte/Vendor/IonicService';
import {RequestControllerBase} from './RequestController';
import {Account} from '../Kalitte/Data/AccountService';
import { App } from '../Kalitte/Core/Application';
import { MaiterMobileApplication} from '../Core/MaiterMobileApplication';

export class ChatListController extends RequestControllerBase<ViewModels.Mobile.RequestTypes.ChatRequest> {
    
    List: List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>;
    ChatUserId: string;
    ChatUserName: string;
    me: string;
    App = <MaiterMobileApplication>App;

    createMessageList() {
        
    }

    initialize() {
        if (!this.UserSession)
            throw new Error('Requires session');
        this.me = Account.principal.identity.UserName;

        $ionicScrollDelegate.scrollBottom(true);        
        
        this.TargetService = ViewModels.Company.ServiceKind[<string>$stateParams['targetService']];
        this.FromService = ViewModels.Company.ServiceKind[<string>$stateParams['fromService']];
        this.ChatUserId = $stateParams['ChatUserId'];
        this.ChatUserName = $stateParams['ChatUserName'];

        this.createMessageList();

        this.UserSession.MarkAsRead(this.List.Items);

        this.App.UserSeeChatMessages = true;   
        return super.initialize();
    }

    sendRequest() {
        return super.sendRequest().then(() => {
            this.UserText = "";
            $ionicScrollDelegate.scrollBottom(true);
        });
    }

    redirectToChat(withNewMessage: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) {

    }

    createRequest() {
        return <ViewModels.Mobile.RequestTypes.ChatRequest> {
            ToUserId: this.ChatUserId
        };
    }

    //fromUserTitle() {
    //    if (!this.List || !this.List.Items.length)
    //        return $filter('translate')(ViewModels.Company.ServiceKind[this.TargetService]);

    //    var last = <ViewModels.Messaging.ChatMessage>this.List.Items[this.List.Items.length - 1].MessageContent;

    //    if (last.FromUserId == Account.principal.identity.UserId) {
    //        return last.ToUserName ? last.ToUserName : $filter('translate')(ViewModels.Company.ServiceKind[last.ToService])
    //    } else {
    //        return last.FromUserName ? last.FromUserName : $filter('translate')(ViewModels.Company.ServiceKind[last.FromService])

    //    }
    //}

    constructor($scope: ng.IScope) {
        super($scope, ViewModels.Mobile.RequestTypes.ChatRequestType.Name);
        this.on('SignalRConnection:Received', (event, data: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) => {
            $ionicScrollDelegate.scrollBottom(true);
        });
        this.$scope.$on('$destroy', () => {
            this.App.UserSeeChatMessages = false;
        });
    }
}   