import {EntityController} from '../../../../../Kalitte/UI/EntityController';
import {Entity} from '../../../../../Data/Models';
import {Meta} from '../../../../../Kalitte/Core/Meta';
import { Remote } from '../../../../../Kalitte/Data/RemoteService';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../../../Kalitte/Vendor/AngularService';
import { Dialog } from '../../../../../Kalitte/UI/Web/DialogService';


@Meta.Controller('CityEditorController')
export class CityEditorController extends EntityController<Entity.City>{
    idParameter = 'cityId';
    $Service = Remote.Entity<Entity.City>("City");
    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.country.state.city.new', {
            url: '/new',
            controller: 'CityEditorController',
            controllerAs: 'ctrl',
            templateUrl: 'src/web/System/Country/State/city/Edit.html',
            data: { authenticated: true,title:'Yeni Şehir Kaydı' }
        }).state('app.country.state.city.edit', {
            url: '/edit/:cityId',
            controller: 'CityEditorController',
            templateUrl: 'src/web/System/Country/State/City/Edit.html',
            controllerAs: 'ctrl',
            data: { authenticated: true ,title:'Şehir Bilgilerimi Güncelle'},
            onExit: () => {
                Dialog.Hide();
            }

        })
    }
    initialize(): angular.IPromise<void> {
        return super.initialize();
    }


    save() {
       
       
       
        var inserting = !$stateParams['cityId'];
        this.$Entity.Id = $stateParams['cityId'];
        if (inserting) {
           this.$Entity.StateId = $stateParams['stateId'];
        }
        return super.save().then(() => {
            $rootScope.$broadcast(inserting ? 'Entity.City.Inserted' : 'Entity.City.Updated', this.$Entity);

            this.$state.go("app.country.state.city.list", { stateId: $stateParams['stateId'] }).then(() => { this.$state.reload(); });
        });
    }

}