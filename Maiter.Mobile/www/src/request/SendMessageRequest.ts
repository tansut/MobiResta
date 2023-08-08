/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';


export class SendMessageRequest extends RequestBase {
    static meta: RequestMetadata = { iconClass: "ion-chatboxes", title: 'Talep ilet' };
    static type = "sendMessage";

    public text: string;

    getRequestText() {
        return this.text;
    }

    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(SendMessageRequest.meta);
    }

    static register = RequestBase.registerRequest(SendMessageRequest);
}