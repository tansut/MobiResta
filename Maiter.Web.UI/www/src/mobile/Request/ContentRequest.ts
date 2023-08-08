/// <reference path="../../ref/angularjs/angular.d.ts" />



import {ContentRequest} from '../../Core/Request/ContentRequest';
import {RequestController} from '../../UI/RequestController';
import {$q, $timeout, $http} from '../../Kalitte/Vendor/AngularService';

export class ContentRequestController<T extends ContentRequest> extends RequestController<T> {
	constructor(requestClass: any, $scope: ng.IScope) {
		super(requestClass, $scope);
	}
	
	contentString: string;
	
	initialize() {
		if (super.initialize()) {
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
