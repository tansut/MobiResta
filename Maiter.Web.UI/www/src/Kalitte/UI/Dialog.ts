/// <reference path="../../ref/angularjs/angular.d.ts" />


export interface IDialogOptions {
    title?: string;
    templateUrl?: string;
    template?: string;
    controller?: string|Function;
}

export interface IDialogService {
    Show(options: IDialogOptions): ng.IPromise<any>;
    Hide(response?: any);
}