/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="./RequestController.ts" />


import {WirelessRequest} from '../request/WirelessRequest';
import {RequestController} from './RequestController';
import {ContentRequestController} from './ContentRequestController';

export class WirelessRequestController extends ContentRequestController<WirelessRequest> {
	constructor($scope: ng.IScope) {
		super(WirelessRequest, $scope);
	}

}
