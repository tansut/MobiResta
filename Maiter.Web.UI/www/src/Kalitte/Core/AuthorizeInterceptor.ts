/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../ref/angular-local-storage/angularLocalStorage.d.ts" />

import {Account, AuthData} from '../Data/AccountService';
import {$q, $localStorage, $state, $rootScope, AngularService, $http} from '../Vendor/AngularService';
import {Meta} from '../Core/Meta';
import {AuthorizationError} from '../Core/Errors';
import {BaseFactory} from '../Core/BaseFactory';
import {App} from '../Core/Application';

@Meta.Factory('AuthorizeInterceptor')
export class AuthorizeInterceptor extends BaseFactory {

    static Configure(factory, app: ng.IModule) {

        app.config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('AuthorizeInterceptor');
        }]);

        BaseFactory.Configure(factory, app);
    }

    request(config: any) {
        config.headers = config.headers || {};

        var authData = $localStorage.get<AuthData>(App.Config.AuthStorageKey);
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.access_token;
        }
        return config;
    }

    responseError(rejection: angular.IHttpPromiseCallbackArg<any>) {
        if (rejection.status !== 401)
            return $q.reject(rejection);// 401 dışı durumda handle edecek kod burası değil.

        var authData = $localStorage.get<AuthData>(App.Config.AuthStorageKey);
        if (!authData)
            return $q.reject(rejection); // giriş yapmamışsa (access veya refresh token yoksa) reject

        if (rejection.config.headers.authRetry) // auth token bir 401'den sonra yenilenmesinin ardından ikinci kez
            return $q.reject(rejection);  // yapılan isteğin de 401 döndürmesi sonucu reject

        var expTime = new Date(authData[".expires"]).getTime();
        var now = new Date().getTime();


        if (expTime > now)
            return $q.reject(rejection); // token henüz dolmadan authorize hatası almış.

        // access token var ama süresi dolmuş
        var deferred = $q.defer();
        Account.refreshAccessToken().then(() => {
            //refresh token ile access token alındı.
            rejection.config.headers.authRetry = true; // ilk isteğin tekrar bir istek olduğunu belirten header
            $http(rejection.config).then((result: any) => {
                deferred.resolve(result); // ilk istek tekrar edildi ve başarıyla cevap aldı.
            },
                (err) => {
                    deferred.reject(err); // ilk istek tekrar edildi ve başarısız cevap aldı.
                });

        }, (err) => {
            // refresh token ile access token alınamadı
            $localStorage.remove(App.Config.AuthStorageKey); // eldeki token komple öldüğü için siliyoruz.
            deferred.reject(err);
        });
        return deferred.promise; // promise bitene kadar bekleyecek.

    }

    static $Factory(): AuthorizeInterceptor {
        return new AuthorizeInterceptor();
    }
}