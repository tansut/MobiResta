/// <reference path="../ref/angularjs/angular.d.ts" />

import {Message, MessageType, MessageState, MessageList, XmppClient} from './XmppClient';
import {$stateParams, $q, $log, $state, $rootScope} from '../shared/Common';

export interface Credentials {
    uid: string;
    pwd: string;
    display?: string;
}

export interface SessionInitData {
    msgServerUrl: string;
    business: {
        name: string;
        description: string;
        headerImages: Array<string>;
    };    
    xmppUser: Credentials;
    inited?:boolean;
}

export interface AccountData {
    uid: string;
    display: string;
}

export class Session {
    chatList: MessageList = new MessageList();
    private onMessageRemoveHandler: any;
    private networkOffRemoveHandler: any;

    public xmppClient: XmppClient;
    public startData: SessionInitData;

    private disconnectDefer: ng.IDeferred<void>;
    private connectDefer: ng.IDeferred<void>;

    static instance: Session;

    static get HasSession() {
        return Session.instance && Session.instance.active;
    }

    public static Recreate() {
        if (Session.instance)
            Session.instance.disconnect('recreate');

        return new Session();
    }

    get active() {
        return typeof this.xmppClient != 'undefined' && this.xmppClient.connected;
    }

    networkOff() {
        console.log('Network off signal received. Cleanup session ...');
        this.cleanup();
        this.disconnectDefer.resolve();
    }

    constructor() {
        Session.instance = this;
    }

    send(message: Message) {
        return this.xmppClient.send(message).then((message) => {
            this.chatList.add(message);
        });
    }

    newMessage(to: string, body: string, attributes?: Object, subject?: string): Message {
        var attributes = attributes || {};

        return {
            type: MessageType.chat,
            to: to,
            subject: subject,
            attributes: attributes,
            body: body,
            timestamp: Date.now(),
            state: MessageState.sent
        }
    }

    cleanup() {
        if (this.onMessageRemoveHandler)
            this.onMessageRemoveHandler();
        if (this.networkOffRemoveHandler)
            this.networkOffRemoveHandler();
        delete this.xmppClient;
    }

    disconnect(reason: string = "") {

        if (this.xmppClient && this.xmppClient.connected) {
            this.xmppClient.disconnect();
        }

        return this.disconnectDefer.promise;
    }

    onMessage(msg: Message) {
        $rootScope.$digest();
    }

    start(options: SessionInitData) {
        
        this.startData = options;
        this.networkOffRemoveHandler = $rootScope.$on('maiter:xmpp:disconnect', this.networkOff.bind(this));

        this.connectDefer = $q.defer<void>();
        this.disconnectDefer = $q.defer<void>();

        var onMessageReceived = (event, msg) => {
            this.onMessage(msg); 
        }

        this.xmppClient = new XmppClient({
            url: this.startData.msgServerUrl,
            user: this.startData.xmppUser.uid,
            pwd: this.startData.xmppUser.pwd
        });
        

        this.xmppClient.connect().then(() => {
            $log.log('Connected to server');
            this.onMessageRemoveHandler = $rootScope.$on('maiter:message', onMessageReceived);
            this.xmppClient.listen();
            this.connectDefer.resolve();
        }, (err) => { 
            console.log(err);               
            this.connectDefer.reject(err);
        });

        return this.connectDefer.promise;
    }
}

