/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Meta} from '../../../Kalitte/Core/Meta';
import {ViewModels} from '../../../Data/Models';
import {$q, $state} from '../../../Kalitte/Vendor/AngularService';
import {CustomerRequestControllerBase} from '../../../Core/CustomerRequestController';
import {Session} from '../../../Core/Session/SessionService';

@Meta.Controller('PayRequestController',
    {
        state:
        {
            name: 'app.customer.request.pay',
            MobileControllerAs: true,
            url: '/pay/:targetService/:title',
            templateUrl: 'src/mobile/Customer/Requests/pay.html'
        }
    })
export class PayRequestController extends CustomerRequestControllerBase<ViewModels.Mobile.RequestTypes.PayRequest> {
    PaymentTypes = ViewModels.Mobile.RequestTypes.PaymentType;

    createClientMessage(response: ViewModels.Messaging.RequestResponse, bag: ViewModels.Mobile.RequestTypes.RequestBag<any>): ViewModels.Messaging.ClientMessage<any> {
        var message = super.createClientMessage(response, bag);
        var requestMessage = <ViewModels.Messaging.CustomerRequestMessage>message.MessageContent;
        requestMessage.RequestType = this.RequestTypeName;
        requestMessage.RequestContent = bag.RequestContent;
        var payRequest = <ViewModels.Mobile.RequestTypes.PayRequest>bag.RequestContent;        
        return message;
    }

    createRequest() {
        return <ViewModels.Mobile.RequestTypes.PayRequest>{
            Payment: ViewModels.Mobile.RequestTypes.PaymentType[ViewModels.Mobile.RequestTypes.PaymentType.Cash]
        }
    }

    constructor(scope: ng.IScope) {
        super(scope, ViewModels.Mobile.RequestTypes.PayRequest.RequestType);
        
    }
}