/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-material/angular-material.d.ts" />

import {Meta} from '../Core/Meta';
import {BaseService} from '../Core/BaseService';
	
export var Material: MaterialService;
export var $mdSidenav: angular.material.MDSidenavService;
export var $mdDialog: angular.material.MDDialogService;
export var $mdToast: angular.material.MDToastService;
export var $mdBottomSheet: angular.material.MDBottomSheetService;

export var $mdUtil: any;

@Meta.Service('MaterialService')
export class MaterialService extends BaseService {

    static InstanceReady(instance: BaseService) {
        Material = <MaterialService>instance;
    }

    static $inject = ['$mdSidenav', '$mdDialog', '$mdToast', '$mdUtil', '$mdBottomSheet'];

    constructor(public mdSidenav, public mdDialog, public mdToast, public mdUtil, public mdBottomSheet) {
        super();
		Material = this;
		$mdSidenav = mdSidenav;
		$mdDialog = mdDialog;
		$mdToast = mdToast;
        $mdUtil = mdUtil;
        $mdBottomSheet = mdBottomSheet;
	}
}