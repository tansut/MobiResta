/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {Meta} from '../../../Kalitte/Core/Meta';
import {$timeout, $location, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {AnonymousPrincipal} from '../../../Kalitte/Core/Principal';
import {WorkerSession } from '../../../Core/Session/WorkerSession';
import { Session } from '../../../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';
import { ViewModels } from '../../../Data/Models';
import {List} from '../../../Kalitte/Core/List';
import {Dictionary} from '../../../Kalitte/Core/Dictionary';

@Meta.Controller('WorkerHomeController')
export class HomeController extends ControllerBase {
    Session = Session;
    InitData: ViewModels.Mobile.WorkerCheckInResponse;
    RolesView: Array<string>;
    ServiceKinds = ViewModels.Company.ServiceKind;

    public static ControllerName = 'WorkerHomeController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.worker.home', {
            url: '/home',
            templateUrl: "src/mobile/Worker/Common/Home.html",
            controller: HomeController.ControllerName + ' as ctrl',
            controllerAs: 'ctrl',
            data: { title: 'Restaurant Çalışanı' }
        });
    }

    hasMessage(list: List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>) {
        return list && list.Items.length;
    }

    beforeEnter() {
        if (!Session.Worker) {
            $state.go('app.worker.companyselect');
            throw new Error('Worker session required');
        }
        super.beforeEnter();
    }

    initialize() {

        this.InitData = Session.Worker.InitData;
        this.RolesView = new Array<string>();
        for (var key in ViewModels.Company.ServiceKind) {
            if ((/^[0-9]+$/).test(key))
                continue;
            var enumVal = ViewModels.Company.ServiceKind[key];
            if (this.InitData.Roles.indexOf(parseInt(enumVal)) >= 0)
                this.RolesView.push(key);
        }
        return super.initialize();
    }
}   