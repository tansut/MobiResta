/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-material/angular-material.d.ts" />
/// <reference path="../../ref/ionic/ionic.d.ts" />
/// <reference path="../../ref/util/toaster.d.ts" />

import {Meta} from '../Core/Meta';
import {BaseService} from '../Core/BaseService';

	
export var Ionic: IonicService;

export var $ionicScrollDelegate: Ionic.IScrollDelegate;
export var $toaster: ngtoaster.IToasterService;
export var $ionicPlatform: Ionic.IPlatform;
export var $loading: Ionic.ILoading;
export var $ionicPopup: Ionic.IPopup;
export var $ionicHistory: any;
export var $ionicTabsDelegate: Ionic.ITabsDelegate;



@Meta.Service('IonicService')
export class IonicService extends BaseService {

    static InstanceReady(instance) {
        Ionic = instance;
    }

    static $inject = ['$ionicScrollDelegate', 'toaster', '$ionicPlatform', '$ionicLoading', '$ionicPopup', '$ionicHistory', '$ionicTabsDelegate'];

    constructor(public ionicScrollDelegate, public _toaster, public ionicPlatform, public ionicLoading, public ionicPopup, public ionicHistory, public ionicTabsDelegate) {
        super();
        Ionic = this;
        $ionicScrollDelegate = ionicScrollDelegate;
        $toaster = _toaster;
        $ionicPlatform = ionicPlatform;
        $loading = ionicLoading;
        $ionicPopup = ionicPopup;
        $ionicHistory = ionicHistory;
        $ionicTabsDelegate = ionicTabsDelegate;
	}
}