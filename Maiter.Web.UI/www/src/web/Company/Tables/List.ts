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


@Meta.Controller('CompanySectionTableListController', {
    state: {
        name: 'app.company.tables', url: '/:sectionId/tables',
        templateUrl: "src/web/Company/Tables/List.html",
        data: { authenticated: true, title: 'Restaurant Masaları' }    }
})
export class CompanySectionTableListController extends EntityController<Entity.CompanySection> {
    idParameter = 'sectionId';
    $Service = Remote.Entity<Entity.Company>("CompanySection");
    $CompanyService = Remote.Entity<Entity.Company>("Company");
    $TableService = Remote.Entity<Entity.Company>("Table");
    company: Entity.Company;

    showEntityActions($event, entity: Entity.ResTable) {
        if (entity.Simulated)
            this.error("Simulasyon sonucu oluşturulmuştur.")
        else 
        BSMenu.Show({
            Header: entity.Name,
            Items: [
                {
                    Name: 'edit',
                    Title: 'Düzenle',
                    Href: $state.href('app.company.tables.edit', {
                        tableId: entity.Id
                    })
                },
                {
                    Name: 'attachments', Title: 'Görseller', Handler: (entity: Entity.ResTable) => {
                        $state.go('app.attachment', {
                            Id: entity.Id,
                            entity: Entity.ResTable.EntityName,
                            title: entity.Name + ' > ' + "Görselleri"
                        }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.ResTable) => {
                        $state.go('app.deleteEntity', { service: this.$TableService, Id: entity.Id, title: entity.Name }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                }
            ],
            $event: $event,
            Data: entity,
        });
    }

    LoadEntity() {
        return super.LoadEntity().then((entity: Entity.CompanySection) => {
            return this.$CompanyService.Id(entity.CompanyId).then((company) => {
                this.company = company;
            });
        });
    }

    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { attachments: true, contentType: 'image', tables: true, tags: true });
    }

    editEntity($event, entity: Entity.ResTable) {
            $state.go("app.company.tables.edit", { tableId: entity.Id });
    }

    constructor($scope: angular.IScope) {
        super($scope);
        this.on('TableGeneration:Simulated', 'TableGeneration:Created', (event, list: Array<Entity.ResTable>) => {
            list.forEach((item) => {
                this.$Entity.Tables.splice(0, 0, item);
                //this.$Entity.Tables.push(item);
            });
            
        }, (event, list: Array<Entity.ResTable>) => {
            this.LoadEntity();            
            });

        this.on('Entity.Table.Updated', 'Entity.Table.Inserted', (event, updated: Entity.ResTable) => {
            var index = _.findIndex(this.$Entity.Tables, (item) => item.Id == updated.Id);
            index < 0 ? this.LoadEntity() : this.$Entity.Tables[index] = updated;
        }, (event, inserted: Entity.ResTable) => {
            this.$Entity.Tables.splice(0, 0, inserted);
        });
    }
}   