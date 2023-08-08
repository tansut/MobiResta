/// <reference path="../../ref/angularjs/angular.d.ts" />

import {ControllerBase} from './ControllerBase';
import {Kalitte} from '../Data/Models';
import {EntityService} from '../Data/RemoteService';
import {$state, $stateParams, $timeout, $q} from '../Vendor/AngularService';

export class EntityController<E extends Kalitte.EntityBase> extends ControllerBase {
    idParameter = 'Id';
    $Entity: E;
    $Id: string;
    $Service: EntityService<any>;


    ExecuteQuery() {
        return this.$Service.Id(this.$Id);
    }

    EmptyEntity(): E {
        return <E> {};
    }

    RetreiveEntity(): ng.IPromise<E> {
        if (this.$Id)
            return this.ExecuteQuery();
        else {
            return new $q((resolve) => {
                resolve(this.EmptyEntity());
            });
        }
    }

    LoadEntity() {
        return this.errorHandled(this.RetreiveEntity().then((entity) => {
            this.$Entity = <E>entity;
            return this.$Entity;
        }));
    }

    initialize() {
        this.$Id = $stateParams[this.idParameter];
        return this.LoadEntity().then(() => {
            return super.initialize()
        });
    }

    saveOnService() {
        return this.$Service.Save(this.$Entity);
    }

    save() {
        var entity = this.$Entity;
       
        return this.errorHandled(this.saveOnService().then((result) => {
            var inserting = !this.$Entity.Id;
            if (inserting)
                this.$Entity.Id = (<Kalitte.CreatedResponse>result).Id;
            //this.toast(this.$Id ? 'Güncellendi' : 'Oluşturuldu');
        }));
    }

    constructor($scope: ng.IScope, $Service?: EntityService<any>) {
        super($scope);
        if ($Service)
            this.$Service = $Service;

    }
}