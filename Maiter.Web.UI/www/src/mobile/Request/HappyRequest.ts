/// <reference path="../../ref/angularjs/angular.d.ts" />


import {HappyRequest as RequestType} from '../../Core/Request/HappyRequest';
import {RequestController} from '../../UI/RequestController';
import {Branch, AllBranches} from '../../Core/Request/Branch';

import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('HappyRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/HappyRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class HappyRequestController extends RequestController<RequestType> {
	branchList: Array<Branch> = new Array<Branch>();
	constructor($scope: ng.IScope) {
        super(RequestType, $scope);
	}
	
	initialize() {
		this.branchList.length = 0;
		AllBranches.Items.forEach((element) => {
			this.branchList.push(element)
		}, this);
		
		return super.initialize();
	}

	go() {
		var request = this.request;
		return super.go();
	}
}
