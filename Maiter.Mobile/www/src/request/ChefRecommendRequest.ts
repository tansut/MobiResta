/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';
import {ContentRequest} from './ContentRequest';

export class ChefRecommendRequest extends RequestBase {
    static meta: RequestMetadata = { iconClass: "ion-bowtie", title: 'Şefin günlük önerisi' };
    static type = "chefRecommend";
    static virtual = false;

    constructor(meta?: RequestMetadata) {
        super();
        this.createMeta(ChefRecommendRequest.meta);
    }
    
    getUrl() {
        return "templates/content/chefRecommend.html"
    }

    static register = RequestBase.registerRequest(ChefRecommendRequest);
}
