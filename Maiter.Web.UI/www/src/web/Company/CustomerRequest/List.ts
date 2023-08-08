import {EntityController} from '../../../Kalitte/UI/EntityController';
import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Entity, Data, ViewModels} from '../../../Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';

import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';


@Meta.Controller('CompanyCustomerRequestListController')
export class CompanyCustomerRequestListController extends EntityListController<Entity.CompanyCustomerRequest> {

    
    $Service = Remote.Entity<Entity.CompanyCustomerRequest>("CompanyCustomerRequest");
    $_List: Array<ViewModels.Mobile.RequestType>;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company.customerrequest', {
            url: '/:Id/customerrequest',
            abstract: true,
            template: '<div ui-view></div>'

        }).state('app.company.customerrequest.list', {
            url: '',
            controller: 'CompanyCustomerRequestListController',
            controllerAs: 'ctrl',
            templateUrl: "src/web/Company/CustomerRequest/List.html",
            data: { authenticated: true, title: 'Customer Request' }
        })
    }

    LoadItems() {
        return this.errorHandled(this.$Service.Call<Array<ViewModels.Mobile.RequestType>>('List',
            { companyId: $stateParams["Id"] }).then((resp) => {
                this.$_List = resp;
            }));
        debugger;
    }


    editEntity($event, entity: ViewModels.Mobile.RequestType) {

        $state.go("app.company.customerrequest.list.edit", { name: entity.Name });
    }

    constructor($scope: angular.IScope) {
        super($scope);

    }

}