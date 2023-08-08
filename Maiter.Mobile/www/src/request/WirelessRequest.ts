/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';
import {ContentRequest} from './ContentRequest';

export class WirelessRequest extends ContentRequest {
    static meta: RequestMetadata = { iconClass: "ion-radio-waves", title: 'Kablosuz ağ bilgileri' };
    static type = "wireless";
    static virtual = false;

    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(WirelessRequest.meta);
    }
    
    getUrl() {
        return "templates/content/wireless.html"
    }

    static register = RequestBase.registerRequest(WirelessRequest);
}

