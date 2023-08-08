/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="./RequestController.ts" />


import {CarRequest} from '../request/CarRequest';
import {RequestController} from './RequestController';

export class CarRequestController extends RequestController<CarRequest> {
	constructor($scope: ng.IScope) {
		super(CarRequest, $scope);
	}

	go() {
		var request = this.request;
		return super.go();
	}
}
