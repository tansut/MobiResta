import {EntityController} from '../../../../Kalitte/UI/EntityController';
import {Entity} from '../../../../Data/Models';
import {Meta} from '../../../../Kalitte/Core/Meta';
import { Remote } from '../../../../Kalitte/Data/RemoteService';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../../Kalitte/Vendor/AngularService';
import { Dialog } from '../../../../Kalitte/UI/Web/DialogService';


@Meta.Controller('CountryStateEditorController')
export class CountryStateEditorController extends EntityController<Entity.CountryState>{

    $Service = Remote.Entity<Entity.CountryState>("State");
    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.country.state.new', {
            url: '/new',
            controller: 'CountryStateEditorController',
            controllerAs: 'ctrl',
            templateUrl: 'src/web/System/Country/State/Edit.html',
            data: { authenticated: true ,title:'Yeni Eyalet Kaydı'}
        }).state('app.country.state.edit', {
            url: '/:stateId/edit',
            controller: 'CountryStateEditorController',
            templateUrl: 'src/web/System/Country/State/Edit.html',
            controllerAs: 'ctrl',
            data: { authenticated: true ,title:'Eyalet Bilgilerini Güncelle'},
            onExit: () => {
                Dialog.Hide();
            }

        })
    }
    initialize(): angular.IPromise<void> {
        return super.initialize();
    }


    save() {
       
        this.$Entity.CountryId = $stateParams['countryId'];
        var inserting = !this.$Entity.Id;
        if (inserting) {
            this.$Entity.CountryId = $stateParams['countryId'];
        }
        return super.save().then(() => {
            $rootScope.$broadcast(inserting ? 'Entity.CompanyUser.Inserted' : 'Entity.CompanyUser.Updated', this.$Entity);

            //Kayıt ekleme sonrası listenin güncellenmesi 
            this.$state.go("app.country.state.list", { countryId: $stateParams['countryId'] }).then(() => { this.$state.reload(); });
        });
    }

}