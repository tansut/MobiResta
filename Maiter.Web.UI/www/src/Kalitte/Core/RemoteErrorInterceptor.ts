/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../ref/angular-local-storage/angularLocalStorage.d.ts" />

import {AccountService} from '../Data/AccountService';
import {$q, $localStorage, $state, $rootScope, AngularService} from '../Vendor/AngularService';
import {AuthData} from '../Data/AccountService';
import {Meta} from '../Core/Meta';
import {RemoteError} from '../Core/Errors';
import {BaseFactory} from '../Core/BaseFactory';

@Meta.Factory('RemoteErrorInterceptor')
export class RemoteErrorInterceptor extends BaseFactory {

    static Configure(factory, app: ng.IModule) {
        
        app.config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('RemoteErrorInterceptor');
        }]);

        BaseFactory.Configure(factory, app);
    }

    responseError(rejection: any) {
        var remoteError = <ng.IHttpPromiseCallbackArg<any>>rejection;
        return $q.reject(new RemoteError(remoteError));
    }

    static $Factory(): RemoteErrorInterceptor {
        return new RemoteErrorInterceptor();
    }
}