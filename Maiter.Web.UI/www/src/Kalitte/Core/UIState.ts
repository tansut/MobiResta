/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

export interface StateInfo {
    title?: string;
    authenticated?: boolean;
    roles?: Array<string>;
}

export interface UIState extends angular.ui.IState {
    data?: StateInfo;
}