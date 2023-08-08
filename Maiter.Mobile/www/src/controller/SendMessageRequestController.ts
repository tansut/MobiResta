/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />

import {BaseController} from '../shared/BaseController';
import {RequestBase} from '../shared/RequestBase';
import {$stateParams, $q, $log, $state} from '../shared/Common';
import {Branch, AllBranches} from '../request/Branch';
import {CustomerSession} from '../lib/CustomerSession';
import {RequestController} from './RequestController';
import {SendMessageRequest} from '../request/SendMessageRequest';
import {RequestTemplates, RequestTemplate} from '../request/RequestTemplates';



export class SendMessageRequestController extends RequestController<SendMessageRequest> {
	public templates: RequestTemplate;
	public activeList: [string];

	constructor($scope: ng.IScope) {
		super(SendMessageRequest, $scope);
	}

	sendMessage(item: string) {
		this.request.text = item;
		return super.go();
	}

	beforeEnter() {
		var sessionInited = super.beforeEnter();
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
