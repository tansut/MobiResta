/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {EntityListController} from '../../Kalitte/UI/EntityListController';

import {App, Application} from '../../Kalitte/Core/Application';
import {$timeout, $location, $rootScope, $state} from '../../Kalitte/Vendor/AngularService';
import {$mdSidenav, $mdDialog, $mdUtil} from '../../Kalitte/Vendor/MaterialService';

import {Meta} from '../../Kalitte/Core/Meta';
import {Company as DataService} from '../../Data/CompanyService';
import {EntityService} from '../../Kalitte/Data/RemoteService';
import {Entity, Data} from '../../Data/Models';

import {BSMenu} from '../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../Kalitte/UI/BSMenu';



@Meta.Controller("CompanyController")
export class CompanyController extends EntityListController<Entity.Company> {

    public static ControllerName = 'CompanyController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company',
            {
                url: '/company',
                abstract: true,
                template: "<div ui-view></div>",    
                data: { authenticated: true }
            })
            .state('app.company.list', {
                url: '',
                templateUrl: "src/web/Company/List.html",
                controller: CompanyController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: 'Restaurant Listesi', authenticated: true }
            })
    }
    constructor($scope: angular.IScope) {
        super($scope, DataService);
    }



    getItemOptions(entity: Entity.Company): Array<BSMenuItem> {
        return new Array<BSMenuItem>(
            { Name: 'edit', Href: $state.href("app.company.edit", { Id: entity.Id }), Title: 'Temel Bilgileri Düzenle' },
            { Name: 'manage', Href: $state.href("app.company.manage", { Id: entity.Id }), Title: 'Restaurant Yönetimi' },
            {
                Name: 'delete', Title: 'Sil', Handler: (entity: Entity.Company) => {
                    $state.go('app.deleteEntity', { service: DataService, Id: entity.Id, title: entity.Name }).then(() => {
                        BSMenu.Hide();
                    });
                }
            })
    }


    showEntityActions($event, entity: Entity.Company) {
        BSMenu.Show({
            Header: entity.Name,
            Items: this.getItemOptions(entity),
            $event: $event,
            Data: entity,
        });
    }

    ExecuteQuery() {
        return DataService.Call('UserList', {}, { 'attachments': true, 'contentType': Entity.AttachmentType.Image });
    }

    manageEntity(entity: Entity.Company) {
        $state.go('app.company.manage', { Id: entity.Id });
    }

    editEntity(entity: Entity.Company) {
        $state.go('app.company.edit', { Id: entity.Id });
    }
}   