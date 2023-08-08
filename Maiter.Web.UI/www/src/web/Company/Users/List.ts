/// <reference path="../../../ref/lodash/lodash.d.ts" />

import {EntityController} from '../../../Kalitte/UI/EntityController';
import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Entity, Data, ViewModels} from '../../../Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';

import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';


@Meta.Controller('CompanyUserListController', {
    state: {
        name: 'app.company.users', url: '/:Id/users',
        templateUrl: "src/web/Company/Users/List.html",
        data: { authenticated: true, title: 'Restaurant Çalışanları' }    }
})
export class CompanyUserListController extends EntityController<Entity.Company> {

    target = $stateParams['target'];

    $Service = Remote.Entity<Entity.Company>("Company");
    $CompanyUserService = Remote.Entity<Entity.CompanyUser>("CompanyUser");

    showEntityActions($event, entity: Entity.CompanyUser) {
        BSMenu.Show({
            Header: entity.Display,
            Items: [
                {
                    Name: 'edit',
                    Title: 'Düzenle',
                    Href: $state.href('app.company.users.edit', {
                        userId: entity.Id
                    })
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.CompanyUser) => {
                        $state.go('app.deleteEntity', { service: this.$CompanyUserService, Id: entity.Id, title: entity.Display }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                }
            ],
            $event: $event,
            Data: entity,
        });
    }

    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { users: true });
    }

    editEntity($event, entity: Entity.CompanyUser) {
         $state.go("app.company.users.edit", { userId: entity.Id });
    }

    constructor($scope: angular.IScope) {
        super($scope);
        this.on('Entity.CompanyUser.Updated', 'Entity.CompanyUser.Inserted', (event, updated: Entity.CompanyUser) => {
            var index = _.findIndex(this.$Entity.Users, (item) => item.Id == updated.Id);
            index < 0 ? this.LoadEntity() : this.$Entity.Users[index] = updated;
        }, (event, inserted) => {
            this.$Entity.Users.push(inserted);
        });
    }
}   