/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../ref/angular-local-storage/angularLocalStorage.d.ts" />
/// <reference path="../../ref/reflect-metadata/reflect-metadata.d.ts" />



import {Meta} from '../Core/Meta';
import {BaseService} from '../Core/BaseService';



export var Angular: AngularService;

export var $q: angular.IQService;
export var $rootScope: angular.IRootScopeService;
export var $state: angular.ui.IStateService;
export var $timeout: angular.ITimeoutService;
export var $stateParams: angular.ui.IStateParamsService;
export var $log: angular.ILogService;
export var $http: angular.IHttpService;
export var $location: angular.ILocationService;
export var $localStorage: angular.local.storage.ILocalStorageService;
export var $window: angular.IWindowService;
export var $templateRequest: angular.ITemplateRequestService;
export var $templateCache: angular.ITemplateCacheService;
export var $filter: angular.IFilterService;
export var $sce: any;

@Meta.Service('AngularService')
export class AngularService extends BaseService {

    static $inject = ['$q', '$rootScope', '$state', '$timeout',
        '$stateParams', '$log', '$http', '$location', 'localStorageService', '$window', '$templateRequest', '$templateCache', '$filter', '$sce'];

    static InstanceReady(instance: BaseService) {
        Angular = <AngularService>instance;
    }

    constructor(public q: angular.IQService,
        public rootScope: angular.IRootScopeService,
        public state: angular.ui.IStateService,
        public timeout: angular.ITimeoutService,
        public stateParams: angular.ui.IStateParamsService,
        public log: angular.ILogService,
        public http: angular.IHttpService,
        public location: angular.ILocationService,
        public localStorage: angular.local.storage.ILocalStorageService,
        public _window: angular.IWindowService,
        public templateRequest: angular.ITemplateRequestService,
        public templateCache: angular.ITemplateCacheService,
        public filter: angular.IFilterService,
        public sce: any) {
        super();
        $q = q;
        $rootScope = rootScope;
        $state = state;
        $timeout = timeout;
        $stateParams = stateParams;
        $log = log;
        $http = http;
        $location = location;
        $localStorage = localStorage;
        $window = _window;
        $templateRequest = templateRequest;
        $templateCache = templateCache;
        $filter = filter;
        $sce = sce;
    }
}