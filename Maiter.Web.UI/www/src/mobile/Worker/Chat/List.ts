import {ChatListController} from '../../../Core/ChatController';
import {Session} from '../../../Core/Session/SessionService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {ViewModels} from '../../../Data/Models';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';


@Meta.Controller('WorkerChatListController', {
    state: {
        name: 'app.worker.chat',
        url: '/chat/:fromService/:targetService',
        MobileControllerAs: true, templateUrl: 'src/Mobile/Worker/Chat/List.html',
        data: { title: 'Chat', authenticated: true },
        params: {
            highlight: null,
            ChatUserId: null,
            ChatUserName: null
        }
    }
})
export class WorkerChatList extends ChatListController {
    UserSession = Session.Worker;

    createMessageList() {
        var roleMessages = this.UserSession.RoleMessages.Get(this.TargetService);
        this.List = roleMessages.Get(this.ChatUserId);

    }

    beforeEnter() {
        if (!Session.Worker) {
            $state.go('app.worker.companyselect', {
                returnState: 'app.worker.incoming',
                returnStateParams: { fromService: 'Customer'}
            });
            throw new Error('Session required');
        }
        super.beforeEnter();
        if (Account.principal.isAuthenticated && Session.Worker) {
            this.RequestType = _.find(Session.Worker.InitData.AvailableRequests, "Name", this.RequestTypeName);
        }
    }

    createRequestBag(): ViewModels.Mobile.RequestTypes.RequestBag<any> {
        var result = super.createRequestBag();
        result.CheckInId = Session.Worker.InitData.CheckId;
        result.CompanyId = Session.Worker.InitData.CompanyId;
        return result;
    }


}