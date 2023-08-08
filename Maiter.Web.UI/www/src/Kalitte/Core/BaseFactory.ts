/// <reference path="../../ref/angularjs/angular.d.ts" />

import {ReflectHelper} from './ReflectHelper';
import {ServiceMeta, FactoryMeta, MetaName} from './Meta';


export class BaseFactory {

    static GetMeta(target: BaseFactory): FactoryMeta {
        var meta = ReflectHelper.getMeta<FactoryMeta>(MetaName.Factory, target);
        return meta;
    }

    static Configure(factory, app: ng.IModule) {

    }
}