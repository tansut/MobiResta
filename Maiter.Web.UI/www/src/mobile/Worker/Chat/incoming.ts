import {Meta} from '../../../Kalitte/Core/Meta';
import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {AnonymousPrincipal} from '../../../Kalitte/Core/Principal';
import {WorkerSession } from '../../../Core/Session/WorkerSession';
import { Session } from '../../../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';
import { ViewModels } from '../../../Data/Models';
import {List} from '../../../Kalitte/Core/List';
import {Dictionary} from '../../../Kalitte/Core/Dictionary';

@Meta.Controller('WorkerIncomingMessageController', {
    state: {
        name: 'app.worker.incoming', url: '/incoming/:fromService', MobileControllerAs: true, templateUrl: 'src/mobile/Worker/Chat/incoming.html', data: { title: 'Chat', authenticated: true }
    }
})

export class WorkerIncomingMessageController extends ControllerBase {
    MessageUsers: Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>;
    Sources: Array<string>;
    ServiceKinds = ViewModels.Company.ServiceKind;
    Session = Session;

    beforeEnter() {
        if (!Session.Worker) {
            $state.go('app.worker.companyselect', {
                returnState: $state.current.name,
                returnStateParams: angular.copy($stateParams)
            });
            throw new Error('Session required');
        }
        super.beforeEnter();
    }
    initialize() {
        

        this.Sources = new Array<string>();
        if ($stateParams['fromService'])
            this.Sources.push($stateParams['fromService'])
        else for (var key in Session.Worker.RoleMessages.Items)
            this.Sources.push(this.ServiceKinds[key]);       
        return super.initialize();
    }
}