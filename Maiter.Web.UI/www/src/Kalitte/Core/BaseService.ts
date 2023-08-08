/// <reference path="../../ref/angularjs/angular.d.ts" />

import {ReflectHelper} from './ReflectHelper';
import {ServiceMeta, FactoryMeta, MetaName} from './Meta';


export interface ServiceConfiguration {
    ConfigFile?: string;
}

export class BaseService {

    Resolve: { [id: string]: ng.IPromise<any> } = {};

    Ready(): ng.IPromise<any> {
        var $q = <ng.IQService>angular.injector(['ng']).get('$q');
        return $q.all(this.Resolve);
    }

    static RegisteredInstances = new Array<BaseService>();

    static InstanceReady(instance: BaseService) {

    }

    static Configure(factory: typeof BaseService, app: ng.IModule, config?: any) {
        var meta = ReflectHelper.getMeta<ServiceMeta>(MetaName.Service, factory);
        app.run([meta.name, (instance: BaseService) => {
            instance.constructor['InstanceReady'].apply(instance.constructor, [instance]);
            BaseService.RegisteredInstances.push(instance);
        }]);
    }
}