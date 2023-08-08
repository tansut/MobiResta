/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata, Notification} from '../shared/RequestBase';

export class CallTaxiRequest extends RequestBase {
    static meta: RequestMetadata = { iconClass: "ion-android-car", title: 'Taksi Çağır' };
    static type = "callTaxi";


    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(CallTaxiRequest.meta);
    }
    
    getRequestText() {
        return this.withNote("Taksi çağırın lütfen." + (this.notifyMe == Notification.yes ? "Taksi geldiğinde ayrıca beni haberdar edin.":""));
    }

    static register = RequestBase.registerRequest(CallTaxiRequest);
}
