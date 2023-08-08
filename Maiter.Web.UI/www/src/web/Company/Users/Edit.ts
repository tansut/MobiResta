/// <reference path="../../../ref/lodash/lodash.d.ts" />


import {EntityController} from '../../../Kalitte/UI/EntityController';
import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Entity, Data, ViewModels, Security} from '../../../Data/Models';
import {Kalitte} from '../../../Kalitte/Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';


@Meta.Controller('CompanyUserController')
export class CompanyUserController extends EntityController<Entity.CompanyUser> {
    userAccount: any;
    emailError: string;
    idParameter = 'userId';
    $Service = Remote.Entity<Entity.CompanyUser>("CompanyUser");
    $CompanyService = Remote.Entity<Entity.Company>("Company");
    $AccountService = Remote.Entity("Account");
    roles: { [id: string]: any } = {};

    getUserAccount() {
        this.errorHandled(this.$CompanyService.Id($stateParams["Id"], { users: true })).then((company: Entity.Company) => {
            var user = _.find(company.Users, "EMail", this.$Entity.EMail);
            if (user) {
                this.emailError = "Bu kullanıcı zaten çalışanınız olarak gözüküyor.";
                return $q.reject();
            }

            return this.$AccountService.Call<boolean>('UserExists', {
                email: this.$Entity.EMail
            }).then((result) => {
                if (!result)
                    this.emailError = "Lütfen e-posta adresini doğru girdiğinizi kontrol ediniz.";
                else this.userAccount = this.$Entity.EMail;
            });
        });
    }

    EmptyEntity(): Entity.CompanyUser {
        return <Entity.CompanyUser> {
            Roles: []
        };
    }

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company.users.new', {
            url: '/new',
            controller: 'CompanyUserController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }
        }).state('app.company.users.edit', {
            url: '/:userId/edit',
            controller: 'CompanyUserController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }

        })
    }

    save() {
        this.$Entity.Roles.length = 0;
        for (var key in this.roles) {
            if (this.roles[key].Has) this.$Entity.Roles.push(parseInt(key))
        }

        var inserting = !this.$Entity.Id;
        if (inserting) {
            this.$Entity.CompanyId = $stateParams['Id'];
            this.$Entity.EMail = this.userAccount;
            this.$Entity.Display = this.$Entity.EMail;
        }
        return super.save().then(() => {
            $rootScope.$broadcast(inserting ? 'Entity.CompanyUser.Inserted' : 'Entity.CompanyUser.Updated', this.$Entity);
            Dialog.Hide();
        });
    }

    CloseDialog() {
        Dialog.Hide();
    }

    initialize() {

        this.roles[ViewModels.Company.ServiceKind.Waiter] = {
            Title: 'Waiter',
            Has: false
        };

        this.roles[ViewModels.Company.ServiceKind.Vale] = {
            Title: 'Vale',
            Has: false
        };

        this.roles[ViewModels.Company.ServiceKind.CRM] = {
            Title: 'Customer Manager',
            Has: false
        };

        return super.initialize().then(() => {
            for (var key in this.roles) {
                this.roles[key].Has = this.$Entity.Roles.indexOf(parseInt(key)) >= 0;
            }
            Dialog.Show({
                controller: () => this,
                controllerAs: 'ctrl',
                templateUrl: 'src/web/Company/Users/Edit.html'
            }).finally(() => {
                $state.go('^');
            });
        });
    }
}