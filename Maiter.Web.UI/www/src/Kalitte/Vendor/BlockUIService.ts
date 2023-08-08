/// <reference path="../../ref/angularjs/angular.d.ts" />


import {Meta} from '../Core/Meta';
import {BaseService} from '../Core/BaseService';

	
export var BlockUI: BlockUIService;


@Meta.Service('BlockUIService')
export class BlockUIService extends BaseService {

    public Service: any;

    static InstanceReady(instance) {
        BlockUI = instance;
    }

    static $inject = ['blockUI'];

    constructor(public BlockUI) {
        super();
        this.Service = BlockUI;
	}
}