/// <reference path="../../ref/strophe/strophe.d.ts" />
/// <reference path="../../ref/angularjs/angular.d.ts" />

import {$stateParams, $q, $log, $state, $rootScope, $timeout} from '../Vendor/AngularService';

export interface XmppConnectOptions {
    url: string;
    user: string;
    pwd: string;
};

export enum MessageState {
    received = 0,
    sent = 1,
    receiving = 2,
    sending = 4
};

export var MessageType = {
    chat: "chat", headline: "headline", error: "error"
};

export interface Message {
    type: string;
    from?: string;
    to: string;
    contentType?: string;
    subject?: string;
    attributes: Object;
    body: string;
    timestamp: number;
    content?: any;
    state: MessageState;
    subtype?: string;
}

export class MessageList {
    items: Message[] = [];

    clear() {
        this.items.length = 0;
    }

    add(item: Message) {
        this.items.push(item);
    }
}

export class XmppClient {
    private connection: Strophe.Connection;
    private messageHandler: any;
    public connected: boolean = false;
    private disconnectDefer: ng.IDeferred<void>;
    private connectDefer: ng.IDeferred<void>;


    public getPlugin<T>(plugin: string): T {
        return this.connection[plugin];
    }

    static Factory(): typeof XmppClient {
        return XmppClient;
    }

    constructor(private options: XmppConnectOptions) {

    }

    sendMessage(stropheMessage) {
        var defer = $q.defer<string>();

        var id = this.connection.send(stropheMessage);
        $log.debug('Sent message to ' + stropheMessage.getAttribute('to'));

        $timeout(() => {
            defer.resolve("");
        })
        return defer.promise;
    }


    send(msg: Message) {

        var msgObj = {
            type: msg.type,
            to: msg.to,
            from: msg.from,
        };

        msg.state = MessageState.sending;

        msgObj = angular.extend(msgObj, msg.attributes);

        var msgEl = $msg(msgObj);

        if (msg.subject)
            msgEl.c('subject', msg.subject).up();
        msgEl.c('body', msg.body).up();

        if (msg.content) {
            msgEl.c('content', JSON.stringify(msg.content)).up();
        }

        var defer = $q.defer<Message>();

        var id = this.connection.send(msgEl.tree());
        $log.debug('Sent message to ' + msg.to);

        $timeout(() => {
            msg.state = MessageState.sent;
        }, 500)
        defer.resolve(msg);
        return defer.promise;
    }

    xmppConnectHandler(status) {
        if (status == Strophe.Status.CONNECTING) {
            $log.debug('Strophe is connecting.');
        } else if (status == Strophe.Status.CONNFAIL) {
            $log.error('Strophe failed to connect.');
            this.connectDefer.reject();
        } else if (status == Strophe.Status.AUTHFAIL) {
            $log.error('Authentication failed to connect.');
            this.connectDefer.reject(status);
        } else if (status == Strophe.Status.ERROR) {
            $log.error('Unknown error failed to connect.');
            this.connectDefer.reject(status);
        } else if (status == Strophe.Status.DISCONNECTING) {
            $log.debug('Strophe is disconnecting.');
        } else if (status == Strophe.Status.DISCONNECTED) {
            $log.debug('Strophe is disconnected.');
            this.connectDefer.reject();
            this.cleanup();
            this.disconnectDefer.resolve();
            $rootScope.$broadcast('maiter:xmpp:disconnect');
        } else if (status == Strophe.Status.CONNECTED) {
            $log.info('Strophe is connected.');
            this.connected = true;
            this.connectDefer.resolve();
            $rootScope.$broadcast('maiter:xmpp:connect', this.connection);
        }
    }

    connect() {
        if (this.connection)
            throw new Error('Already connected. Disconnect first');

        this.connection = new Strophe.Connection(this.options.url);

        this.connectDefer = $q.defer<void>();
        this.disconnectDefer = $q.defer<void>();

        this.connection.connect(this.options.user, this.options.pwd, this.xmppConnectHandler.bind(this), 3);

        return this.connectDefer.promise;
    }

    listen() {

        var onMessage = (msg) => {

            var _msg: Message = {
                type: msg.getAttribute('type'),
                to: msg.getAttribute('to'),
                from: msg.getAttribute('from'),
                attributes: {},
                body: undefined,
                timestamp: Date.now(),
                state: MessageState.received,
                title: ''
            }

            var i = 0;
            while (msg.attributes[i]) {
                if (msg.attributes[i].name != 'to' && msg.attributes[i].name != 'type' && msg.attributes[i].name != 'from')
                    _msg.attributes[msg.attributes[i].name] = msg.attributes[i].value;
                i++;
            }

            var elems = msg.getElementsByTagName('body');
            if (_msg.type == MessageType.chat) {
                var msgBody = '';

                if (elems.length) {
                    _msg.body = msgBody = Strophe.getText(elems[0]);
                }
            } else if (_msg.type == MessageType.error) {
                _msg.body = 'Şu anda talebiniz işlenemiyor veya bu hizmet mevcut değil';
            } else {
                _msg.body = elems.length ? elems[0] : undefined;
            }


            $log.debug('ECHOBOT: I got a message from ' + _msg.from);
            $rootScope.$broadcast('maiter:message', _msg);
            return true;
        }
        this.messageHandler = this.connection.addHandler(onMessage, null, 'message', null, null, null);
        this.connection.send($pres().tree());
    }

    cleanup() {
        if (this.messageHandler)
            this.connection.deleteHandler(this.messageHandler);
        this.connected = false;
        this.connection = undefined;
        this.messageHandler = undefined;
    }

    disconnect() {
        if (!this.connected)
            throw new Error('Not connected');

        this.connection.disconnect('close');

        return this.disconnectDefer.promise;
    }
}