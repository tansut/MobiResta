/// <reference path="../ref/angularjs/angular.d.ts" />


import {HappyRequest} from '../request/HappyRequest';
import {RequestController} from './RequestController';
import {Branch, AllBranches} from '../request/Branch';

export class HappyRequestController extends RequestController<HappyRequest> {
	branchList: Array<Branch> = new Array<Branch>();
	constructor($scope: ng.IScope) {
		super(HappyRequest, $scope);
	}
	
	beforeEnter() {
		this.branchList.length = 0;
		AllBranches.Items.forEach((element) => {
			this.branchList.push(element)
		}, this);
		
		return super.beforeEnter();
	}

	go() {
		var request = this.request;
		return super.go();
	}
}
