/// <reference path="../ref/angularjs/angular.d.ts" />


import {RemoteService, EntityService} from '../Kalitte/Data/RemoteService';
import {$q} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {BaseService} from '../Kalitte/Core/BaseService';
import {Entity, Data, ViewModels} from './Models';
import {Kalitte} from '../Kalitte/Data/Models';
import {Dictionary} from '../Kalitte/Core/Dictionary';


export var MetaData: MetaDataService;



@Meta.Service('MetaDataService')
export class MetaDataService extends RemoteService {
    // For caching
    private cultures: Array<Entity.Culture>;
    private currency: Array<string>;
    private timeZones: Dictionary<string, string>;

    RemoteController = 'Meta';

    ListCultures() {
        var q = this.cultures ? new $q((resolve) => resolve(this.cultures)) :
            this.$http().get<Array<Entity.Culture>>(this.url('ListCultures')).then((result) => {
                return this.cultures = result.data;
            });

        return q;

    }

    ListCurrency() {
        var q = this.currency ? new $q((resolve) => resolve(this.currency)) :
            this.$http().get<Array<string>>(this.url('ListCurrency')).then((result) => {
                return this.currency = result.data;
            });

        return q;
    }

    ListTimezones() {
        var q = this.timeZones ? new $q((resolve) => resolve(this.timeZones)) :
            this.$http().get<any>(this.url('ListTimezones')).then((result) => {
                return result;
            });
        return q;
    }

    static InstanceReady(instance) {
        MetaData = instance;
    }


}

