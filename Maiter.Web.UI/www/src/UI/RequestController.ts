/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/ionic/ionic.d.ts" />


import {ControllerBase} from '../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';

import {RequestBase} from '../Core/RequestBase';
import {$stateParams, $q, $log, $state} from '../Kalitte/Vendor/AngularService';
import {Branch, AllBranches} from '../Core/Request/Branch';
//import {CustomerSession} from '../Core/CustomerSession';

export class RequestController<T extends RequestBase> extends ControllerBase {
    static $inject = ['$scope'];
    public branch: Branch;
    public request: T;
    public requestMeta: Object;
    //public session: CustomerSession;


    sendRequest(): ng.IPromise<any> {
        //return this.session.sendRequest(this.branch, this.request);
        return null;
    }

    createRequest<T>(c: { new (): T; }): T {
        return new c();
    }

    init() {
        this.branch = AllBranches.getBranch($stateParams['branch']);
        var typeKey = $state.current.url.split('-')[1];
        this.request = this.createRequest<T>(this.requestClass);
        this.requestMeta = this.request.getMeta();
        //this.session = CustomerSession.getInstance();
    }

    initialize() {
        //if (CustomerSession.ensureCustomerSession()) {
        //    this.init();
        //    return true;
        //} else return false;
    }

    go(changeState: boolean = true) {
        return this.errorHandled(this.sendRequest().then(() => {
            if (changeState) {
                return $state.go('app.chatlist', {
                    branch: this.branch.type,
                    notify: sprintf('Talebiniz %s iletildi.', this.branch.toTitle)
                });
            }
        }));
    }

    constructor(private requestClass: any, $scope: ng.IScope) {
        super($scope);
    }
}