/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata, RequestData} from '../shared/RequestBase';
import {BillRequest} from './BillRequest';
import {WaiterRequest} from './WaiterRequest';
import {SendMessageRequest} from './SendMessageRequest';
import {CallTaxiRequest} from './CallTaxiRequest';
import {ChefRecommendRequest} from './ChefRecommendRequest';
import {WirelessRequest} from './WirelessRequest';
import {CarRequest} from './CarRequest';
import {HappyRequest} from './HappyRequest';
import {SadRequest} from './SadRequest';


export class Branch {
    public availableRequests: Array<RequestData> = [];
    constructor(public type: string, public title: string, public toTitle: string) {

    }
}

export class ServiceBranch extends Branch {
    static iconClass = "ion-fork";
    constructor() {
        super('service', 'Servis Görevlisi', 'Servis Görevlisine');
        this.availableRequests.push({ type: WaiterRequest.type, meta: WaiterRequest.meta });
        this.availableRequests.push({ type: BillRequest.type, meta: BillRequest.meta });
        this.availableRequests.push({ type: SendMessageRequest.type, meta: SendMessageRequest.meta });
    }
}


export class ManagementBranch extends Branch {
    constructor() {
        super('management', 'Yönetim', 'Yönetime');
        this.availableRequests.push({ type: WirelessRequest.type, meta: WirelessRequest.meta });        
        this.availableRequests.push({ type: HappyRequest.type, meta: HappyRequest.meta });
        this.availableRequests.push({ type: SadRequest.type, meta: SadRequest.meta });
        this.availableRequests.push({ type: SendMessageRequest.type, meta: SendMessageRequest.meta });
    }
}

export class KitchenBranch extends Branch {
    constructor() {
        super('kitchen', 'Mutfak', 'Mutfağa');
        this.availableRequests.push({ type: ChefRecommendRequest.type, meta: ChefRecommendRequest.meta });
    }
}

export class ValeBranch extends Branch {
    constructor() {
        super('vale', 'Vale', 'Valeye');
        this.availableRequests.push({ type: CarRequest.type, meta: CarRequest.meta });
        this.availableRequests.push({ type: CallTaxiRequest.type, meta: CallTaxiRequest.meta });
        this.availableRequests.push({ type: SendMessageRequest.type, meta: SendMessageRequest.meta });
    }
}

export class BranchList {

    public Items: [Branch];

    constructor() {
        this.Items = [
            new ServiceBranch(),
            new ValeBranch(),
            new KitchenBranch,
            new ManagementBranch()
        ];
    }

    getBranch(type: string) {
        for (var index = 0; index < this.Items.length; index++) {
            var element = this.Items[index];
            if (element.type == type)
                return element;
        }
    }
}

export var AllBranches = new BranchList();