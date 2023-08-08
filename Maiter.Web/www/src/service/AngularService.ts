/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />
	
export var Angular: AngularService;

export var $q: angular.IQService;
export var $rootScope: angular.IRootScopeService;
export var $state: angular.ui.IStateService;
export var $timeout: angular.ITimeoutService;
export var $stateParams: angular.ui.IStateParamsService;
export var $log: angular.ILogService;
export var $http: angular.IHttpService;
export var $location: angular.ILocationService;

export class AngularService {

	static $inject = [	'$q', '$rootScope', '$state', '$timeout', 
						'$stateParams', '$log', '$http', '$location'];

	constructor(public q: angular.IQService,
		public rootScope: angular.IRootScopeService,
		public state: angular.ui.IStateService,
		public timeout: angular.ITimeoutService,
		public stateParams: angular.ui.IStateParamsService,
		public log: angular.ILogService,
		public http: angular.IHttpService,
		public location: angular.ILocationService) {
            Angular = this;
			$q = q;
			$rootScope = rootScope;
			$state = state;
			$timeout = timeout;
			$stateParams = stateParams;
			$log = log;
			$http = http;
			$location = location;
	}
}