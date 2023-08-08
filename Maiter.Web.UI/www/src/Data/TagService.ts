/// <reference path="../ref/angularjs/angular.d.ts" />


import {RemoteService, EntityService} from '../Kalitte/Data/RemoteService';
import {AngularService} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {BaseService} from '../Kalitte/Core/BaseService';
import {Entity, Data, ViewModels} from './Models';
import {Kalitte} from '../Kalitte/Data/Models';


export var Tag: TagService;

@Meta.Service('TagService')
export class TagService extends EntityService<Entity.EntityTag> {

    Search(entityName: string, searchText: string, option: Entity.TagDisplayOption = null) {
        return this.$http().get<Array<Entity.EntityTag>>(this.url('Search', { entityName: entityName, searchText: searchText, option: option })).then((result) => result.data);
    }

    static InstanceReady(instance) {
        Tag = instance;
    }

    constructor() {
        super('Tag');
    }
}