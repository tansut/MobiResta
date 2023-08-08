/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/signalr/signalr.d.ts" />

import {Meta} from '../Core/Meta';
import {BaseService, ServiceConfiguration} from '../Core/BaseService';
import {$localStorage, $rootScope, $q} from './AngularService';
import {RemoteService} from '../Data/RemoteService';
import {App} from '../Core/Application';
import {Account, AuthData} from '../Data/AccountService';


export var SignalRConnection: SignalRConnectionService;

interface SignalRConnectionConfiguration extends ServiceConfiguration {
    Path: string;
}

@Meta.Service('SignalRConnectionService')
export class SignalRConnectionService extends BaseService {

    static Configuration: SignalRConnectionConfiguration;

    static InstanceReady(instance) {
        SignalRConnection = instance;
    }

    static Configure(factory, app, config: SignalRConnectionConfiguration) {
        SignalRConnectionService.Configuration = config;
        BaseService.Configure(factory, app, config);
    }

    static $inject = [];
    tryingToReconnect = false;

    private connection: SignalR;
    private headers: { [id: string]: any };
    private authorizeTryCount = 0;

    Send(data: any) {
        this.connection.send(data);
    }

    IsTrying() {
        var conn = this.connection;
        return conn != null && conn.state == $.signalR.connectionState.reconnecting;
    }

    IsActive() {
        var conn = this.connection;
        return conn != null && conn.state == $.signalR.connectionState.connected;
    }

    Disconnect(notifiy: boolean = true) {
        return new $q((resolve, reject) => {
            if (this.connection) {
                this.connection.stop(false, notifiy);
            }
            resolve();
        });
    }

    SetNewHeaders(headers: { [id: string]: any }) {
        if (this.connection)
            this.connection.qs = angular.copy(headers);
    }

    createConnection(headers: { [id: string]: any }) {

        var connection = $.connection(RemoteService.Host.Protocol + '://' + RemoteService.Host.Host + ':' + RemoteService.Host.Port + SignalRConnectionService.Configuration.Path);
        connection.qs = angular.copy(headers);

        connection.error((error) => {
            if (error['context'] && error['context']['status']) {
                var remoteStatus = error['context']['status'];
                if (remoteStatus == 401 || remoteStatus == 403) {
                    if (this.authorizeTryCount > 0) {
                        this.Disconnect(false);
                    } else {
                        this.authorizeTryCount++;
                        Account.refreshAccessToken().then(() => {
                            this.authorizeTryCount = 0;
                        }, (err) => {
                            this.Disconnect();
                        });
                    }
                }
            }
        });

        connection.reconnecting(() => {

            var doIt = () => {
                console.log('SignalR trying to reconnect...');
                this.tryingToReconnect = true;
            }

            $rootScope.$$phase ? doIt.apply(this) : $rootScope.$apply(doIt.bind(this));
        });

        connection.reconnected(() => {

            var doIt = () => {
                console.log('SignalR restored the connection.');
                this.tryingToReconnect = false;
                this.authorizeTryCount = 0;
            }

            $rootScope.$$phase ? doIt.apply(this) : $rootScope.$apply(doIt.bind(this));
        });

        connection.disconnected(() => {

            var doIt = () => {
                this.connection = null;
                if (this.tryingToReconnect) {
                    this.tryingToReconnect = false;
                    $rootScope.$broadcast('SignalRConnection:DisconnectedAbnormally');
                    console.log('SignalR disconnected abnormally.');
                }
            }

            $rootScope.$$phase ? doIt.apply(this) : $rootScope.$apply(doIt.bind(this));


        })

        connection.received((data) => {
            var doIt = () => {
                if (angular.isString(data))
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                    }
                $rootScope.$broadcast('SignalRConnection:Received', data);
                if (typeof data.MessageType != 'undefined')
                    $rootScope.$broadcast('SignalRConnection:Received:' + data.MessageType, data.MessageContent);
            }
            $rootScope.$$phase ? doIt.apply(this) : $rootScope.$apply(doIt.bind(this));
        })

        return connection;
    }

    Connect(headers: { [id: string]: any }) {
        if (this.connection)
            throw new Error('Disconnect first.');

        var connection = this.connection = this.createConnection(headers);

        return new $q((resolve, reject) => {

            connection.start({
                //pingInterval: 5000
            }).done(() => {
                this.authorizeTryCount = 0;
                $rootScope.$apply(() => {
                    resolve();
                });
            }).fail((err) => {
                $rootScope.$apply(() => {
                    this.connection = undefined;
                    console.log('SignalR failed');
                    reject(err);
                });
            });
        });
    }

    constructor() {
        super();
    }
}