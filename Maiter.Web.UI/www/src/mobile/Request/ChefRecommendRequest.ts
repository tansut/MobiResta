/// <reference path="../../ref/angularjs/angular.d.ts" />



import {ChefRecommendRequest as RequestType} from '../../Core/Request/ChefRecommendRequest';
import {RequestController} from '../../UI/RequestController';
import {ContentRequestController} from './ContentRequest';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('ChefRecommendRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/ChefRecommendRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class ChefRecommendRequestController extends ContentRequestController<RequestType> {
	constructor($scope: ng.IScope) {
        super(RequestType, $scope);
	}

}
