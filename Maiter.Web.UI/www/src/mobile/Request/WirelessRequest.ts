/// <reference path="../../ref/angularjs/angular.d.ts" />



import {WirelessRequest as RequestType} from '../../Core/Request/WirelessRequest';
import {RequestController} from '../../UI/RequestController';
import {ContentRequestController} from './ContentRequest';

import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('WirelessRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/WirelessRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class WirelessRequestController extends ContentRequestController<RequestType> {
	constructor($scope: ng.IScope) {
        super(RequestType, $scope);
	}

}
