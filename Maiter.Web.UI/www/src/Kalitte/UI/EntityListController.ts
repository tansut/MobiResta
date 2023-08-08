/// <reference path="../../ref/angularjs/angular.d.ts" />

import {ControllerBase} from './ControllerBase';
import {Kalitte} from '../Data/Models';
import {EntityService} from '../Data/RemoteService';
import {$state, $stateParams, $timeout} from '../Vendor/AngularService';

export class EntityListController<E extends Kalitte.EntityBase> extends ControllerBase {

    $List: Array<E>;
    $Service: EntityService<E>;

    ExecuteQuery(): ng.IPromise<Array<E>> {
        return null;
    }

    LoadItems() {
        return this.errorHandled(this.ExecuteQuery().then((items) => {
            this.$List = items;
        }));
    }

    initialize() {
        return this.LoadItems().then(() => super.initialize());
    }

    constructor($scope: ng.IScope, $Service?: EntityService<E>) {
        super($scope);
        if ($Service)
            this.$Service = $Service;
    }
}