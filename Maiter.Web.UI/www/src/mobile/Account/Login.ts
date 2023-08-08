/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {Meta} from '../../Kalitte/Core/Meta';
import {Account, ExternalAuthData} from '../../Kalitte/Data/AccountService';
import {$stateParams, $q, $log, $state, $localStorage} from '../../Kalitte/Vendor/AngularService';
import {Kalitte} from '../../Kalitte/Data/Models';
import {Translate} from '../../Kalitte/Vendor/TranslateService';
import {$cordovaFacebook} from '../../Kalitte/Vendor/CordovaService';
import {MobileAppConfig} from '../../Kalitte/Core/MobileApplication';

interface FacebookLoginResponse {
    session_key: boolean,
    accessToken: string,
    expiresIn: number,
    sig: string,
    secret: string,
    userId: number,
    email: string
}


@Meta.Controller('LoginController',
    {
        state:
        {
            params: { returnState: null, returnStateParams: null },
            name: 'app.login',
            url: '/login',
            MobileControllerAs: true,
            templateUrl: 'src/mobile/Account/Login.html',
            data: { title: 'Login' }
        }
    })

export class LoginController extends ControllerBase {
    model: Kalitte.Credential;
    message: string;
    service = Account;
    Auth = Account.principal;

    init() {
    }

    showNotify(msg) {
        return this.alert(msg);
    }


    constructor($scope?: angular.IScope) {
        super($scope);

        this.model = <Kalitte.Credential>{
            ID: "metin@kalitte.com.tr",
            Password: "1234qqqQ",
            UseRefreshTokens: true
        };
    }

    logOff() {
        Account.logOff();
    }

    login() {
        this.message = "";
        this.service.login(this.model).then((identity) => {
            if ($stateParams['redirectState'])
                $state.go($stateParams['returnState'], $stateParams['returnStateParams']);
                
        }, (err) => {
                this.toast(err.error_description);
            });
    }

    externalLogin(providerName: string) {
        $cordovaFacebook.login(["public_profile", "email"]).then((succ) => {
            $cordovaFacebook.api('me').then((userProfile) => {
                var authResp = <FacebookLoginResponse>succ.authResponse;

                var externalLoginData = <ExternalAuthData>{
                    externalAccessToken: authResp.accessToken,
                    provider: providerName,
                    userName: userProfile.email
                };

                Account.checkUserExits(userProfile.email).then((s) => {
                    if (s && s.data && s.data == true) {
                        Account.obtainAccessToken({
                            externalAccessToken: authResp.accessToken,
                            provider: providerName
                        }).then(() => {
                        });
                    } else {
                        var registerModel = <Kalitte.RegisterExternalBindingModel>{
                            ExternalAccessToken: externalLoginData.externalAccessToken,
                            Provider: externalLoginData.provider,
                            UserName: externalLoginData.userName,
                            Name: userProfile.first_name,
                            Surname: userProfile.last_name,

                        };
                        Account.registerExternal(registerModel).then(() => {
                        });
                    }
                });

            });

        }, (fail) => {
                debugger;
                this.alert('An error occurred when logging in');
            });
    }

}   