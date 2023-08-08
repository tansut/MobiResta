import {EntityListController} from '../../../../Kalitte/UI/EntityListController';
import {Entity} from '../../../../Data/Models';
import {Meta} from '../../../../Kalitte/Core/Meta';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../../Kalitte/Vendor/AngularService';
import {BSMenu} from '../../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../../Kalitte/UI/BSMenu';
import {Remote} from '../../../../Kalitte/Data/RemoteService';

@Meta.Controller("StateListController")
export class StateListController extends EntityListController<Entity.CountryState>{

    $CounstrStateService = Remote.Entity<Entity.CountryState>("State");
    $CountryService = Remote.Entity<Entity.Country>("Country");

    Country: Entity.Country;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('app.country.state.list', {
                url: '',
                templateUrl: 'src/web/System/Country/state/list.html',
                controller: "StateListController",
                controllerAs: "ctrl",
                data: { authenticated: true, title: 'Eyaletler' }
            }).state('app.country.state', {
                url: '/:countryId/state',
                template: '<ui-view/>',
                abstract: true,
                data: {
                    authenticated: true, title: 'Eyaletler'
                }
            }
                );
    }



    showEntityActions($event, entity: Entity.CountryState) {
        BSMenu.Show({
            Header: entity.Name,
            Items: [
                {
                    Name: 'edit',
                    Title: 'Düzenle',
                    Href: $state.href('app.country.state.edit', {
                        stateId: entity.Id
                    })
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.CountryState) => {
                        $state.go('app.deleteEntity', { service: this.$CounstrStateService, Id: entity.Id, title: entity.Name }).then(() => {
                            BSMenu.Hide();
                        });
                    }
                },
                {
                    Name: 'new', Title: 'Şehirler', Href: $state.href("app.country.state.city", { stateId: entity.Id })
                }
            ],
            $event: $event,
            Data: entity,
        });
    }

    ExecuteQuery() {
        return this.$CountryService.Id($stateParams['countryId']).then((country) => {
            this.Country = country;
            return this.$CounstrStateService.Call<Array<Entity.CountryState>>('List', { countryId: country.Id }).then((items) => {
                return items;
            });
        });
    }

    


    editEntity($event, entity: Entity.CountryState) {
        $state.go("app.country.state.edit", { stateId: entity.Id });
    }



    //constructor($scope: angular.IScope) {
    //    super($scope);
    //    this.on('Entity.CompanyUser.Updated', 'Entity.CompanyUser.Inserted', (event, updated: Entity.CountryState) => {
    //        var index = _.findIndex(this.$Entity.State, (item) => item.Id == updated.Id);
    //        index < 0 ? this.LoadEntity() : this.$Entity.State[index] = updated;
    //    }, (event, inserted) => {
    //        this.$Entity.State.push(inserted);
    //    });
    //}
}