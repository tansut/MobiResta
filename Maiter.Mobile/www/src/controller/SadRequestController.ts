/// <reference path="../ref/angularjs/angular.d.ts" />


import {SadRequest} from '../request/SadRequest';
import {RequestController} from './RequestController';
import {Branch, AllBranches} from '../request/Branch';

export class SadRequestController extends RequestController<SadRequest> {
	branchList: Array<Branch> = new Array<Branch>();
	constructor($scope: ng.IScope) {
		super(SadRequest, $scope);
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
