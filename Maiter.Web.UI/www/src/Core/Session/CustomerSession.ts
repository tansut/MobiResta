import {UserSession} from './UserSession';
import {ViewModels} from '../../Data/Models';
import { Session } from './SessionService';
import {List} from '../../Kalitte/Core/List';
import {Dictionary} from '../../Kalitte/Core/Dictionary';
import {Account} from '../../Kalitte/Data/AccountService';
import {ShoppingCardItem, ShoppingCard} from '../ShoppingCard';

export class CustomerSession extends UserSession {
    InitData: ViewModels.Mobile.CustomerCheckInResponse;
    SessionType: ViewModels.Mobile.CustomerSessionType;
    ShoppingCard: ShoppingCard;
    public Messages: Dictionary<string, List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>>;

    AvailableFoods: { [id: string]: ViewModels.Mobile.MenuFoodViewModel } = {}    

    addToMessageList(message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>) {

        var list = message.MessageContent.FromUserId != Account.principal.identity.UserName ?
            this.Messages.Get(message.MessageContent.FromService) :
            this.Messages.Get(message.MessageContent.ToService);
        if (list) {
            list.Add(message);
            this.setAckMessages(message);
        } else throw new Error('Unknown customer message source ' + message.MessageContent.FromService);
    }

    setupInitData(data: ViewModels.Mobile.CustomerCheckInResponse) {
        var menus = data.Menu;
        menus.forEach((menu) => {
            menu.Sections.forEach((section) => {
                section.Menu = menu;
                section.Foods.forEach((food) => {
                    food.Section = section;
                    this.AvailableFoods[food.Id] = food;
                    if (food.RichDesc)
                        food.RichDesc = '<p>' + food.RichDesc.replace(/\n([ \t]*\n)+/g, '</p><p>')
                            .replace('\n', '<br />') + '</p>';
                    food.Tags.forEach((tag) => {
                        if (menu.AllTags.indexOf(tag) < 0)
                            menu.AllTags.push(tag);
                        if (section.AllTags.indexOf(tag) < 0)
                            menu.AllTags.push(tag);
                    });
                });
            });
        });
        return data;
    }

    

    constructor(InitData: ViewModels.Mobile.CustomerCheckInResponse) {
        super(InitData);
        this.SessionType = InitData.SessionType;
        this.InitData = this.setupInitData(InitData);
        if (!InitData.CompanyAttachments.length) {

        }
        this.ShoppingCard = new ShoppingCard(InitData.Menu, this.AvailableFoods);
        this.Messages.Add(ViewModels.Company.ServiceKind.Waiter, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());
        this.Messages.Add(ViewModels.Company.ServiceKind.CRM, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());
        this.Messages.Add(ViewModels.Company.ServiceKind.Vale, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());

        //this.Messages.Add(ViewModels.Company.ServiceKind.Other, new List<ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>>());
    }

}