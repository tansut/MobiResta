/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-material/angular-material.d.ts" />
/// <reference path="../../ref/ionic/ionic.d.ts" />
/// <reference path="../../ref/util/toaster.d.ts" />
/// <reference path="../../ref/cordova/plugins/Geolocation.d.ts" />

import {Meta} from '../Core/Meta';
import {BaseService} from '../Core/BaseService';


export var Cordova: CordovaService;

export var $cordovaBarcodeScanner: any;
export var $cordovaFacebook: any;

@Meta.Service('CordovaService')
export class CordovaService extends BaseService {

    static InstanceReady(instance) {
        Cordova = instance;
    }

    static Configure(factory: typeof BaseService, app: ng.IModule) {
        BaseService.Configure(factory, app);
        app.config(['$cordovaFacebookProvider', ($cordovaFacebookProvider) => {
            var appId = 553761251435219;
            try {
                $cordovaFacebookProvider.browserInit(appId);
            } catch (e) {
                console.log(e);
            }
        }]);

    }

    static $inject = ['$cordovaBarcodeScanner', '$cordovaFacebook'];

    constructor(public cordovaBarcodeScanner, public cordovaFacebook) {
        super();
        Cordova = this;
        $cordovaBarcodeScanner = cordovaBarcodeScanner;
        $cordovaFacebook = cordovaFacebook;
    }
}