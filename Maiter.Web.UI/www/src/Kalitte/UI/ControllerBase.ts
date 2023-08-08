/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {$state, $window, $timeout, $rootScope, $q} from '../Vendor/AngularService';
import {ReflectHelper} from '../Core/ReflectHelper';
import {Meta, MetaName, ControllerMeta} from '../Core/Meta';
import {StateInfo} from '../Core/UIState';
import {RemoteError} from '../Core/Errors';
import {App, AppPlatform} from '../Core/Application';

export class ControllerBase {
    static $inject = ['$scope'];

    public static ConfigureStates(provider: ng.ui.IStateProvider, urlProvider: ng.ui.IUrlRouterProvider);
    public static ConfigureStates(provider: ng.ui.IStateProvider) {
    }

    public static Configure(factory, app: ng.IModule) {
        (function (meta: ControllerMeta, self: typeof ControllerBase) {
            app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
                var stateInfo: StateInfo = (meta.config && meta.config.state) ?
                    meta.config.state : null;
                if (stateInfo) {
                    $stateProvider.state(stateInfo);
                    delete meta.config.state;
                }
                self.ConfigureStates($stateProvider, $urlRouterProvider);
            }]);
        })(ReflectHelper.getMeta<ControllerMeta>(MetaName.Controller, this), this);
    }

    $state = $state;
    $window = $window;
    rootScopeListeners: { [id: string]: Function } = {};
    $Ready: boolean = false;
    ReadyDefer: ng.IDeferred<any>;
    Ready: ng.IPromise<any>;
    $Dirty: boolean = false;
    IsDirectiveController = false;
    getScope(): ng.IScope {
        return this.$scope;
    }

    getParent<T>(): T {
        return this.getScope().$parent['ctrl'];
    }

    historyBack() {
        this.$window.history.back();
        
    }

    getService(name: string) {
        var injector = angular.element(document).injector();
        return injector.get(name);
    }

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

    handleError(err) {
        var userMessage = "Bilinmeyen hata oluştu";

        if (err instanceof RemoteError) {
            var remoteError = <RemoteError>err;
            var errorMessages = "";
            if (remoteError.errorMessages.length > 1) {
                remoteError.errorMessages.forEach((c) => this.alert(errorMessages)); // toaster'ın düzgün çalışması lazım
                this.alert(errorMessages);
            }
            else {
                this.alert(remoteError.errorMessages.pop());
            }

        } else {
            if (angular.isString(err))
                userMessage = err;
            else if (err.message)
                userMessage = err.message;
            this.alert(userMessage);

        }
    }

    showLoading(msg, promise) {
        App.Busy(msg, promise);
    }


    alert(content: string, title?: string) {
        return App.Toast(content);
    }

    error(content: string, title?: string) {
        this.alert(content, title || 'İşlem sırasında bir hata oluştu');
    }

    toast(msg: string, delay?: number) {
        return App.Toast(msg, delay);
    }


    confirm(content: string, title?: string): ng.IPromise<any> {
        return App.Confirm(content, title);
    }

    beforeEnter() {
        this.hardInit();
        this.initialize();
    }

    initialize() {
        this.ReadyDefer.resolve();
        //return this.Ready;
    }

    hardInit() {
        this.$Ready = false;
        this.ReadyDefer = $q.defer<any>();
        this.Ready = this.ReadyDefer.promise;

        this.Ready.then(() => {
            this.$Ready = true;
        });
    }

    errorHandled(promise: angular.IPromise<any>) {
        promise.catch((err) => {
            this.handleError(err)
        });

        return promise;
    }

    constructor(public $scope?: angular.IScope) {
        this.$state = $state;
        if (!$scope)
            console.log('Scope is not available to controller ' + this.constructor['name'] + '. $scope.$on may not work as expected.');
        else {
            this.$scope = $scope;
            var self = this;

            this.$scope.$on('$destroy', () => {
                for (var evt in self.rootScopeListeners)
                    this.rootScopeListeners[evt]();
            });

        }

        this.hardInit();
        if (App.Platform == AppPlatform.Desktop || this.IsDirectiveController)
            $timeout(() => {
                this.initialize();
            })
        else {
            this.$scope.$on('$ionicView.beforeEnter', () => {
                this.beforeEnter();
            });
        }
    }
}