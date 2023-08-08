/// <reference path="../../../ref/lodash/lodash.d.ts" />


import {EntityController} from '../../../Kalitte/UI/EntityController';
import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Entity, Data, ViewModels, Security} from '../../../Data/Models';
import {Kalitte} from '../../../Kalitte/Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';
import {CompanyCustomerRequestListController} from './List';

@Meta.Controller('CompanyCustomerRequestController')
export class CompanyCustomerRequestController extends EntityController<Entity.CompanyCustomerRequest> {
    userAccount: any;
    emailError: string;
    //serviceKind = _.remove(Object.keys(ViewModels.Company.ServiceKind), (e) => { return  ((parseInt(e) || -1)   === -1); });
    $Data: Entity.CompanyCustomerRequest;
    $Service = Remote.Entity<Entity.CompanyCustomerRequest>("CompanyCustomerRequest");

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('app.company.customerrequest.list.edit', {
                url: '/:name/edit',
                controller: 'CompanyCustomerRequestController',
                controllerAs: 'ctrl',
                onExit: () => {
                    Dialog.Hide();
                },
                data: { authenticated: true, title: 'Customer Request Update' },
            })
    }
    LoadEntity() {
        return this.errorHandled(this.$Service.Call<Entity.CompanyCustomerRequest>('Get',
            { requestname: $stateParams["name"], companyId: $stateParams["Id"] }).then((resp) => {
                this.$Data = resp;
            }));
    }
    save() {
        var $_Entity = <Entity.CompanyCustomerRequest>{};
        $_Entity.RequestName = this.$Data.RequestName;
        $_Entity.TargetService = this.$Data.TargetService;
        $_Entity.Disabled = this.$Data.Disabled;
        $_Entity.CompanyId = $stateParams["Id"];
        return this.$Service.Call('Save', {}, $_Entity).then(() => {
            var listCtrl = this.getParent<CompanyCustomerRequestListController>();
            var req = _.find<ViewModels.Mobile.RequestType>(listCtrl.$_List, (e) => e.Name === $_Entity.RequestName);
            req.Disabled = $_Entity.Disabled;
            Dialog.Hide();
        });
    }
    serviceKind() {
        var object = {};
        object[ViewModels.Company.ServiceKind.Default] = "Default";
        object[ViewModels.Company.ServiceKind.CRM] = "Customer Services";
        object[ViewModels.Company.ServiceKind.Vale] = "Vale";
        object[ViewModels.Company.ServiceKind.Waiter] = "Waiter";
        return object;
    }
    CloseDialog() {
        Dialog.Hide();
    }
    initialize(): angular.IPromise<void> {
        return super.initialize().then(() => {
            Dialog.Show({
                controller: () => this,
                controllerAs: 'ctrl',
                templateUrl: 'src/web/Company/CustomerRequest/Edit.html'
            }).finally(() => {
                $state.go('^')
            });
        });
    }
}
