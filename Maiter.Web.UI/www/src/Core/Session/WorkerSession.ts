import {UserSession} from './UserSession';
import {ViewModels} from '../../Data/Models';
import {List} from '../../Kalitte/Core/List';
import {Dictionary} from '../../Kalitte/Core/Dictionary';
import {Account} from '../../Kalitte/Data/AccountService';


export class WorkerSession extends UserSession {
    InitData: ViewModels.Mobile.WorkerCheckInResponse;
    RoleMessages: Dictionary<string, Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>>;

    CustomerRequestMessage(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.CustomerRequestMessage>) {
        this.addToMessageList(message);
    }



    addToMessageList(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) {

        var fromService = message.MessageContent.FromUserId == Account.principal.identity.UserName ?
            message.MessageContent.ToService:
            message.MessageContent.FromService;

        var fromUserId = message.MessageContent.FromUserId == Account.principal.identity.UserName ?
            message.MessageContent.ToUserId :
            message.MessageContent.FromUserId;

        var catList = this.RoleMessages.Get(fromService);
        if (catList == null)
            throw new Error('unknown worker message source ' + fromService);
        var list = this.Messages.Get(fromService);
        list.Add(message);

        var userLst = catList.Get(fromUserId);
        if (userLst == null) {
            userLst = new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>()
            catList.Add(fromUserId, userLst);
        }

        userLst.Add(message);

        this.setAckMessages(message);
    }

    constructor(InitData: ViewModels.Mobile.WorkerCheckInResponse) {
        super(InitData);
        this.Messages.Add(ViewModels.Company.ServiceKind.Waiter, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());
        this.Messages.Add(ViewModels.Company.ServiceKind.CRM, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());
        this.Messages.Add(ViewModels.Company.ServiceKind.Vale, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());
        this.Messages.Add(ViewModels.Company.ServiceKind.Customer, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());


        
        this.RoleMessages = new Dictionary<string, Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>>();
        this.RoleMessages.Add(ViewModels.Company.ServiceKind.CRM, new Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>());
        this.RoleMessages.Add(ViewModels.Company.ServiceKind.Waiter, new Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>());
        this.RoleMessages.Add(ViewModels.Company.ServiceKind.Vale, new Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>());
        //this.RoleMessages.Add(ViewModels.Company.ServiceKind.Other, new Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>());
        this.RoleMessages.Add(ViewModels.Company.ServiceKind.Customer, new Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>());

    }
}