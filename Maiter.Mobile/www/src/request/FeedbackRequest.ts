/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata, Notification} from '../shared/RequestBase';

export class FeedbackRequest extends RequestBase {
    static meta: RequestMetadata = { iconClass: "ion-model-s", title: 'Geri besleme' };
    static type = "feedback";
    static virtual = true;
    
    branchType: string;
    contactInfo: string;
    
    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(FeedbackRequest.meta);
    }

    getRequestText() {
        return this.withNote("Görüşlerimi dikkate almanız dileğimle.");
    }

    static register = RequestBase.registerRequest(FeedbackRequest);
}