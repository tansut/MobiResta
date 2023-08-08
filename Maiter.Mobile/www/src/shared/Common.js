/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../ref/ionic/ionic.d.ts" />
/// <reference path="../ref/util/toaster.d.ts" />
exports.Common;
exports.$q;
exports.$rootScope;
exports.$state;
exports.$timeout;
exports.$stateParams;
exports.$log;
exports.$http;
exports.$ionicScrollDelegate;
exports.toaster;
exports.$ionicPlatform;
var CommonService = (function () {
    function CommonService(q, rootScope, state, timeout, stateParams, log, http, ionicScrollDelegate, _toaster, ionicPlatform) {
        this.q = q;
        this.rootScope = rootScope;
        this.state = state;
        this.timeout = timeout;
        this.stateParams = stateParams;
        this.log = log;
        this.http = http;
        this.ionicScrollDelegate = ionicScrollDelegate;
        this._toaster = _toaster;
        this.ionicPlatform = ionicPlatform;
        exports.Common = this;
        exports.$q = q;
        exports.$rootScope = rootScope;
        exports.$state = state;
        exports.$timeout = timeout;
        exports.$stateParams = stateParams;
        exports.$log = log;
        exports.$http = http;
        exports.$ionicScrollDelegate = ionicScrollDelegate;
        exports.toaster = _toaster;
        exports.$ionicPlatform = ionicPlatform;
    }
    CommonService.$inject = ['$q', '$rootScope', '$state', '$timeout',
        '$stateParams', '$log', '$http', '$ionicScrollDelegate',
        'toaster', '$ionicPlatform'];
    return CommonService;
})();
exports.CommonService = CommonService;
