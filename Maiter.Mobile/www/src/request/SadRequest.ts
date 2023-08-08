/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';
import {FeedbackRequest} from './FeedbackRequest';


export class SadRequest extends FeedbackRequest {
    static meta: RequestMetadata = { iconClass: "ion-sad-outline", title: 'Mutsuz müşteri' };
    static type = "sad";
    static virtual = false;
    
    // static getCategories() {
    //     return [
    //         {
    //             key: 'service',
    //             value: 'Servisi beğendim'
    //         },
    //         {
    //             key: 'food',
    //             value: 'Yemekler çok güzeldi'
    //         }
    //     ]
    // }

    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(SadRequest.meta);
    }
    

    static register = RequestBase.registerRequest(SadRequest);
}