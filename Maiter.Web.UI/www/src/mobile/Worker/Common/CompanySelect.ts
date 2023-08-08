/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {Meta} from '../../../Kalitte/Core/Meta';
import {$timeout, $location, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {AnonymousPrincipal} from '../../../Kalitte/Core/Principal';
import {WorkerSession } from '../../../Core/Session/WorkerSession';
import {Session } from '../../../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';
import { ViewModels } from '../../../Data/Models';


@Meta.Controller('CompanySelectController')
export class CompanySelectController extends ControllerBase {

    WorkerInfo = <ViewModels.Account.WorkerInfo>Account.principal.userData;

    public static ControllerName = 'CompanySelectController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.worker.companyselect', {
            url: '/companyselect',
            templateUrl: "src/mobile/Worker/Common/CompanySelect.html",
            controller: CompanySelectController.ControllerName + ' as ctrl',
            controllerAs: 'ctrl',
            data: { title: '' },
            params: { returnState: null, returnStateParams: null }
        });
    }

    selectCompany(company: ViewModels.Account.WorkerCompanyInfo) {
        this.WorkerInfo.DefaultCompanyId = company.CompanyId;
        this.errorHandled(Session.CreateWorkerSession(<ViewModels.Mobile.RequestTypes.CheckInRequest>{
            Tag: null
        }, company.CompanyId).then(() => {
                if ($stateParams['returnState'])
                    $state.go($stateParams['returnState'], $stateParams['returnStateParams']);
                else $state.go('app.worker.home');
        }))
    }

    asCustomer() {
        $state.go("app.customer.home");
    }

    initialize() {
        return super.initialize();
    }
}