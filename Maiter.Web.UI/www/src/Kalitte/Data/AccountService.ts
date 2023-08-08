
import {RemoteService, Remote} from './RemoteService';
import {$q, $timeout, $rootScope, $localStorage, AngularService, $state} from '../Vendor/AngularService';
import {Kalitte} from './Models';
import {ViewModels} from '../../Data/Models';
import {Principal, UserPrincipal, AnonymousPrincipal} from '../Core/Principal';
import {Meta} from '../Core/Meta';
import {App} from '../Core/Application';


export var Account: AccountService;

export interface ExternalAuthData {
    provider: string;
    userName?: string;
    externalAccessToken: string;
}

export interface AuthData {
    access_token: string,
    userName: string,
    refresh_token?: string,
    useRefreshTokens: boolean,
    ".expires": number
}

@Meta.Service('AccountService')
export class AccountService extends RemoteService {

    static InstanceReady(instance) {
        Account = instance;
    }


    static ServiceFoo() {
    }

    principal: Principal<Kalitte.Identity>;

    logOff() {
        return new $q((resolve) => {
            $timeout(() => {
                this.principal = new AnonymousPrincipal();
                $localStorage.remove(App.Config.AuthStorageKey);
                $rootScope.$broadcast('UserLoggedOff', this.principal);
                resolve();
            })
        })
    }

    login(login: Kalitte.Credential): angular.IPromise<Principal<Kalitte.Identity>> {
        return new $q((resolve: angular.IQResolveReject<Principal<Kalitte.Identity>>, reject: ng.IQResolveReject<any>) => {

            var data = "grant_type=password&username=" + login.ID + "&password=" + login.Password + "&client_id=";

            if (login.UseRefreshTokens) {
                data = data + App.Config.PublicClientId;
            } else {
                data = data + App.Config.ShortLivedClientId;
            }

            var headerConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
            this.$http().post<AuthData>(this.url('token'), data, headerConfig).then((result) => {
                result.data.useRefreshTokens = login.UseRefreshTokens;

                // kotu bir hack mobilde stringden datee ceviremiyor o yuzden int parse ettim
                result.data['.expires'] = new Date(result.data['.expires'].toString()).getTime();
                $localStorage.set(App.Config.AuthStorageKey, result.data);
                this.$http().post<Kalitte.LoginResult<Kalitte.Identity>>(this.url('account/login'), {}).then((resp) => {
                    $localStorage.set(App.Config.PrincipalStorageKey, resp.data);
                    this.principal = new UserPrincipal(resp.data.Identity, resp.data.Roles, resp.data.UserData);
                    $rootScope.$broadcast("UserLoggedIn", this.principal);
                    resolve(this.principal);
                });

            }, (err) => {
                reject(err);
            })
        });
    }

    loginExternal(providerName: string, callerController) {
        var redirectUri = location.protocol + '//' + location.host + '/www/src/web/account/authcomplete.html';

        var externalProviderUrl = this.url('Account/ExternalLogin', {
            provider: providerName,
            response_type: 'token',
            client_id: 'theClientId',
            redirect_uri: redirectUri
        });
        window['$windowScope'] = callerController;
        var oauthWindow = window.open(externalProviderUrl, 'Kullanici Girisi', "location=0,status=0,width=600,height=750");
    }

    register(registration: Kalitte.RegisterModel): angular.IPromise<void> {
        return new $q((resolve: angular.IQResolveReject<void>, reject: ng.IQResolveReject<any>) => {
            this.$http().post<void>(this.url('account/register'), registration).then(() => {
                resolve();
            }, (err) => {
                reject(err);
            });
        });
    }


    private localAccessTokenResponse(response: Kalitte.LocalAccessTokenResponse, deferred?: ng.IDeferred<any>) {
        var authData = <AuthData>{
            access_token: response.AccessToken,
            userName: response.UserName,
            refresh_token: response.Refresh_Token,
            useRefreshTokens: true,

            // mobilde stringden date ceviremiyor o yuzden int parse ettim
            ".expires": parseInt(response.Expires)
        };
        $localStorage.set(App.Config.AuthStorageKey, authData);

        this.$http().post<Kalitte.LoginResult<Kalitte.Identity>>(this.url('account/login'), {}).then((resp) => {
            $localStorage.set(App.Config.PrincipalStorageKey, resp.data);
            var principal = this.principal = new UserPrincipal(resp.data.Identity, resp.data.Roles, resp.data.UserData);
            $rootScope.$broadcast("UserLoggedIn", this.principal);

            if (deferred)
                deferred.resolve(response);
        });
    }

    obtainAccessToken(externalData: ExternalAuthData) {

        var deferred = $q.defer();

        this.$http().get(this.url('account/ObtainLocalAccessToken'), {
            params: {
                provider: externalData.provider,
                externalAccessToken: externalData.externalAccessToken,
                clientId: App.Config.PublicClientId
            }
        }).success((response: Kalitte.LocalAccessTokenResponse) => {
            this.localAccessTokenResponse(response, deferred);
        }).error((err, status) => {
            this.logOff();
            deferred.reject(err);
        });

        return deferred.promise;

    }

    registerExternal(registerExternalData: Kalitte.RegisterExternalBindingModel) {
        var deferred = $q.defer();
        registerExternalData.ClientId = App.Config.PublicClientId;
        this.$http().post(this.url('account/registerexternal'), registerExternalData).success((response: Kalitte.LocalAccessTokenResponse) => {
            this.localAccessTokenResponse(response, deferred);
        }).error((err, status) => {
            this.logOff();
            deferred.reject(err);
        });

        return deferred.promise;
    };

    checkUserExits(mail: string): any {
        var deferred = $q.defer();
        this.$http().get(this.url('account/userexists', { email: mail })).then((userExits) => {
            deferred.resolve(userExits);
        }, (err) => { deferred.reject(err); });
        return deferred.promise;
    };

    refreshAccessToken(): ng.IPromise<any> {
        var deferred = $q.defer();
        var authData = $localStorage.get<AuthData>(App.Config.AuthStorageKey);
        if (!authData)
            deferred.reject();
        else {
            var data = "grant_type=refresh_token&refresh_token=" + authData.refresh_token + "&client_Id=";
            if (authData.useRefreshTokens)
                data += App.Config.PublicClientId;
            else
                data += App.Config.ShortLivedClientId;
            var headerConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authRefreshTokenUsage': true } };

            this.$http().post<AuthData>(this.url('token'), data, headerConfig).then((result) => {
                result.data.useRefreshTokens = authData.useRefreshTokens;
                $localStorage.set(App.Config.AuthStorageKey, result.data);
                var tokenUpdateEvent = {};
                $rootScope.$broadcast('Authentication:AccessTokenUpdated', tokenUpdateEvent);
                if (tokenUpdateEvent['promise']) {
                    var promise = <ng.IPromise<any>>tokenUpdateEvent['promise'];
                    promise.then(() => deferred.resolve(result), (err) => {
                    this.logOff().finally(() => deferred.reject(err));
                        deferred.reject(err)
                    });
                } else deferred.resolve(result);
            }, (err) => {
                this.logOff();
                deferred.reject(err);
            });
        }

        return deferred.promise;
    }

    CreatePrincipalFromLs(): ng.IPromise<any> {
        var deferred = $q.defer<any>();

        Remote.Ready().then(() => {
            var authData = $localStorage.get<AuthData>(App.Config.AuthStorageKey);
            if (!authData) {
                this.principal = new AnonymousPrincipal();
                deferred.resolve(this.principal);
            }
            else {
                var data = $localStorage.get<Kalitte.LoginResult<Kalitte.Identity>>(App.Config.PrincipalStorageKey);
                if (data && authData[".expires"] > new Date().getTime()) {
                    this.principal = new UserPrincipal(data.Identity, data.Roles, data.UserData);
                    $rootScope.$broadcast("UserLoggedIn", this.principal);
                    deferred.resolve(this.principal);
                }
                else {
                    this.refreshAccessToken().then((authData: AuthData) => {
                        this.$http().post<Kalitte.LoginResult<Kalitte.Identity>>(this.url('account/login'), {}).then((resp) => {
                            this.principal = new UserPrincipal(resp.data.Identity, resp.data.Roles, resp.data.UserData);
                            $rootScope.$broadcast("UserLoggedIn", this.principal);
                            deferred.resolve(this.principal);
                        }, (err) => {
                            this.logOff().finally(() => {
                                this.principal = new AnonymousPrincipal();
                                deferred.resolve(this.principal);
                            });
                        });
                    }, (err) => {
                        this.principal = new AnonymousPrincipal();
                        deferred.resolve(this.principal);
                    });
                }
            }
        }
            );

        return deferred.promise;
    }


    forgotPassword(email: string) {
        return this.$http().post<void>(this.url('account/forgotpassword'), { Email: email }).then((resp) => {

        });
    }

    getUserProfile() {
      
        return this.$http().get<ViewModels.Account.UserProfile>(this.url('account/getuserprofile'));
    }

    updateAccount(userModel: ViewModels.Account.UserProfile) {
        return this.$http().post<void>(this.url('account/updateAccount'), { email: userModel.Email, name: userModel.Name, surname: userModel.Surname, birthDate: userModel.BirthDate, Gender: userModel.Gender, Phone: userModel.Phone }).then((resp) => {

        });
    }

    constructor() {
        super();
        this.Resolve["Authentication:Resolve"] = this.CreatePrincipalFromLs();
    }
}
