/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/ionic/ionic.d.ts" />

import {BaseController} from '../shared/BaseController';
import {RequestBase} from '../shared/RequestBase';
import {$stateParams, $q, $log, $state} from '../shared/Common';
import {Branch, AllBranches} from '../request/Branch';
import {CustomerSession} from '../lib/CustomerSession';

export class RequestController<T extends RequestBase> extends BaseController {
	static $inject = ['$scope'];
	public branch: Branch;
	public request: T;
	public requestMeta: Object;
	public session: CustomerSession;


	sendRequest() {
		return this.session.sendRequest(this.branch, this.request);
	}

	createRequest<T>(c: { new (): T; }): T {
		return new c();
	}

	init() {
		this.branch = AllBranches.getBranch($stateParams['branch']);
		var typeKey = $state.current.url.split('-')[1];
		this.request = this.createRequest<T>(this.requestClass);
		this.requestMeta = this.request.getMeta();
		this.session = CustomerSession.getInstance();
	}

	beforeEnter() {
		if (CustomerSession.ensureCustomerSession()) {
			this.init();
			return true;
		} else return false;
	}

	go(changeState: boolean = true) {
		return this.errorHandled(this.sendRequest().then(() => {
			if (changeState) {
				return $state.go('app.chatlist', {
					branch: this.branch.type,
					notify: sprintf('Talebiniz %s iletildi.', this.branch.toTitle)
				});
			}
		}));
	}

	constructor(private requestClass: any, $scope: ng.IScope) {
		super($scope);
	}
}