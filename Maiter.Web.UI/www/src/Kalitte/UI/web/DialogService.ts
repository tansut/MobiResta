/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/angular-material/angular-material.d.ts" />

import { IDialogService, IDialogOptions } from '../Dialog';
import {Meta} from '../../Core/Meta';
import {$mdDialog} from '../../Vendor/MaterialService';
import {BaseService} from '../../Core/BaseService';

export var Dialog: DialogService;

var DialogController = () => {
    debugger;
}

@Meta.Service('DialogService')
export class DialogService extends BaseService implements IDialogService  {

    static InstanceReady(instance) {
        Dialog = instance;
    }

    Show(options: IDialogOptions): ng.IPromise<any> {
        options['focusOnOpen'] = false;
        if (options["controller"] && !options["controllerAs"])
            options["controllerAs"] = "ctrl";
        return $mdDialog.show(options);
    }

    Hide(response?: any) {
        $mdDialog.hide(response)
    }
}