/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';

    export class BillRequest extends RequestBase {
        static meta: RequestMetadata = { iconClass: "ion-cash", title: 'Hesabı İste' };
        static type = "bill";        
        public static requestMessageFormat = "Hesap lütfen. %s ile ödeme yapmak istiyorum.";
        
         getRequestText() {             
             return this.withNote(sprintf(BillRequest.requestMessageFormat, BillRequest.PaymentType[this.paymentType]));
         }

        static PaymentType = {
            cash: 'Nakit',
            creditcard: 'Kredi kartı',
            other: 'Diğer kartlar'
        }

        public paymentType: string = 'cash';

        constructor(meta?: RequestMetadata) {
            super();
            this.createMeta(BillRequest.meta);
        }

        static register = RequestBase.registerRequest(BillRequest);
    }