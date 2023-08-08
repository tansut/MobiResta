/// <reference path="../../ref/angularjs/angular.d.ts" />

import {BillRequest as RequestType} from '../../Core/Request/BillRequest';
import {RequestController} from '../../UI/RequestController';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('BillRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/BillRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class BillRequestController extends RequestController<RequestType> {

    PaymentTypes = RequestType.PaymentType;

	constructor($scope: ng.IScope) {
        super(RequestType, $scope);
	}

	go(form) {
		if (form.$valid) {
			var request = this.request;
			return super.go();
		}
	}
}
