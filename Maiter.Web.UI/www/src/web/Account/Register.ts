/// <reference path="../../ref/sprintf/sprintf-js.d.ts" />

import {Kalitte} from '../../Kalitte/Data/Models';
import {$state, $timeout, AngularService} from '../../Kalitte/Vendor/AngularService';
import {BaseAccountController} from './Account';
import {Meta} from '../../Kalitte/Core/Meta';
import {Error, RemoteError} from '../../Kalitte/Core/Errors';


@Meta.Controller('RegisterController')
export class RegisterController extends BaseAccountController {

    model: Kalitte.RegisterModel;
    errorMessages: string[];
    scope: angular.IScope;



    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.account.register', {
            url: '/register',
            templateUrl: "src/web/Account/Register.html",
            controller: 'RegisterController',
            controllerAs: 'ctrl',
            data: { title: 'Kaydol' }
        })
            .state('app.account.emailconfirmed', {
            url: '/emailconfirmed',
            templateUrl: "src/web/Account/EmailConfirmed.html",
            controller: 'RegisterController',
            controllerAs: 'ctrl',
            data: { title: 'E-Mail Onaylandi' }
        })
    }

    initialize() {
        this.mock();
        return super.initialize();
    }

    constructor(scope: angular.IScope) {
        super(scope);
        this.scope = scope;
    }

    private mock() {
        this.model = <Kalitte.RegisterModel>{};
        this.model.Email = "wqlky@deneme.com";
        this.model.Name = "Volkan";
        this.model.Surname = "Akbayir";
        this.model.Password = "123456";
        this.model.PasswordRepeat = "123456";
    }


    authExternalProvider(provider: string) {
        this.service.loginExternal(provider, this);
    };


    authCompletedCB(fragment) {
        var self = this;
        this.getScope().$apply(() => {
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
                        self.errorMessages = (<RemoteError>err).errorMessages;
                    }
                });


        });
    }

    register(form: ng.IFormController) {
        this.errorMessages = [];
        this.service.register(this.model).then(() => {
            this.toast('Başarıyla Kaydoldunuz');
            $state.go('app.account.login');
        }).catch((resp: Error) => {

            if (resp instanceof RemoteError) {
                if ((<RemoteError>resp).isModelError)
                    this.errorMessages = resp.errorMessages;
                else
                    this.error('Kaydolma Sırasında Bir Hatayla Karşılaşıldı');
            } else {
                this.error('Kaydolma Sırasında Bir Hatayla Karşılaşıldı');
            }

        });
    }

}