/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';
import {FeedbackRequest} from './FeedbackRequest';

export class HappyRequest extends FeedbackRequest {
    static meta: RequestMetadata = { iconClass: "ion-happy-outline", title: 'Mutlu müşteri' };
    static type = "happy";
    static virtual = false;

    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(HappyRequest.meta);
    }

    static register = RequestBase.registerRequest(HappyRequest);
}