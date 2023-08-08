/// <reference path="../ref/angularjs/angular.d.ts" />

import {XmppClient, Message} from '../shared/XmppClient';
import {Session, SessionInitData, AccountData} from '../shared/Session';
import {$stateParams, $q, $log, $state, $timeout,$ionicScrollDelegate} from '../shared/Common';
import {Decoder} from '../shared/QR';
import {Branch} from '../request/Branch';
import {RequestBase} from '../shared/RequestBase';

export interface CustomerSessionData extends SessionInitData {
    tableId: string;
    tableName: string;

    accounts: {
        kitchen?: AccountData;
        service?: AccountData;
        vale?: AccountData;
        management?: AccountData;
    }
}

export interface CustomerTag {
    tableId: string;
    createdAt: number
}


export interface CustomerRequest {
    type: string;
    request: RequestBase;
    from: string;
}

export class CustomerSession extends Session {

    static ensureCustomerSession(): boolean {
        var session = CustomerSession.getInstance();
        if (!session.active) {
            console.log('redirecting to init screen');
            var toStateParams = {};
            angular.copy($stateParams, toStateParams)
            $state.go('app.initSession', {
                toState: $state.current.name,
                toStateParams: toStateParams
            });
            return false;
        }
        return true;
    }

    public initData: CustomerSessionData;

    onMessage(msg: Message) {
        this.chatList.add(msg);
        super.onMessage(msg);
        $ionicScrollDelegate.scrollBottom(true);
    }

    start(initData: CustomerSessionData) {
        this.initData = angular.copy<CustomerSessionData>(initData);
        return super.start(this.initData);
    }

    cleanup() {
        super.cleanup();
        this.initData = CustomerSession.getDefaultInitData();
    }

    sendRequest(toBranch: Branch, request: RequestBase) {
        var accountInfo = this.initData.accounts[toBranch.type];

        var message = this.newMessage(accountInfo.uid, request.getRequestText(), {}, request.getMeta().title);
        message.contentType = 'customer-request';

        var custReq: CustomerRequest = {
            type: request.getType(),
            request: request,
            from: this.initData.tableId
        };

        message.content = request;
        return this.send(message);
    }

    static getRemoteInitData(input: CustomerTag): ng.IPromise<CustomerSessionData> {
        var defer = $q.defer<CustomerSessionData>();

        $timeout(() => {
            defer.resolve({
                tableId: '123',
                tableName: 'Masa K1-12',
                business: {
                    name: 'Günaydın Çayyolu',
                    description: 'Et Günaydında yenir',
                    headerImages: ['ddd']
                },
                msgServerUrl: 'http://xmpp.kalitte.com.tr:5280/http-bind/',
                xmppUser: {
                    uid: 'masa.cayyolu-gunaydin@localhost',
                    display: '',
                    pwd: '1'
                },
                inited: true,
                accounts: {
                    management: {
                        uid: 'yonetim.cayyolu-gunaydin@localhost',
                        display: 'Günaydın Çayyolu'
                    },

                    vale: {
                        uid: 'vale.cayyolu-gunaydin@localhost',
                        display: 'Günaydın Çayyolu Vale'
                    },

                    kitchen: {
                        uid: 'mutfak.cayyolu-gunaydin@localhost',
                        display: 'Günaydın Çayyolu Mutfak'
                    },

                    service: {
                        uid: 'garson-cumali.cayyolu-gunaydin@localhost',
                        display: 'Cumali Tezek (Garson)'
                    }
                }
            });
        }, 1000);
        return defer.promise;
    }

    private static CreateDefaultSession(): CustomerSession {
        var instance = new CustomerSession();
        instance.initData = CustomerSession.getDefaultInitData();
        return instance;
    }

    private static defaultSession = CustomerSession.CreateDefaultSession();

    public static getInstance(): CustomerSession {
        return CustomerSession.defaultSession;
    }

    public static getDefaultInitData(): CustomerSessionData {
        return {
            tableId: '',
            tableName: 'K1-Masa 12',
            business: {
                name: 'Hoşgeldiniz',
                description: '',
                headerImages: ['ddd']                
            },
            msgServerUrl: '',
            xmppUser: {
                uid: '',
                display: '',
                pwd: ''
            },
            inited: false,
            accounts: {
            }
        }
    }
}

