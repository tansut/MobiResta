/// <reference path="../../ref/angularjs/angular.d.ts" />



import {CallTaxiRequest as RequestType} from '../../Core/Request/CallTaxiRequest';
import {RequestController} from '../../UI/RequestController';
import {Notification} from'../../Core/RequestBase';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('CallTaxiRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/CallTaxiRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class CallTaxiRequestController extends RequestController<RequestType> {
	public Notification = Notification;
	
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