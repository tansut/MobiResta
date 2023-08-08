/// <reference path="../../ref/angularjs/angular.d.ts" />


export interface BSMenuItem {
    Name: string;
    Title: string;
    Icon?: string;
    Href?: string;
    Handler?: { (data?: any) : void };
}


export interface BSOptions {
    Items: Array<BSMenuItem>;
    Header?: string;
    SelectCallback?: (itemIndex: number, data?: any) => void;
    $event?: any;
    Scope?: any;
}

export interface IBSMenuService {
    Show(options: BSOptions): ng.IPromise<any>;
    Hide();
}