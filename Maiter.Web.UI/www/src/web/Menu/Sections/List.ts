/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />

import {EntityController} from '../../../Kalitte/UI/EntityController';
import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Company} from '../../../Data/CompanyService';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {Entity, Data, ViewModels} from '../../../Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';


@Meta.Controller('ManageMenuController', {
    state: {
        name: 'app.menu.sections', url: '/manage/:Id',
        templateUrl: 'src/web/Menu/Sections/List.html',
        controller: 'ManageMenuController as ctrl',
        data: { title: 'Menü Yönetimi', authenticated: true, roles: [] }
    }
})
export class ManageMenuController extends EntityController<Entity.Menu> {

    companyList: Array<Entity.Company>;
    $Service = Remote.Entity<Entity.Menu>("Menu");
    $MenuSectionService = Remote.Entity<Entity.MenuSection>("MenuSection");


    showEntityActions($event, entity: Entity.MenuSection) {
        BSMenu.Show({
            Header: entity.Name,
            Items: [{
                Name: 'edit',
                Title: 'Düzenle',
                Href: $state.href('app.menu.sections.edit', {
                    sectionId: entity.Id
                })
            },
                {
                    Name: 'foods',
                    Title: 'Menü İçeriğini Belirle',
                    Href: $state.href('app.food.listByMenuSection', {
                        menuId: entity.MenuId,
                        sectionId: entity.Id
                    })
                },
                {
                    Name: 'attachments', Title: 'Görseller', Handler: (entity: Entity.MenuSection) => {
                        $state.go('app.attachment', {
                            Id: entity.Id,
                            entity: Entity.MenuSection.EntityName,
                            title: entity.Name + ' > ' + "Görselleri"
                        }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.MenuSection) => {
                        $state.go('app.deleteEntity', { service: this.$MenuSectionService, Id: entity.Id, title: entity.Name }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                }],
            $event: $event,
            Data: entity,
        });
    }

    foodSection($event, entity: Entity.MenuSection) {
        $state.go("app.food.listByMenuSection", { menuId: entity.MenuId, sectionId: entity.Id });
    }

    editSection($event, entity: Entity.MenuSection) {
        $state.go("app.menu.sections.edit", { sectionId: entity.Id });
    }


    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { 'attachments': true, 'contentType': Entity.AttachmentType.Image, 'companies': true });
    }

    setCompanyFlags() {
        this.$Entity.CompanyIds.forEach((cid) => {
            var company = _.find(this.companyList, 'Id', cid);
            company['enabled'] = true;
        });
    }

    assocCompany(entity: Entity.Company) {
        var copy = angular.copy(this.$Entity.CompanyIds);
        var hasAssoc = _.indexOf(copy, entity.Id);
        if (hasAssoc >= 0)
            copy.splice(hasAssoc, 1);
        else
            copy.push(entity.Id);

        this.errorHandled(this.$Service.Call('UpdateCompanyAssoc', { menuId: this.$Entity.Id }, { List: copy })).then(() => {
            this.$Entity.CompanyIds = copy;
            this.setCompanyFlags();
        });

    }

    initialize() {
        return Company.Call<Array<Entity.Company>>('UserList', {}, {}).then((companies) => {
            this.companyList = companies;
            return super.initialize().then(() => {
                this.setCompanyFlags();
            });
        });
    }

    constructor($scope: angular.IScope) {
        super($scope);
        this.on('Entity.MenuSection.Updated', 'Entity.MenuSection.Inserted', (event, updated: Entity.MenuSection) => {
            var index = _.findIndex(this.$Entity.Sections, (item) => item.Id == updated.Id);
            index < 0 ? this.LoadEntity() : this.$Entity.Sections[index] = updated;
        }, (event, inserted) => {
            this.$Entity.Sections.push(inserted);
        });
    }
}   