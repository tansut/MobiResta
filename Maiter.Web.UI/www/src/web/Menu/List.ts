import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {EntityListController} from '../../Kalitte/UI/EntityListController';

import {App, Application} from '../../Kalitte/Core/Application';
import {$timeout, $location, $rootScope, $state} from '../../Kalitte/Vendor/AngularService';

import {Meta} from '../../Kalitte/Core/Meta';

import {Remote} from '../../Kalitte/Data/RemoteService';
import {Entity, Data} from '../../Data/Models';

import {BSMenu} from '../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../Kalitte/UI/BSMenu';


@Meta.Controller(MenuController.ControllerName)
export class MenuController extends EntityListController<Entity.Menu> {
    public static ControllerName = 'MenuController';
    $Service = Remote.Entity<Entity.Menu>("Menu");


    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.menu',
            {
                url: '/menu',
                abstract: true,
                templateUrl: "src/web/Menu/Layout.html",
                data: { authenticated: true }
            })
            .state('app.menu.list', {
                url: '',
                templateUrl: "src/web/Menu/List.html",
                controller: MenuController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: 'Menüler', authenticated: true }
            })
    }


    showEntityActions($event, entity: Entity.Company) {
        BSMenu.Show({
            Header: entity.Name,
            Items: [{ Name: 'edit', Href: $state.href("app.menu.edit", { Id: entity.Id }), Title: 'Düzenle' },                
                {
                    Name: 'attachments', Title: 'Menü Görselleri', Handler: (entity: Entity.Menu) => {
                        $state.go('app.attachment', {
                            Id: entity.Id,
                            entity: Entity.Menu.EntityName,
                            title: entity.Name + ' > ' + "Görselleri"
                        }).then(() => {
                            BSMenu.Hide();
                        });

                    }
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.Menu) => {
                        $state.go('app.deleteEntity', { service: this.$Service, Id: entity.Id, title: entity.Name }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                }],
            $event: $event,
            Data: entity,
        });
    }

    ExecuteQuery() {
        return this.$Service.Call('UserList', {}, { 'attachments': true, contentType: Entity.AttachmentType.Image });
    }

    entitySections(entity: Entity.Menu) {
        $state.go('app.menu.sections', { Id: entity.Id });
    }


    editEntity(entity: Entity.Menu) {
        $state.go('app.menu.edit', { Id: entity.Id });
    }
}