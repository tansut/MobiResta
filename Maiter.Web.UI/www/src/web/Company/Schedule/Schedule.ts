/// <reference path="../../../ref/lodash/lodash.d.ts" />

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


@Meta.Controller('CompanyScheduleController')
export class CompanyScheduleController extends EntityController<Entity.Company> {
    $DirtyVale: boolean = false;
    $Service = Remote.Entity<Entity.Company>("Company");
    $CompanyUserService = Remote.Entity<Entity.CompanySection>("CompanySection");
    editCompanyManagerTiming: { [id: number]: Entity.TimingInfo }
    editCompanyValeTiming: { [id: number]: Entity.TimingInfo }

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company.schedule', {
            url: '/:Id/schedule',
            abstract: true,
            template: '<div ui-view></div>'
        }).state('app.company.schedule.manage', {
            url: '',
            controller: 'CompanyScheduleController',
            controllerAs: 'ctrl',
            templateUrl: "src/web/Company/Schedule/Schedule.html",
            data: { authenticated: true, title: 'Service Schedule' }
        })
    }


    showEntityActions($event, entity: Entity.CompanyUser) {
        BSMenu.Show({
            Header: entity.Display,
            Items: [
                {
                    Name: 'edit',
                    Title: 'Edit',
                    Href: $state.href('app.company.schedule.edit', {
                        userId: entity.Id
                    })
                },
                {
                    Name: 'delete', Title: 'Sil', Handler: (entity: Entity.CompanyUser) => {
                        $state.go('app.deleteEntity', { service: this.$CompanyUserService, Id: entity.Id, title: entity.Display }).then(() => {
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
        return this.$Service.Id(this.$Id, { sections: true, schedule: true }).then((item) => {
            this.$Dirty = false;
            this.$DirtyVale = false;
            return item;
        });
    }

    saveManagementPlan() {
        var remote = angular.copy(this.$Entity.ManagementService);
        remote.Timing = this.editCompanyManagerTiming;
        this.errorHandled(this.$Service.Call('SaveManagementPlan', {
            companyId: this.$Entity.Id
        }, remote).then(() => {
            this.$Entity.ManagementService = remote;
        })).then(() => {
            this.toast('Plan değişiklikleri kaydedildi');
            this.$Dirty = false;
        });;
    }

    saveValePlan() {
        var remote = angular.copy(this.$Entity.ValeService);
        remote.Timing = this.editCompanyValeTiming;
        this.errorHandled(this.$Service.Call('SaveValePlan', {
            companyId: this.$Entity.Id
        }, remote).then(() => {
            this.$Entity.ValeService = remote;
        })).then(() => {
            this.toast('Plan değişiklikleri kaydedildi');
            this.$DirtyVale = false;
        });
    }

    initialize() {
        return super.initialize().then(() => {
            this.editCompanyManagerTiming = angular.copy(this.$Entity.ManagementService.Timing);
            this.editCompanyValeTiming = angular.copy(this.$Entity.ValeService.Timing);
        });
    }



    CloseDialog() {
        Dialog.Hide();
    }

    editEntity($event, entity: Entity.CompanyUser) {
        $state.go("app.company.schedule.edit", { userId: entity.Id });
    }

    constructor($scope: angular.IScope) {
        super($scope);

    }
}   
