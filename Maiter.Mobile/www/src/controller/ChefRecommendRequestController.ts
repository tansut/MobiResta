/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="./RequestController.ts" />


import {ChefRecommendRequest} from '../request/ChefRecommendRequest';
import {RequestController} from './RequestController';
import {ContentRequestController} from './ContentRequestController';

export class ChefRecommendRequestController extends ContentRequestController<ChefRecommendRequest> {
	constructor($scope: ng.IScope) {
		super(ChefRecommendRequest, $scope);
	}

}
