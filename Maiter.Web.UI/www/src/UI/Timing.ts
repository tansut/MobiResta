/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/lodash/lodash.d.ts" />

import {$q} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {ControllerBase} from '../Kalitte/UI/ControllerBase';
import {Entity} from '../Data/Models';
import {Dialog} from '../Kalitte/UI/Web/DialogService';
import { Remote} from '../Kalitte/Data/RemoteService';

class TimingController extends ControllerBase {
    $Service = Remote.Entity<Entity.CompanyUser>("Company");
    companyId: string;
    newUser: Entity.CompanyUser;
    errMessage: string;
    userSearch = null;
    edit: {
        [id: number]: Entity.TimingInfo
    }
    editingDay: number;
    originalUser: Entity.TimeBasedUsers;
    editingUser: Entity.TimeBasedUsers;
    DayNames: {
        [id: number]: string
    };

    Days = [0, 1, 2, 3, 4, 5, 6];
    newWorkload: Entity.UserWorkLoad;


    addNewWorkload() {
        if (!this.newUser) {
            this.errMessage = "Lütfen önce çalışanı seçiniz";
            return;
        }        
        this.editingUser.Workloads = this.editingUser.Workloads || [];
        var existing = _.find(this.editingUser.Workloads, 'UserId', this.newUser.Id);
        if (existing) {
            this.errMessage = "Bu saatler için çalışanın iş planlaması yapılmış gözüküyor. Değiştirmek için önce aşağıdaki listeden lütfen çalışanı silin";
            return;
        }

        this.newWorkload.UserId = this.newUser.Id;
        this.newWorkload['Display'] = this.newUser.Display;
        this.editingUser.Workloads.push(this.newWorkload);
        this.newWorkload = <Entity.UserWorkLoad>{
            Workload: 100
        };
        this.userSearch = undefined;
        
    }

    removeWorkload(wl) {
        var found = this.editingUser.Workloads.indexOf(wl);
        this.editingUser.Workloads.splice(found, 1);
    }

    ensureUserNames(workloads: Entity.UserWorkLoad[]): ng.IPromise<any> {
        var promises: { [id: string]: ng.IPromise<any> } = {};
        var queryList = [];
        workloads.forEach((wl) => {
            if (!wl['Display'])
                queryList.push(wl.UserId);
        });
        if (queryList.length)
            promises['query'] = this.$Service.Call<Array<Entity.CompanyUser>>('GetUsers', { companyId: this.companyId }, {
                List: queryList
            }).then((result) => {
                workloads.forEach((wl) => {
                    debugger;
                    if (!wl['Display'])
                        wl['Display'] = _.find(result, 'Id', wl.UserId).Display;
                });
            });
        return $q.all(promises);
    }

    editUser(user: Entity.TimeBasedUsers, day) {
        this.editingDay = day;
        this.editingUser = user ? angular.copy(user) : <Entity.TimeBasedUsers>{};
        this.originalUser = user;
        this.newWorkload = <Entity.UserWorkLoad>{
            Workload: 100
        };
        var workLoads = (user && user.Workloads) || [];
        if (user)
            user.Workloads = user.Workloads || [];
        this.ensureUserNames(workLoads).then(() => {
            Dialog.Show({
                controller: () => this,
                controllerAs: 'ctrl',
                templateUrl: 'src/UI/TimingUserDialog.html'
            }).finally(() => {

            });
        });
    }

    queryUsers(search: string = undefined) {
        if (!this.$Ready)
            return $q.reject();

        return this.$Service.Call('SearchUsers', {
            companyId: this.companyId,
            search: search
        })
    }

    saveItem() {
        if (!this.originalUser) {
            var timing = this.edit[this.editingDay];
            if (timing) {
                timing.Users.push(this.editingUser);
            }
            else {
                var newTiming = <Entity.TimingInfo> {
                    Users: [this.editingUser]
                };
                this.edit[this.editingDay] = newTiming;
            }

        } else angular.copy(this.editingUser, this.originalUser);
        this.$Dirty = true;
        this.CloseDialog();
    }

    CloseDialog() {
        Dialog.Hide();
    }

    newTimingForDay(day: number) {
        this.editUser(null, day);
    }

    makeAsPrevious(day: number) {
        var existing = this.edit[day];
        existing.Users = [];
    }

    removePlan(user, day) {
        var found = this.edit[day].Users.indexOf(user);
        this.edit[day].Users.splice(found, 1);
        this.$Dirty = true;
    }

    constructor(scope: ng.IScope) {
        super(scope);
        this.DayNames = {};
        this.DayNames[0] = "Pazar";
        this.DayNames[1] = "Pazartesi";
        this.DayNames[2] = "Salı";
        this.DayNames[3] = "Çarşamba";
        this.DayNames[4] = "Perşembe";
        this.DayNames[5] = "Cuma";
        this.DayNames[6] = "Cumartesi";
    }

    initialize() {

        var thisDay = new Date(Date.now()).getDay();
        for (var i = 0; i < 7; i++) {
            if (!this.edit[i])
                this.edit[i] = <Entity.TimingInfo> {
                    Users: []
                }
        }


        return super.initialize();
    }
}

@Meta.Directive('timing')
export class Timing {
    controllerAs = 'ctrl';
    controller = TimingController;
    scope = {};
    bindToController = {
        edit: '=',
        companyId: '=company',
        $Dirty: '=dirty'
    }

    static $Factory(): Timing {
        return new Timing();
    }

    link(scope: any, element: any, attrs: angular.IAttributes, controller) {

    }

    public templateUrl = 'src/UI/Timing.html';

    constructor() {

    }
}