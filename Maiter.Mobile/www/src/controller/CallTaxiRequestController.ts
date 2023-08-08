/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="./RequestController.ts" />


import {CallTaxiRequest} from '../request/CallTaxiRequest';
import {RequestController} from './RequestController';
import {Notification} from '../shared/RequestBase';

export class CallTaxiRequestController extends RequestController<CallTaxiRequest> {
	public Notification = Notification;
	
	constructor($scope: ng.IScope) {
		super(CallTaxiRequest, $scope);
	}

	go(form) {
		if (form.$valid) {
			var request = this.request;
			return super.go();
		}
	}
}