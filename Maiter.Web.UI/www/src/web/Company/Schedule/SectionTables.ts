/// <reference path="../../../ref/sprintf/sprintf-js.d.ts" />

import {EntityController} from '../../../Kalitte/UI/EntityController';
import {Entity} from '../../../Data/Models';
import {Meta} from '../../../Kalitte/Core/Meta';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Remote} from '../../../Kalitte/Data/RemoteService';

import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';

@Meta.Controller("SectionScheduleTableController")
export class SectionScheduleTableController extends EntityController<Entity.CompanySection> {
    idParameter = 'sectionId';
    $Service = Remote.Entity<Entity.CompanySection>("CompanySection");
    editTableResponsibility: Entity.TableResponsibility;
    editMode: string;
    editIndex: number;


    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.
            state('app.company.schedule.tables', {
                url: '/:sectionId/tables',
                templateUrl: 'src/web/Company/Schedule/SectionTables.html',
                controller: "SectionScheduleTableController",
                controllerAs: "ctrl",
                data: { authenticated: true, title: 'Waiters Schedule' }
            })
    }

    newTableGroup() {
        this.editMode = "new";
        this.editTableResponsibility = <Entity.TableResponsibility>{
            ResourceData: {
            },
            Timing: {
            }
        };

        Dialog.Show({
            controller: () => this,
            templateUrl: 'src/web/Company/Schedule/SelectTablesDialog.html'
        });
    }

    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { schedule: true }).then((item) => {
            this.$Dirty = false;
            return item;
        });
    }

    //initialize() {
    //    return super.initialize().then(() => {
    //        this.editCompanyTableTiming = angular.copy(this.$Entity.ManagementService.Timing);
    //    });
    //}

    removeTablePlan(selection: Entity.TableResponsibility) {
        var index = this.$Entity.TableService.indexOf(selection);
        this.$Entity.TableService.splice(index, 1);
        this.$Dirty = true;
    }

    editTablePlan(selection: Entity.TableResponsibility) {
        this.editMode = 'edit';
        this.editIndex = this.$Entity.TableService.indexOf(selection);
        this.editTableResponsibility = angular.copy(selection);
        Dialog.Show({
            controller: () => this,
            templateUrl: 'src/web/Company/Schedule/SelectTablesDialog.html'
        });
    }

    saveDialog() {
        this.errorHandled(this.$Service.Call<number>('ValidateTableResponsibity', { sectionId: this.$Id }, this.editTableResponsibility).then((count) => {
            if (!count) {
                this.error("There are no tables which match this criteria. Please check your selection criteria.");
                return;
            }
            else this.toast(sprintf("%d tables matched.", count));
            if (this.editMode == 'new')
                this.$Entity.TableService.splice(0, 0, this.editTableResponsibility);
            else {
                this.$Entity.TableService[this.editIndex] = this.editTableResponsibility;
            }
            this.$Dirty = true;
            Dialog.Hide();            
        }));
    }

    CloseDialog() {
        Dialog.Hide();
    }

    saveAll() {
        var remote = angular.copy(this.$Entity.TableService);
        this.errorHandled(this.$Service.Call('SaveTablePlan', {
            sectionId: this.$Entity.Id
        }, {
                List: remote
            }).then(() => {
                this.$Entity.TableService = remote;
            })).then(() => {
            this.$Dirty = false;
            });;
    }
}