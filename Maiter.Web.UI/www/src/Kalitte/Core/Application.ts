/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/cordova/cordova.d.ts" />

import {ServiceMeta, FactoryMeta, ControllerMeta, FilterMeta, DirectiveMeta, MetaName, MetaRegistry} from './Meta';
import {ReflectHelper} from './ReflectHelper';
import {BaseService} from './BaseService';

export enum AppPlatform {
    Desktop,
    Mobile
}



export class IApplicationConfig {
    ApplicationName: string;
    ApplicationTitle: string;
    ServiceConfig: { [id: string]: any }
    PublicClientId: string;
    ShortLivedClientId: string;
    AuthStorageKey: string;
    PrincipalStorageKey: string;
    RunningMode: string;
}

export var App: Application<IApplicationConfig>;

export class Application<T extends IApplicationConfig>  {

    FilterNS = "Maiter.Filters";
    ControllerNS = "Maiter.Controllers";
    ServiceNS = "Maiter.Services";
    DirectiveNS = "Maiter.Directives";
    Platform: AppPlatform;

    private bootDefer: ng.IDeferred<any>;// = this.$q.defer<any>();
    Ready: ng.IPromise<any>;

    AngularApp: angular.IModule;
    IsReady: boolean = false;


    getDependentModules() {
        return [];
    }

    Alert(content: string, title?: string): ng.IPromise<any> {
        return null;
    }

    Toast(msg: string, delay?: number): ng.IPromise<any> {
        return null;
    }

    Busy(msg: string, promise?: ng.IPromise<any>, delay?: number) {

    }


    Confirm(content: string, title?: string): ng.IPromise<any> {
        return null;
    }

    private initFilters() {
        var angModule = angular.module(this.FilterNS, []);
        MetaRegistry.Filters.GetItems().forEach((item) => {
            var meta = ReflectHelper.getMeta<FilterMeta>(MetaName.Filter, item.Value);
            angModule.filter(item.Key, meta.factory);
        });
    }

    private initDirectives() {
        var angModule = angular.module(this.DirectiveNS, []);

        MetaRegistry.Directives.GetItems().forEach((item) => {
            var meta = ReflectHelper.getMeta<DirectiveMeta>(MetaName.Directive, item.Value);
            angModule.directive(item.Key, <ng.IDirectiveFactory> meta.factory);
        });
    }

    private initControllers() {
        var angModule = angular.module(this.ControllerNS, []);

        MetaRegistry.Controllers.GetItems().forEach((item) => {
            var meta = ReflectHelper.getMeta<ControllerMeta>(MetaName.Controller, item.Value);
            angModule.controller(item.Key, meta.factory);
        });
    }

    private initServices() {
        var angModule = angular.module(this.ServiceNS, []);

        MetaRegistry.Services.GetItems().forEach((item) => {
            var meta = ReflectHelper.getMeta<ServiceMeta>(MetaName.Service, item.Value);
            angModule.service(item.Key, meta.factory)
        });

        MetaRegistry.Factories.GetItems().map((item) => {
            var meta = ReflectHelper.getMeta<FactoryMeta>(MetaName.Factory, item.Value);
            angModule.factory(item.Key, meta.factory);
            return item.Key;
        });
    }

    constructor(public Config: T) {

        App = this;

        this.initServices();
        this.initDirectives();
        this.initFilters();
        this.initControllers();

        this.AngularApp = angular.module(Config.ApplicationName, this.getDependentModules());

        MetaRegistry.Controllers.GetItems().forEach((item) => {
            item.Value.Configure.apply(item.Value, [item.Value, this.AngularApp]);
        });

        MetaRegistry.Services.GetItems().map((item) => {
            var meta = ReflectHelper.getMeta<ServiceMeta>(MetaName.Service, item.Value);
            item.Value.Configure.apply(item.Value, [item.Value, this.AngularApp, Config.ServiceConfig[meta.name]]);
        });

        MetaRegistry.Factories.GetItems().map((item) => {
            item.Value.Configure.apply(item.Value, [item.Value, this.AngularApp]);
        });
    }

    Boot() {


        var self = this;

        var $q: ng.IQService = angular.injector(['ng']).get('$q');

        this.bootDefer = $q.defer<any>();
        this.Ready = this.bootDefer.promise;

        this.AngularApp.run(() => {
            var promiseList = new Array<ng.IPromise<any>>();
            var resolveList: { [id: string]: ng.IPromise<any> } = {};

            var services = BaseService.RegisteredInstances.forEach((service) => {
                for (var key in service.Resolve) {
                    resolveList[key] = service.Resolve[key];
                }
            });
            


            var defer = this.bootDefer;
            $q.all(resolveList).then((items) => {
                self.IsReady = true;
                defer.resolve(self);
            }, (errors) => {
                    console.log(errors);
                    defer.reject(errors);
                });
        });

        var onDeviceReady = () => {
            angular.bootstrap(document, [this.Config.ApplicationName]);
        }

        if (window.cordova)
            document.addEventListener('deviceready', onDeviceReady, false);
        else angular.element(document).ready(function () {
            onDeviceReady();
        });

        return this.Ready;
    }
}

