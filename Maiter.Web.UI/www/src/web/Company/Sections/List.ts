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


@Meta.Controller('CompanySectionListController', {
    state: {
        name: 'app.company.sections', url: '/:Id/sections/:target',
        templateUrl: "src/web/Company/Sections/List.html",
        data: { authenticated: true, title: 'Restaurant Bölümleri' }    }
})
export class CompanySectionListController extends EntityController<Entity.Company> {

    target = $stateParams['target'];

    $Service = Remote.Entity<Entity.Company>("Company");
    $CompanySectionService = Remote.Entity<Entity.CompanySection>("CompanySection");

    showEntityActions($event, entity: Entity.CompanySection) {
        BSMenu.Show({
            Header: entity.Name,
            Items: [
                {
                    Name: 'edit',
                    Title: 'Düzenle',
                    Href: $state.href('app.company.sections.edit', {
                        sectionId: entity.Id
                    })
                },
                {
                    Name: 'attachments', Title: 'Görseller', Handler: (entity: Entity.CompanySection) => {
                        $state.go('app.attachment', {
                            Id: entity.Id,
                            entity: Entity.CompanySection.EntityName,
                            title: entity.Name + ' > ' + "Görselleri"
                        }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.MenuSection) => {
                        $state.go('app.deleteEntity', { service: this.$CompanySectionService, Id: entity.Id, title: entity.Name }).then(() => {
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
        return this.$Service.Id(this.$Id, { attachments: true, contentType: Entity.AttachmentType.Image, sections: true });
    }

    editEntity($event, entity: Entity.CompanySection) {
        if (this.target == 'tables') {
            $state.go("app.company.tables", { sectionId: entity.Id });            
        }
        else
            $state.go("app.company.sections.edit", { sectionId: entity.Id });
    }

    constructor($scope: angular.IScope) {
        super($scope);
        this.on('Entity.CompanySection.Updated', 'Entity.CompanySection.Inserted', (event, updated: Entity.CompanySection) => {
            var index = _.findIndex(this.$Entity.Sections, (item) => item.Id == updated.Id);
            index < 0 ? this.LoadEntity() : this.$Entity.Sections[index] = updated;
        }, (event, inserted) => {
            this.$Entity.Sections.push(inserted);
        });
    }
}   