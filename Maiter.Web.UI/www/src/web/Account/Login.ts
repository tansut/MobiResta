/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Kalitte} from '../../Kalitte/Data/Models'
import {BaseAccountController} from './Account';

import {$state, $timeout, AngularService, $q} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';
import {RemoteError} from '../../Kalitte/Core/Errors';

interface ForgotPasswordModel {
    email: string
}

interface ErrorMessage {
    message: string
}

@Meta.Controller('LoginController')
export class LoginController extends BaseAccountController implements ErrorMessage {
    model: Kalitte.Credential;
    scope: angular.IScope;
    message: string;

    forgotPasswordModel: ForgotPasswordModel;
    forgotPasswordSent: boolean;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.account.login', {
            url: '/login',
            controller: 'LoginController',
            controllerAs: 'ctrl',
            templateUrl: 'src/web/Account/Login.html',
            data: { title: 'Sistem Girişi' }
        }).state('app.account.resetpassword', {
            url: '/forgotpassword',
            templateUrl: "src/web/Account/ForgotPassword.html",
            controller: 'LoginController',
            controllerAs: 'ctrl',
            data: { title: 'Sifremi Unuttum' }
        })
    }

    loginAsCustomer() {
        this.message = "";
        this.service.login(this.model).then((identity) => {
            $state.go('app.home');
        }, (err) => {
                if (err instanceof RemoteError)
                    this.message = (<RemoteError>err).errorMessages.pop();
            });
    }

    authExternalProvider(provider: string) {
        this.service.loginExternal(provider, this);
    };

    authCompletedCB(fragment) {
        var self = this;
        this.scope.$apply(() => {
            var externalAuthData = {
                provider: fragment.provider,
                userName: fragment.email,
                externalAccessToken: fragment.external_access_token
            };

            this.service.obtainAccessToken(externalAuthData).then(function (response) {
                $state.go('app.home');
            },
                function (err) {
                    if (err instanceof RemoteError) {
                        self.message = (<RemoteError>err).errorMessages.pop();
                    }
                });


        });
    }


    forgotPasswordSubmit() {
        debugger;
        this.errorHandled(this.service.forgotPassword(this.forgotPasswordModel.email).then((resp) => {
            this.forgotPasswordSent = true;
        }));
    }

    initialize() {
        this.model = {
            UseRefreshTokens: true,
            ID: 'wqlky@hotmail.com',
            Password: '123456'
        };

        this.forgotPasswordModel = <ForgotPasswordModel>{};
        this.forgotPasswordSent = false;
        return super.initialize()
    }


    constructor($scope: angular.IScope) {
        super($scope);
        this.scope = $scope;


    }
}

