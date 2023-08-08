/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';

export class WaiterRequest extends RequestBase {
    static meta: RequestMetadata = { iconClass: "ion-android-person-add", title: 'Garsonu Çağır' };
    static type = "waiter";

    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(WaiterRequest.meta);
    }
    
    getRequestText() {
        return this.withNote("Bakabilir misiniz lütfen?");
    }

    static register = RequestBase.registerRequest(WaiterRequest);
}