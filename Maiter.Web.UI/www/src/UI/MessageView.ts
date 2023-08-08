/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/lodash/lodash.d.ts" />
/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {$q, $filter} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {ControllerBase} from '../Kalitte/UI/ControllerBase';
import {Entity} from '../Data/Models';
import {Dialog} from '../Kalitte/UI/Web/DialogService';
import { Remote} from '../Kalitte/Data/RemoteService';
import { ViewModels} from '../Data/Models';
import { Session } from '../Core/Session/SessionService';

class MessageViewController extends ControllerBase {

    message: ViewModels.Messaging.ClientMessage<ViewModels.Messaging.MessageBase>;
    me: string;
    MessageState = ViewModels.Messaging.MessageState;
    AvailableRequests: {
        [id: string]: ViewModels.Mobile.RequestType
    } = {}

    formatRequest() {
        var msg = <ViewModels.Messaging.CustomerRequestMessage>this.message.MessageContent;
        var msgType = this.AvailableRequests[msg.RequestType];
        if (msgType) {
            var values = angular.copy(msg.RequestContent);
            for (var key in values) {
                if (angular.isString(values[key]))
                    values[key] = $filter('translate')(values[key]);
            }
            try {
                return sprintf(msgType.FormatString.Value, values);
            } catch (e) {
                return JSON.stringify(msg.RequestContent);
            }
        } else return JSON.stringify(msg.RequestContent);
    }

    constructor(scope: ng.IScope) {
        super(scope);
        var list = Session.Worker ? Session.Worker.InitData.AvailableRequests :
            Session.Customer.InitData.AvailableRequests;
        list.forEach((item) => {
            this.AvailableRequests[item.Name] = item;
            
        })
    }
}

@Meta.Directive('messageView')
export class MessageView {
    controllerAs = 'ctrl';
    controller = MessageViewController;
    scope = {};
    bindToController = {
        message: '=',
        me:'@'
    }

    static $Factory(): MessageView {
        return new MessageView();
    }

    link(scope: any, element: any, attrs: angular.IAttributes, controller) {

    }

    public templateUrl = 'src/UI/MessageView.html';

    constructor() {
    }
}