import {EntityListController} from '../../../../../Kalitte/UI/EntityListController';
import {Entity} from '../../../../../Data/Models';
import {Meta} from '../../../../../Kalitte/Core/Meta';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../../../Kalitte/Vendor/AngularService';
import {BSMenu} from '../../../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../../../Kalitte/UI/BSMenu';
import {Remote} from '../../../../../Kalitte/Data/RemoteService';

@Meta.Controller("CityListController")
export class CityListController extends EntityListController<Entity.City>{

    $CityService = Remote.Entity<Entity.City>("City");
    $StateService = Remote.Entity<Entity.CountryState>("State");

    State : Entity.CountryState;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('app.country.state.city.list', {
                url: '',
                templateUrl: 'src/web/System/Country/state/city/list.html',
                controller: "CityListController",
                controllerAs: "ctrl",
                data: { authenticated: true, title: 'Şehirler' }
            }).state('app.country.state.city', {
                url: '/:stateId/city',
                template: '<ui-view/>',
                abstract: true,
                data: {
                    authenticated: true, title: 'Şehirler'
                }
            }
                );
    }
    showEntityActions($event, entity: Entity.City) {
        BSMenu.Show({
            Header: entity.Name,
            Items: [
                {
                    Name: 'edit',
                    Title: 'Düzenle',
                    Href: $state.href('app.country.state.city.edit', {
                        cityId: entity.Id
                    })
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.CountryState) => {
                        $state.go('app.deleteEntity', { service: this.$CityService, Id: entity.Id, title: entity.Name }).then(() => {
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
        return this.$StateService.Id($stateParams['stateId']).then((state) => {
            this.State = state;
            return this.$CityService.Call<Array<Entity.City>>('List', { stateId: $stateParams['stateId'] }).then((items) => {
                return items;
            });
        });
    }


    editEntity($event, entity: Entity.City) {
        $state.go("app.country.state.city.edit", { cityId: entity.Id });
    }

}