/// <reference path="../ref/angularjs/angular.d.ts" />


import {RemoteService, EntityService} from '../Kalitte/Data/RemoteService';
import {AngularService} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {BaseService} from '../Kalitte/Core/BaseService';
import {Entity, Data, ViewModels} from './Models';
import {Kalitte} from '../Kalitte/Data/Models';


export var Attachment: AttachmentService;



@Meta.Service('AttachmentService')
export class AttachmentService extends EntityService<Entity.EntityAttachment> {

    ListOfEntity(entityName: string, entityId: string, AttachType: Entity.AttachmentType) {
        return this.$http().get<Array<Entity.EntityAttachment>>(this.url('ListOfEntity', { entityName: entityName, entityId: entityId, attachmentType: AttachType })).then((result) => result.data);
    }

    static InstanceReady(instance) {
        Attachment = instance;
    }


    constructor() {
        super('Attachment');
    }
}
