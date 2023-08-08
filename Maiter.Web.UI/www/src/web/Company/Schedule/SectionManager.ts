import {EntityController} from '../../../Kalitte/UI/EntityController';
import {Entity} from '../../../Data/Models';
import {Meta} from '../../../Kalitte/Core/Meta';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Remote} from '../../../Kalitte/Data/RemoteService';

import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';

@Meta.Controller("SectionScheduleManagerController")
export class SectionScheduleManagerController extends EntityController<Entity.CompanySection> {
    idParameter = 'sectionId';
    $Service = Remote.Entity<Entity.CompanySection>("CompanySection");
    editCompanyManagerTiming: { [id: number]: Entity.TimingInfo }


    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.
            state('app.company.schedule.section', {
                url: '/:sectionId/managers',
                templateUrl: 'src/web/Company/Schedule/SectionManagers.html',
                controller: "SectionScheduleManagerController",
                controllerAs: "ctrl",
                data: { authenticated: true, title: 'Customer Relationship Schedule' }
            })           
    }

    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { schedule: true });
    }

    initialize() {
        return super.initialize().then(() => {
            this.editCompanyManagerTiming = angular.copy(this.$Entity.ManagementService.Timing);
        });
    }

    saveManagementPlan() {
        var remote = angular.copy(this.$Entity.ManagementService);
        remote.Timing = this.editCompanyManagerTiming;
        this.errorHandled(this.$Service.Call('SaveManagementPlan', {
            sectionId: this.$Entity.Id
        }, remote).then(() => {
            this.$Entity.ManagementService = remote;
        })).then(() => {
            this.toast('Plan değişiklikleri kaydedildi');
        });;
    }
}