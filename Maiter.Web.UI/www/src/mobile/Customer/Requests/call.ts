/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Meta} from '../../../Kalitte/Core/Meta';
import {ViewModels} from '../../../Data/Models';
import {$q, $state} from '../../../Kalitte/Vendor/AngularService';
import {CustomerRequestControllerBase} from '../../../Core/CustomerRequestController';
import {Session} from '../../../Core/Session/SessionService';


@Meta.Controller('CallRequestController',
    {
        state:
        {
            name: 'app.customer.request.call',
            MobileControllerAs: true,
            url: '/call/:targetService/:title',
            templateUrl: 'src/mobile/Customer/Requests/call.html'
        }
    })
export class PayRequestController extends CustomerRequestControllerBase<ViewModels.Mobile.RequestTypes.CallRequest> {
    
    createClientMessage(response: ViewModels.Messaging.RequestResponse, bag: ViewModels.Mobile.RequestTypes.RequestBag<any>): ViewModels.Messaging.ClientMessage<any> {
        var message = super.createClientMessage(response, bag);
        var requestMessage = <ViewModels.Messaging.CustomerRequestMessage>message.MessageContent;
        requestMessage.RequestType = this.RequestTypeName;
        requestMessage.RequestContent = bag.RequestContent;
        return message;
    }

    createRequest() {
        return <ViewModels.Mobile.RequestTypes.CallRequest>{
            
        }
    }

    constructor(scope: ng.IScope) {
        super(scope, ViewModels.Mobile.RequestTypes.CallRequest.RequestType);
    }
}