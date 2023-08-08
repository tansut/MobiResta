import {ChatListController} from '../../../Core/ChatController';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Session} from '../../../Core/Session/SessionService';
import {ViewModels} from '../../../Data/Models';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';
import {Account} from '../../../Kalitte/Data/AccountService';



@Meta.Controller('CustomerChatListController', {
    state: {
        name: 'app.customer.chat',
        url: '/chat/:fromService/:targetService',
        MobileControllerAs: true,
        templateUrl: 'src/mobile/Customer/Chat/List.html',
        data: { title: 'Chat', authenticated: true },
        params: {
            highlight: null,
            ChatUserId: null,
            ChatUserName: null
        }
    }
})

export class CustomerChatList extends ChatListController {

    UserSession = Session.Customer;

    
    createMessageList() {
        this.List = this.UserSession.Messages.Get(this.TargetService);
    }

    beforeEnter() {
        if (!Session.Customer) {
            $state.go('app.customer.initSession', {
                returnState: $state.current.name,
                returnStateParams: angular.copy($stateParams)
            });
            throw new Error('Session required');
        }
        super.beforeEnter();
        if (Account.principal.isAuthenticated && Session.Customer) {
            this.RequestType = _.find(Session.Customer.InitData.AvailableRequests, "Name", this.RequestTypeName);
        }
    }



    

    createRequestBag(): ViewModels.Mobile.RequestTypes.RequestBag<any> {
        var result = super.createRequestBag();
        result.CheckInId = Session.Customer.InitData.CheckId;
        result.CompanyId = Session.Customer.InitData.CompanyId;
        result.CompanySectionId = Session.Customer.InitData.SectionId;
        result.TableId = Session.Customer.InitData.TableId;
        return result;
    }
}