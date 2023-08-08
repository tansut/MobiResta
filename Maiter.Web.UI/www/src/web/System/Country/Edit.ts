import {EntityController} from '../../../Kalitte/UI/EntityController';
import {Entity} from '../../../Data/Models';
import {Meta} from '../../../Kalitte/Core/Meta';
import { Remote } from '../../../Kalitte/Data/RemoteService';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';

@Meta.Controller("CountryEditorController")
export class CountryEditorController extends EntityController<Entity.Country> {

    $Service = Remote.Entity<Entity.Country>("Country");

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.
            state('app.country.new', {
                url: '/new',
                controller: "CountryEditorController",
                controllerAs: "ctrl",
                templateUrl: 'src/web/System/Country/Edit.html',
                data: { authenticated: true, title: 'Yeni Ülke Kaydı' }
            })
            .state('app.country.edit', {
                url: '/edit/:Id',
                templateUrl: 'src/web/System/Country/Edit.html',
                controller: "CountryEditorController",
                controllerAs: "ctrl",
                data: { authenticated: true, title: 'Ülke Bilgilerini Güncelle' }
            })
    }

    initialize(): angular.IPromise<void> {
        return super.initialize();
    }
}