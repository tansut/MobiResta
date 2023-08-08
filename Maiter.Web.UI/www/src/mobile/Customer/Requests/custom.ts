/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Meta} from '../../../Kalitte/Core/Meta';
import {ViewModels} from '../../../Data/Models';
import {$q, $state} from '../../../Kalitte/Vendor/AngularService';
import {CustomerRequestControllerBase} from '../../../Core/CustomerRequestController';
import {Session} from '../../../Core/Session/SessionService';


@Meta.Controller('CustomRequestController',
    {
        state:
        {
            name: 'app.customer.request.custom',
            MobileControllerAs: true,
            url: '/custom/:targetService/:title',
            templateUrl: 'src/mobile/Customer/Requests/custom.html'
        }
    })
export class PayRequestController extends CustomerRequestControllerBase<ViewModels.Mobile.RequestTypes.CustomRequest> {

    createClientMessage(response: ViewModels.Messaging.RequestResponse, bag: ViewModels.Mobile.RequestTypes.RequestBag<any>): ViewModels.Messaging.ClientMessage<any> {
        var message = super.createClientMessage(response, bag);
        var requestMessage = <ViewModels.Messaging.CustomerRequestMessage>message.MessageContent;
        requestMessage.RequestType = this.RequestTypeName;
        requestMessage.RequestContent = bag.RequestContent;
        return message;
    }

    createRequest() {
        return <ViewModels.Mobile.RequestTypes.PayRequest>{
            
        }
    }

    constructor(scope: ng.IScope) {
        super(scope, ViewModels.Mobile.RequestTypes.CustomRequest.RequestType);
    }
}