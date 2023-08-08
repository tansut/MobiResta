/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/lodash/lodash.d.ts" />

import {ViewModels} from '../../Data/Models';
import {$localStorage, $rootScope, $q, $log} from '../../Kalitte/Vendor/AngularService';
import {SignalRConnection} from '../../Kalitte/Vendor/SignalRConnectionService';
import {List} from '../../Kalitte/Core/List';
import {Dictionary} from '../../Kalitte/Core/Dictionary';
import {Account} from '../../Kalitte/Data/AccountService';
import { App } from '../../Kalitte/Core/Application';
import { MaiterMobileApplication} from '../../Core/MaiterMobileApplication';

export class UserSession {
    public Messages: Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>;
    public AckMessages: List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>;

    rootScopeListeners: { [id: string]: Function } = {};
    App = <MaiterMobileApplication> App;

    on(...params: any[]) {
        var keys = params.filter((item) => angular.isString(item));
        var fnList = params.filter((item) => angular.isFunction(item));

        for (var i = 0; i < keys.length; i++) {
            if (this.rootScopeListeners[keys[i]])
                throw new Error(keys[i] + ' already registered.');
            var j = i;
            while (j >= 0 && !fnList[j]) { j-- };
            var fn = fnList[j];
            this.rootScopeListeners[keys[i]] = $rootScope.$on(keys[i], fn);
        }
    }

    //sendMessage(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) {
    //    $log.debug('Sending message ' + message.MessageContent.Id + ' with user test ' + message.MessageContent['UserText']);
    //    SignalRConnection.Send(message);
    //    this.addToMessageList(message);
    //}


    Disconnect(): ng.IPromise<any> {
        return new $q((resolve, reject) => {
            for (var evt in this.rootScopeListeners)
                this.rootScopeListeners[evt]();
            resolve();
        });
    }

    addToMessageList(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) {

    }

    sendAck(toUser: string, forMessage: string, ackType: string, additional?: Array<string>) {
        var ack = <ViewModels.Messaging.SentMessage>{
            FromUserId: Account.principal.identity.UserName,
            ToUserId: toUser,
            Id: forMessage,
            AdditionalIds: additional
        };

        SignalRConnection.Send(<ViewModels.Messaging.ClientMessage<any>> {
            MessageType: ackType,
            MessageContent: ack
        });
    }

    ChatMessage(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.CustomerRequestMessage>) {
        this.addToMessageList(message);
    }

    setAckMessages(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) {
        var messages = this.AckMessages.Items.filter((item) => item.MessageContent.Id == message.MessageContent.Id);
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].MessageType == ViewModels.Messaging.ReadMessage.TYPE)
                message.MessageContent.State = ViewModels.Messaging.MessageState.Read;
            else if (messages[i].MessageType == ViewModels.Messaging.SentMessage.TYPE)
                message.MessageContent.State = ViewModels.Messaging.MessageState.Sent;
            var fIndex = this.AckMessages.Items.indexOf(messages[i]);
            if (fIndex >= 0)
                this.AckMessages.Items.splice(fIndex, 1);
        }
    }

    MarkAsRead(messages: Array<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>) {
        var maxCheck = 10, setCount = 0;
        var messages = (messages.length > maxCheck ? messages.slice(messages.length - maxCheck, messages.length - 1) :
            messages).filter((message) => message.MessageContent.State == ViewModels.Messaging.MessageState.Received);
        for (var i = messages.length - 1; i >= 0; i--) {
            this.sendAck(messages[i].MessageContent.FromUserId, messages[i].MessageContent.Id, ViewModels.Messaging.ReadMessage.TYPE);
            messages[i].MessageContent.State = ViewModels.Messaging.MessageState.Read;
        }
    }

    MarkAs(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>, state: ViewModels.Messaging.MessageState) {
        for (var service in this.Messages.Items) {
            var list = this.Messages.Items[service].Items;
            var found = _.find<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>(list, "MessageContent.Id", message.MessageContent.Id);
            found && (found.MessageContent.State = state) && console.log(found.MessageContent.Id + ' marked as ' + state);
        }
    }

    constructor(public InitData: ViewModels.Mobile.CheckInResponse) {
        this.Messages = new Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>();
        this.AckMessages = new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>();

        this.on('SignalRConnection:Received', (event, data: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) => {
            if (typeof this[data.MessageType] == 'function') {
                data.MessageContent.State = ViewModels.Messaging.MessageState.Received;      
                this[data.MessageType](data);
                var autoAck = this.App.UserSeeChatMessages ?
                    ViewModels.Messaging.ReadMessage.TYPE :
                    ViewModels.Messaging.SentMessage.TYPE;
                this.sendAck(data.MessageContent.FromUserId, data.MessageContent.Id, autoAck);
                if (autoAck == ViewModels.Messaging.ReadMessage.TYPE)
                    data.MessageContent.State = ViewModels.Messaging.MessageState.Read;
            }
            else if (data.MessageType == ViewModels.Messaging.SentMessage.TYPE) {
                this.AckMessages.Add(data);
                this.MarkAs(data, ViewModels.Messaging.MessageState.Sent);
            } else if (data.MessageType == ViewModels.Messaging.ReadMessage.TYPE) {
                this.AckMessages.Add(data);
                this.MarkAs(data, ViewModels.Messaging.MessageState.Read);
            }
        });
    }
}