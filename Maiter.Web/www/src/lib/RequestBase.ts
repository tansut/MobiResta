/// <reference path="../ref/angularjs/angular.d.ts" />

export interface RequestMetadata {
    iconClass?: string;
    title?: string;
}

export interface RequestData {
    type: string;
    meta: RequestMetadata
}

export var Notification = {
    yes: 'yes',
    no: 'no'
}

export class RequestBase {

    public static requestClasses = {};
    //meta: RequestMetadata;
    public notifyMe: string = Notification.no;

    static registerRequest(fn: any) {
        RequestBase.requestClasses[fn.type] = fn;
    }

    public static createRequest(type: string): RequestBase {
        var constructor = RequestBase.requestClasses[type];
        if (!constructor)
            throw new Error('Unknown request type');
        return new constructor();
    }

    public requestNote: string = "";

    public withNote(message: string) {
        return this.requestNote ? message + ' Not: ' + this.requestNote : message;
    }

    public createMeta(defaults: RequestMetadata, overrides?: RequestMetadata) {
        //this.meta = angular.extend({}, defaults, overrides);
    }

    public getType(): string {
        for (var type in RequestBase.requestClasses)
            if (this.constructor === RequestBase.requestClasses[type])
                return type;
    }

    getRequestText() {
        return this.getType();
    }

    getMeta() {
        return this.constructor['meta'];
    }

    serialized() {
        JSON.stringify(this);
    }

    constructor() {

    }
}