/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../ref/util/toaster.d.ts" />
/// <reference path="../ref/ionic/ionic.d.ts"/>

export class BaseController {
	public $loading: any;
	public $ionicPopup: Ionic.IPopup;

	private toaster: ngtoaster.IToasterService;
	private $ionicPlatform : any;

	getService(name: string) {
		var injector = angular.element(document).injector();
		return injector.get(name);
	}

	beforeEnter() {

	}

	handleError(err) {
		alert(angular.isString(err) ? err : (err.message || 'Bilinmeyen hata'));
	}

	showLoading(msg, promise) {
		var options = angular.isObject(msg) ? msg : {};
		if (angular.isString(msg))
			options.template = msg;

		this.$loading.show(options);

		if (promise) {
			promise.finally(() => {
			   this.$loading.hide();
			})
		}
	}

	alert(content: string, title?: string) {
		title = title || 'Bilgi';
		return this.toaster.info(title || 'Bilgi', content);
	}

	error(content:string , title? :string){
		title = title || 'Hata';
		this.toaster.error(title, content);
	}

	confirm(content: string, title?: string) {
		return this.$ionicPopup.confirm({
			title: title || 'Onay',
			template: content
		});
	}

	errorHandled(promise: ng.IPromise<any>) {
		promise.catch((err) => {
			this.error('İşlem başarısız. ' + err.message ? err.message : '');
		});

		return promise;
	}

	constructor(private $scope?: ng.IScope) {
		this.$loading = this.getService('$ionicLoading');
		this.$ionicPopup = this.getService('$ionicPopup');
		this.toaster = this.getService('toaster');
		this.$ionicPlatform = this.getService('$ionicPlatform');

		if (!$scope)
			console.log('Scope is not available to controller ' + this.constructor['name'] + '. $scope.$on may not work as expected.');
		else {
			var enterCalled = true;
			this.$scope = $scope;
			this.$scope.$on('$ionicView.beforeEnter', () => {
				this.beforeEnter();
			});
		}
	}
}