/// <reference path="../../ref/angularjs/angular.d.ts" />



import {CarRequest as RequestType} from '../../Core/Request/CarRequest';
import {RequestController} from '../../UI/RequestController';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('CarRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/CarRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class CarRequestController extends RequestController<RequestType> {
	constructor($scope: ng.IScope) {
        super(RequestType, $scope);
	}

	go() {
		var request = this.request;
		return super.go();
	}
}
