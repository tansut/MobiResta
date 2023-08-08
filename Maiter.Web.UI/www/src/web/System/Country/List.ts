import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Entity} from '../../../Data/Models';
import {Meta} from '../../../Kalitte/Core/Meta';
import { Remote } from '../../../Kalitte/Data/RemoteService';
import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';
import { $state} from '../../../Kalitte/Vendor/AngularService';

@Meta.Controller("CountryList")
export class CountryList extends EntityListController<Entity.Country> {
    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('app.country', {
                url: '/country',
                templateUrl: 'src/web/System/Country/Layout.html',
                abstract:true,
                data: { authenticated: true, title: 'Ülkeler' }
            })
            .state('app.country.list', {
                url: '',
                templateUrl: 'src/web/System/Country/List.html',
                controller: "CountryList",
                controllerAs: "ctrl",
                data: { authenticated: true, title: 'Ülkeler' }
            });
    }

    $Service = Remote.Entity<Entity.Country>("Country");

    ExecuteQuery() {
        return this.$Service.Call<Array<Entity.Country>>('List').then((items) => {
            return items;
        });
    }

    editEntity(entity: Entity.Country) {
        $state.go('app.country.edit', {
            Id: entity.Id
        });
    }


    showEntityActions($event, entity: Entity.Country) {
        BSMenu.Show({
            Header: entity.Name,
            Items: [{ Name: 'edit', Href: $state.href("app.country.edit", { Id: entity.Id }), Title: 'Düzenle' },                
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.Country) => {
                        $state.go('app.deleteEntity', { service: this.$Service, Id: entity.Id, title: entity.Name }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                },
                {
                    Name: 'new', Title: 'Eyaletler', Href: $state.href("app.country.state", { countryId: entity.Id })
                }],
            $event: $event,
            Data: entity,
        });
    }
}