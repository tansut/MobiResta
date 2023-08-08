/// <reference path="../ref/angularjs/angular.d.ts" />

import {SendMessageRequest} from '../request/SendMessageRequest';
import {Branch, AllBranches} from '../request/Branch';
import {BaseController} from '../shared/BaseController';
import {CustomerSessionData, CustomerSession} from '../lib/CustomerSession';
import {$stateParams, $q, $log, $state} from '../shared/Common';




export class HomeController extends BaseController {
	static $inject = ['$scope'];
	public branchList: [Branch];
	public session: CustomerSession;
	loginLogOffTitle: string;
	
	constructor($scope: ng.IScope) {
		super($scope);
		this.branchList = AllBranches.Items;
	}
	
	loginOrLogOff() {
		if (this.session.active) {
			this.errorHandled(this.session.disconnect('user').then(()=> {
				$state.reload();
			}));
		} else {
			CustomerSession.ensureCustomerSession();
		}
	}
	
	beforeEnter() {
		this.session = CustomerSession.getInstance();
		this.loginLogOffTitle = this.session.active ? "Çıkış": "Giriş";
		return super.beforeEnter();
		
	}

	aboutNavigate($event) {
		//if (!Services.AppUtil.ensureCustomerSession()) {
				
		//$event.preventDefault(); 
		//$event.stopPropagation();
		//	return false; 
		//	}
	}
}