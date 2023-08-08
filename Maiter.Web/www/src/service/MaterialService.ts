/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-material/angular-material.d.ts" />
	
export var Material: MaterialService;
export var $mdSidenav: angular.material.MDSidenavService;
export var $mdDialog: angular.material.MDDialogService;
export var $mdToast: angular.material.MDToastService;
export var $mdUtil: any;

//export var $mdThemingProvider: angular.material.MDThemingProvider;

export class MaterialService {

	static $inject = [	'$mdSidenav', '$mdDialog', '$mdToast', '$mdUtil'];

	constructor(public mdSidenav, public mdDialog, public mdToast, public mdUtil) {
		Material = this;
		$mdSidenav = mdSidenav;
		$mdDialog = mdDialog;
		$mdToast = mdToast;
		$mdUtil = mdUtil;
	}
}