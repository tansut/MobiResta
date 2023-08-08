/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {Meta} from '../../Kalitte/Core/Meta';
import { RequestBase } from '../../Core/RequestBase';
import {$stateParams, $q, $log, $state} from '../../Kalitte/Vendor/AngularService';
import {Branch, AllBranches} from '../../Core/Request/Branch';

import {CustomerSession} from '../../Core/CustomerSession';
import {RequestController} from '../../UI/RequestController';
import {SendMessageRequest as RequestType} from '../../Core/Request/SendMessageRequest';
import {RequestTemplates, RequestTemplate} from '../../Core/Request/RequestTemplates';

@Meta.Controller('SendMessageRequestController', { state: { MobileControllerAs: true, name: 'app.request.' + RequestType.type, templateUrl: 'src/Mobile/Request/SendMessageRequest.html', url: "/{branch}/request-" + RequestType.type } })
export class SendMessageRequestController extends RequestController<RequestType> {
	public templates: RequestTemplate;
	public activeList: [string];

	constructor($scope: ng.IScope) {
        super(RequestType, $scope);
	}

	sendMessage(item: string) {
		this.request.text = item;
		return super.go();
	}

	initialize() {
		var sessionInited = super.initialize();
		if (sessionInited) {
			this.templates = RequestTemplates.Templates;
			this.activeList = this.templates[this.branch.type];
			if (!this.activeList) {
				$state.go('app.chatlist', {
					branch: $stateParams['branch']
				});
				return false;
			} else return true;
		}
	}
}
