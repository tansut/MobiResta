/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="./RequestController.ts" />


import {BillRequest} from '../request/BillRequest';
import {RequestController} from './RequestController';

export class BillRequestController extends RequestController<BillRequest> {
	constructor($scope: ng.IScope) {
		super(BillRequest, $scope);
	}

	go(form) {
		if (form.$valid) {
			var request = this.request;
			return super.go();
		}
	}
}
