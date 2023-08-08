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


@Meta.Controller('CompanyMenuItemListController', {
    state: {
        name: 'app.company.appmenus', url: '/:Id/appmenus',
        templateUrl: "src/web/Company/AppMenus/List.html",
        data: { authenticated: true, title: 'Application Menu Items' }
    }
})
export class CompanyMenuItemListController extends EntityController<Entity.Company> {
    target = $stateParams['target'];
    $Service = Remote.Entity<Entity.Company>("Company");
    $CompanyMenuItemService = Remote.Entity<Entity.CompanyAppMenuItem>("CompanyAppMenuItem");

    showEntityActions($event, entity: Entity.CompanyAppMenuItem) {
        BSMenu.Show({
            Header: entity.Title,
            Items: [
                {
                    Name: 'edit',
                    Title: 'Düzenle',
                    Href: $state.href('app.company.appmenus.edit', {
                        MenuItemId: entity.Id
                    })
                },
                {
                    Name: 'attachments', Title: 'Content Visuals', Handler: (entity: Entity.CompanyAppMenuItem) => {
                        $state.go('app.attachment', {
                            Id: entity.Id,
                            entity: Entity.CompanyAppMenuItem.EntityName,
                            title: entity.Title
                        }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                },
                {
                    Name: 'videoattachments', Title: 'Content Videos', Handler: (entity: Entity.CompanyAppMenuItem) => {
                        $state.go('app.attachment', {
                            Id: entity.Id,
                            entity: Entity.CompanyAppMenuItem.EntityName,
                            title: entity.Title,
                            attachtype: Entity.AttachmentType.VideoLink
                        }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.CompanyAppMenuItem) => {
                        $state.go('app.deleteEntity', { service: this.$CompanyMenuItemService, Id: entity.Id, title: entity.Title }).then(() => {
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
        return this.$Service.Id(this.$Id, { appMenus: true, attachments: true });
    }

    editEntity(entity: Entity.CompanyAppMenuItem) {
        $state.go("app.company.appmenus.edit", { MenuItemId: entity.Id });
    }

    constructor($scope: angular.IScope) {
        super($scope);
        this.on('Entity.CompanyAppMenuItem.Updated', 'Entity.CompanyAppMenuItem.Inserted', (event, updated: Entity.CompanyAppMenuItem) => {
            var index = _.findIndex(this.$Entity.Sections, (item) => item.Id == updated.Id);
            index < 0 ? this.LoadEntity() : this.$Entity.AppMenuItems[index] = updated;
        }, (event, inserted) => {
            this.$Entity.AppMenuItems.push(inserted);
        });
    }
}   

