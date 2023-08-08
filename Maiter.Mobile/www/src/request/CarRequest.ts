/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata, Notification} from '../shared/RequestBase';

export class CarRequest extends RequestBase {
    static meta: RequestMetadata = { iconClass: "ion-model-s", title: 'Aracım Hazırlansın' };
    static type = "car";
    carInfo: string;

    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(CarRequest.meta);
    }

    getRequestText() {
        return this.withNote(this.carInfo + " aracım hazırlansın lütfen." + (this.notifyMe == Notification.yes ? " Hazır olduğunda ayrıca beni haberdar edin." : ""));
    }

    static register = RequestBase.registerRequest(CarRequest);
}