/// <reference path="../../ref/angularjs/angular.d.ts" />



import {WaiterRequest as RequestType} from '../../Core/Request/WaiterRequest';
import {RequestController} from '../../UI/RequestController';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('WaiterRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/WaiterRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class WaiterRequestController extends RequestController<RequestType> {
	constructor($scope: ng.IScope) {
        super(RequestType, $scope);
	}

	go() {
		var request = this.request;
		return super.go();
	}
}
