/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="./RequestController.ts" />


import {WaiterRequest} from '../request/WaiterRequest';
import {RequestController} from './RequestController';

export class WaiterRequestController extends RequestController<WaiterRequest> {
	constructor($scope: ng.IScope) {
		super(WaiterRequest, $scope);
	}

	go() {
		var request = this.request;
		return super.go();
	}
}
