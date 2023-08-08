/// <reference path="../../ref/angularjs/angular.d.ts" />

import {Meta} from '../Core/Meta';
import {BaseService, ServiceConfiguration} from '../Core/BaseService';
import {$localStorage, $rootScope, $q} from './AngularService';

export var SignalRHub: SignalRHubService;

interface SignalRHubConfiguration extends ServiceConfiguration {
    Server: string;
    Hub: string;
}


@Meta.Service('SignalRHubService')
export class SignalRHubService extends BaseService {

    static Configuration: SignalRHubConfiguration;

    static InstanceReady(instance) {
        SignalRHub = instance;
    }

    static Configure(factory, app, config: SignalRHubConfiguration) {
        SignalRHubService.Configuration = config;
        BaseService.Configure(factory, app, config);
    }

    static $inject = [];

    private hub: any;
    private connection: any;

    on (eventName, callback) {
        this.hub.on(eventName, function (result) {
            $rootScope.$apply(function () {
                if (callback) {
                    callback(result);
                }
            });
        });
    }

    off (eventName, callback) {
        this.hub.off(eventName, function (result) {
            $rootScope.$apply(function () {
                if (callback) {
                    callback(result);
                }
            });
        });
    }

    invoke(methodName, parameters, callback) {
        this.hub.invoke(methodName, parameters)
            .done(function (result) {
                $rootScope.$apply(function () {
                    if (callback) {
                        callback(result);
                    }
                });
            });
    }

    init() {
        this.connection = $['hubConnection'](SignalRHubService.Configuration.Server);
        this.hub = this.connection.createHubProxy(SignalRHubService.Configuration.Hub);

        this.on('*', (message) => {
            
        });

        return new $q((resolve, reject) => {
            this.connection.start().done(() => {
                resolve();
            });
        });
    }

    constructor() {
        super();
        
        this.Resolve['SignalRHubService:Start'] = this.init();
    }
}