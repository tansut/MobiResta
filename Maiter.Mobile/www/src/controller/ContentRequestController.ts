/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="./RequestController.ts" />


import {ContentRequest} from '../request/ContentRequest';
import {RequestController} from './RequestController';
import {$q, $timeout, $http} from '../shared/Common';

export class ContentRequestController<T extends ContentRequest> extends RequestController<T> {
	constructor(requestClass: any, $scope: ng.IScope) {
		super(requestClass, $scope);
	}
	
	contentString: string;
	
	beforeEnter() {
		if (super.beforeEnter()) {
			this.showLoading('İçerik alınıyor ...', this.errorHandled(this.go()));	
			return true;
		} else return false;
	}

    go(): ng.IPromise<string> {
		
		return this.errorHandled($http.get(this.request.getUrl()).then((data)=> {
			this.contentString =  data.data.toString();
		}));
		
        var defer = $q.defer<string>();
        
        $timeout(()=> {
            
            defer.resolve("<h1>aaaa</h1>");
        }, 1500);
        
        return  defer.promise;
    }
}
