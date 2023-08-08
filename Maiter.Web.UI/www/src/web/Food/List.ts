/// <reference path="../../ref/lodash/lodash.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {EntityListController} from '../../Kalitte/UI/EntityListController';

import {App, Application} from '../../Kalitte/Core/Application';
import {$timeout, $location, $rootScope, $state, $stateParams} from '../../Kalitte/Vendor/AngularService';

import {Meta} from '../../Kalitte/Core/Meta';
import {Remote} from '../../Kalitte/Data/RemoteService';
import {Entity, Data} from '../../Data/Models';

import {BSMenu} from '../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../Kalitte/UI/BSMenu';



@Meta.Controller(FoodController.ControllerName)
export class FoodController extends EntityListController<Entity.Food> {

    Menu: Entity.Menu;
    Section: Entity.MenuSection;
    $Service = Remote.Entity<Entity.Food>("Food");
    $MenuService = Remote.Entity <Entity.Menu>("Menu");

    public static ControllerName = 'FoodController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.food',
            {
                url: '/food',
                abstract: true,
                templateUrl: "src/web/Food/Layout.html",
                data: { authenticated: true }
            })
            .state('app.food.listByMenu', {
                url: '/list/menu/:menuId',
                templateUrl: "src/web/Food/List.html",
                controller: FoodController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: 'Yiyecekler', authenticated: true }
            })
            .state('app.food.listByMenuSection', {
                url: '/list/section/:menuId/:sectionId',
                templateUrl: "src/web/Food/List.html",
                controller: FoodController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: 'Menü Kısmı İçeriği', authenticated: true }
            })
    }

    getItemOptions(entity: Entity.Company): Array<BSMenuItem> {
        return new Array<BSMenuItem>(
            { Name: 'edit', Href: $state.href("app.food.edit", { Id: entity.Id }), Title: 'Düzenle' },            
            {
                Name: 'attachments', Title: 'Service Visuals', Handler: (entity: Entity.Food) => {
                    $state.go('app.attachment', {
                        Id: entity.Id,
                        entity: Entity.Food.EntityName,
                        title: entity.Name 
                    }).then(() => {
                        BSMenu.Hide();
                    });                    
                }
            },
            {
                Name: 'videoattachments', Title: 'Service Videos', Handler: (entity: Entity.Food) => {
                    $state.go('app.attachment', {
                        Id: entity.Id,
                        entity: Entity.Food.EntityName,
                        title: entity.Name,
                        attachtype: Entity.AttachmentType.VideoLink
                    }).then(() => {
                        BSMenu.Hide();
                    });
                }
            },
            {
                Name: 'delete', Title: 'Sil', Handler: (entity: Entity.Food) => {
                    $state.go('app.deleteEntity', { service: this.$Service, Id: entity.Id, title: entity.Name }).then(() => {
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

    initialize() {
        var self = this;
        return this.$MenuService.Id($stateParams['menuId'], {attachments: true}).then((menu) => {
            this.Menu = menu;
            this.Section = _.find(menu.Sections, 'Id', $stateParams['sectionId']);
            return super.initialize();
        });
    }

    ExecuteQuery() {
        return this.$Service.Call('List', { menuId: $stateParams['menuId'], sectionId: $stateParams['sectionId'] }, {
            attachments: true, contentType: Entity.AttachmentType.Image,
            tags: true
        });
    }

    constructor($scope: angular.IScope) {
        super($scope, null);
    }

    manageEntity(entity: Entity.Food) {
        $state.go('app.food.manage', { Id: entity.Id });
    }


    editEntity(entity: Entity.Food) {
        $state.go('app.food.edit', { Id: entity.Id });
    }
}