/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../ref/ionic/ionic.d.ts" />
/// <reference path="../ref/util/toaster.d.ts" />
	
export var Common: CommonService;

export var $q: angular.IQService;
export var $rootScope: angular.IRootScopeService;
export var $state: angular.ui.IStateService;
export var $timeout: angular.ITimeoutService;
export var $stateParams: angular.ui.IStateParamsService;
export var $log: angular.ILogService;
export var $http: angular.IHttpService;
export var $ionicScrollDelegate: Ionic.IScrollDelegate;
export var toaster: ngtoaster.IToasterService;
export var $ionicPlatform: Ionic.IPlatform;

export class CommonService {

	static $inject = [	'$q', '$rootScope', '$state', '$timeout', 
						'$stateParams', '$log', '$http','$ionicScrollDelegate',
						'toaster', '$ionicPlatform'];

	constructor(public q: angular.IQService,
		public rootScope: angular.IRootScopeService,
		public state: angular.ui.IStateService,
		public timeout: angular.ITimeoutService,
		public stateParams: angular.ui.IStateParamsService,
		public log: angular.ILogService,
		public http: angular.IHttpService,
		public ionicScrollDelegate : Ionic.IScrollDelegate,
		public _toaster : ngtoaster.IToasterService,
		public ionicPlatform : Ionic.IPlatform) {
			Common = this;
			$q = q;
			$rootScope = rootScope;
			$state = state;
			$timeout = timeout;
			$stateParams = stateParams;
			$log = log;
			$http = http;
			$ionicScrollDelegate = ionicScrollDelegate;
			toaster = _toaster;
			$ionicPlatform = ionicPlatform;
	}
}