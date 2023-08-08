/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />

import {$mdSidenav, $mdDialog, $mdToast} from '../service/MaterialService';
import {$state} from '../service/AngularService';


export class BaseController {
    static $inject = ['$scope'];

    public static ConfigureStates(provider: ng.ui.IStateProvider) {

    }

	getService(name: string) {
		var injector = angular.element(document).injector();
		return injector.get(name);
	}

	handleError(err) {
		alert(angular.isString(err) ? err : (err.message || 'Bilinmeyen hata'));
	}

	showLoading(msg, promise) {

	}

	toast(msg: string, delay?: number) {
		$mdToast.show(
			$mdToast.simple()
				.content(msg)
				.position('top left right')
				.hideDelay(delay || 3000)
			);
	}

	alert(content: string, title?: string) {
		$mdDialog.show(
			$mdDialog.alert()
				.title(title || 'Mesajınız var')
				.content(content)
				.ok('Tamam')
			);
	}

	error(content: string, title?: string) {
		this.alert(content, title || 'İşlem sırasında bir hata oluştu');
	}

	confirm(content: string, title?: string) {
		var confirm = $mdDialog.confirm()
			.title(title || 'Lütfen onaylayın veya iptal edin')
			.content(content)
			.ok('Tamam')
			.cancel('İptal');

		return $mdDialog.show(confirm);
	}

    errorHandled(promise: angular.IPromise<any>) {
		promise.catch((err) => {
			this.error('İşlem başarısız. ' + err.message ? err.message : '');
		});

		return promise;
	}

    constructor(private $scope?: angular.IScope) {
		if (!$scope)
			console.log('Scope is not available to controller ' + this.constructor['name'] + '. $scope.$on may not work as expected.');
		else {
			this.$scope = $scope;
		}
	}
}