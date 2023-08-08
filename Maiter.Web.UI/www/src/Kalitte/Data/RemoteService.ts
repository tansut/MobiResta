/// <reference path="../../ref/angularjs/angular.d.ts" />

import {$q, $http, $rootScope, $timeout, AngularService} from '../Vendor/AngularService';
import {Kalitte} from './Models';
import {Meta} from '../Core/Meta';
import {BaseService, ServiceConfiguration} from '../Core/BaseService';
import {IApplicationConfig, App} from '../Core/Application';

export interface IHostConfiguration {
    Protocol: string;
    Host: string;
    Port: number;
    App: string;
}

export class HostConfiguration implements IHostConfiguration {
    Protocol: string;
    Host: string;
    Port: number;
    App: string;

    Url() {
        return this.Protocol + "://" + this.Host + (this.Port != 80 ? ":" + this.Port.toString() : "");
    }

    constructor(source: IHostConfiguration) {
        angular.extend(this, source);
    }
}

interface IRemoteServiceConfiguration extends ServiceConfiguration {
    Host?: HostConfiguration;
}


export var Remote: RemoteService;

@Meta.Service('RemoteService')
export class RemoteService extends BaseService {
    RemoteController = '';

    $http() {
        return $http;
    }

    Entity<T extends Kalitte.EntityBase>(remoteController: string): EntityService<T> {
        return new EntityService<T>(remoteController);
    }

    static InstanceReady(instance) {
        Remote = instance;
    }

    static Configuration: IRemoteServiceConfiguration;
    static Host: HostConfiguration;

    static Configure(factory, app: ng.IModule, config: IRemoteServiceConfiguration) {
        if (factory === RemoteService) {
            app.config(['$httpProvider', function ($httpProvider: ng.IHttpProvider) {
                //$httpProvider.defaults['paramSerializer'] = "$httpParamSerializerJQLike";                
            }]);
            RemoteService.Configuration = config;
            app.run(["RemoteService", (instance) => {
                instance.Resolve['RemoteService:Configure'] = RemoteService.loadConfigurationData(this);
            }]);
        }
        BaseService.Configure(factory, app);
    }

    static loadConfigurationData(instance) {
        return $http.get(RemoteService.Configuration.ConfigFile, { responseType: 'json' }).then((result) => {
            var config = result.data[App.Config.RunningMode];
            var configObj = new HostConfiguration(config);
            RemoteService.Host = configObj;
        });
    }


    url(postfix: string, args: Object = {}) {
        var url = RemoteService.Host.Protocol + "://" + RemoteService.Host.Host + (RemoteService.Host.Port != 80 ? ":" + RemoteService.Host.Port.toString() : "") + RemoteService.Host.App + (RemoteService.Host.App ? "/" : "") + (this.RemoteController ? this.RemoteController + '/' : '') + postfix;
        var argsAdded = false;
        for (var key in args) {
            if (!argsAdded)
                url = url + '?';
            url = url.concat(key + '=' + encodeURI(args[key]) + '&');
            argsAdded = true;
        }
        if (argsAdded)
            url = url.substring(0, url.length - 1);
        return url;
    }

    constructor() {
        super();
    }
}


export class EntityService<T extends Kalitte.EntityBase> extends RemoteService {
    constructor(entityName: string) {
        super();
        this.RemoteController = entityName;
    }

    Id(id: string, options: { [id: string]: any } = null): angular.IPromise<T> {
        if (options)
            return this.$http().post<T>(this.url('id/' + id), options).then((result) => result.data);
        else return this.$http().get<T>(this.url('id/' + id)).then((result) => result.data);
    }

    Call<T>(method: string, params: Object = {}, postData: Object = null) {
        if (postData) {
            return this.$http().post<T>(this.url(method, params), postData).then((result) => result.data);
        }
        else return this.$http().get<T>(this.url(method, params)).then((result) => result.data);
    }


    Create(entity: T): angular.IPromise<Kalitte.CreatedResponse> {
        return this.$http().post<Kalitte.CreatedResponse>(this.url('create'), entity).then((result) => result.data);
    }

    Update(entity: T): angular.IPromise<Kalitte.CreatedResponse> {
        return this.$http().put<any>(this.url('update/' + entity.Id), entity).then((result) => result.data);
    }

    Save(entity: T): angular.IPromise<Kalitte.CreatedResponse | any> {
        return entity.Id ?
            this.Update(entity) : this.Create(entity)
    }

    del(id: string): angular.IPromise<void> {
        return this.$http().delete<void>(this.url('remove/' + id)).then((result) => { });
    }
}