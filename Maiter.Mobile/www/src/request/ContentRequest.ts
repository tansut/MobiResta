/// <reference path="../ref/sprintf/sprintf-js.d.ts" />
/// <reference path="../ref/angularjs/angular.d.ts" />


import {RequestBase, RequestMetadata, Notification} from '../shared/RequestBase';
import {$q, $timeout, $http} from '../shared/Common';

export class ContentRequest extends RequestBase {
    static meta: RequestMetadata = { iconClass: "ion-model-s", title: 'Geri besleme' };
    static type = "content";
    static virtual = true;
  
    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(ContentRequest.meta);
    }
    
    getUrl(): string {
        return undefined;
    }
    


    static register = RequestBase.registerRequest(ContentRequest);
}