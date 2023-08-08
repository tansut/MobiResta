import {RemoteService} from './RemoteService';
import {$q, $timeout, $rootScope} from '../AngularService';
import {Security} from '../../lib/Models';
import {Principal, UserPrincipal, AnonymousPrincipal} from '../../lib/Security';

export var Account: AccountService;

export class AccountService extends RemoteService {

    principal: Principal<Security.Identity>;

    logOff() {
        return new $q((resolve) => {
            $timeout(() => {
                this.principal = new AnonymousPrincipal();
                resolve();
                $rootScope.$broadcast('UserLoggedOff', this.principal);
            }, 500)
        })
    }

    login(login: Security.Credential): angular.IPromise<Principal<Security.Identity>> {
        return new $q((resolve: angular.IQResolveReject<Principal<Security.Identity>>) => {
            this.$http().post<Security.LoginResult<Security.Identity>>(this.url('account/login'), login).then((result) => {
                var principal = new UserPrincipal(result.data.Identity, result.data.Roles);
                this.principal = principal;
                resolve(principal);
                $rootScope.$broadcast('UserLoggedIn', this.principal);
            }, (err) => {
                    debugger;
                });
        })
    }

    //companyLogin(login: Security.ServiceUserCredential): angular.IPromise<Principal<Security.ServiceUserIdentity>> {
    //    return new $q((resolve: angular.IQResolveReject<Principal<Security.ServiceUserIdentity>>) => {
    //        this.$http().post<Security.LoginResult<Security.ServiceUserIdentity>>('api/service/login', login).then((result) => {
    //            var principal = new ServiceUserPrincipal(result.data.Identity, result.data.Roles);
    //            this.principal = principal;
    //            resolve(principal);
    //            $rootScope.$broadcast('UserLoggedIn', this.principal);
    //        }, (err) => {
    //            debugger;
    //        });

    //        //$timeout(() => {
    //        //    var principal = new CompanyPrincipal({
    //        //        name: 'Tansu',
    //        //        companyId: '12',
    //        //        companyName: ''
    //        //    }, ['']);
    //        //    this.principal = principal;
    //        //    resolve(principal);
    //        //    $rootScope.$broadcast('UserLoggedIn', this.principal);
    //        //}, 500);
    //    })
    //}

    constructor() {
        super();
        Account = this;
        this.principal = new AnonymousPrincipal();
    }
}