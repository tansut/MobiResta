/// <reference path="../../../ref/angularjs/angular.d.ts" />

import {IBSMenuService, BSOptions, BSMenuItem} from '../BSMenu';
import {Meta} from '../../Core/Meta';
import {$mdBottomSheet} from '../../Vendor/MaterialService';
import {BaseService} from '../../Core/BaseService';

export var BSMenu: BSMenuService;

class BsController {
    SelectCallback: (menuIndex: number, menuItemName: string, data?: any) => void;
    Data: any;
    Items: Array<BSMenuItem>;
    ItemSelected(index: number) {
        if (this.Items[index].Href)
            BSMenu.Hide();

        this.Items[index].Handler && this.Items[index].Handler.call(this.Items[index], this.Data);
        var menuItemName = this.Items[index].Name;
        this.SelectCallback && this.SelectCallback.call(this, index, menuItemName, this.Data);
    }
}

@Meta.Service('BottomSheetService')
export class BSMenuService extends BaseService implements IBSMenuService {

    static InstanceReady(instance) {
        BSMenu = instance;
    }

    Show(options: BSOptions): ng.IPromise<any> {
        var fooController = new BsController();
        angular.extend(fooController, options);
        return $mdBottomSheet.show({
            controller: () => fooController,
            controllerAs: 'ctrl',
            templateUrl: 'src/Kalitte/UI/Web/BSMenu.html',
            targetEvent: options.$event
        });
    }

    Hide() {
        return $mdBottomSheet.hide();
    }
}