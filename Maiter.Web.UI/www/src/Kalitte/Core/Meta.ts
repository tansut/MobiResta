import {ControllerBase} from '../UI/ControllerBase';
import {Dictionary} from './Dictionary';

import {BaseService} from './BaseService';
import {BaseFactory} from './BaseFactory';
import {UIState, StateInfo} from './UIState';

export interface ControllerMeta {
    config: ControllerConfig;
    factory?: typeof ControllerBase;
}

export interface ServiceMeta {
    name: string;
    config: ServiceConfig;
    factory?: Function;
}

export interface FactoryMeta {
    name: string;
    config: FactoryConfig;
    factory?: Function;
}

export interface DirectiveMeta {
    config: DirectiveConfig;
    factory?: angular.IDirectiveFactory;
}


export interface FilterMeta {
    config: FilterConfig;
    factory?: Function;
}

export interface EntityMeta {
    name: string;
    config: EntityConfig;
}

export interface EntityConfig {

}

export interface ControllerConfig {
    state?: UIState;
}

export interface ServiceConfig {
        
}

export interface DirectiveConfig {

}

export interface FactoryConfig {

}

export interface FilterConfig {

}

export class MetaName {
    static Service = "Service";
    static Factory = "Factory";
    static Directive = "Directive";
    static Filter = "Filter";
    static Controller = "Controller";
    static Entity= "Entity";
}

export class Meta {

    static Entity(name: string, config?: EntityConfig) {
        var fn = (config?: EntityConfig) => {
            var configSave = config;
            return (target: Function) => {
                var config = configSave || <EntityConfig>{};
                var meta = <EntityMeta>{
                    name: name,
                    config: config
                }
                Reflect.defineMetadata(MetaName.Entity, meta, target);
            }
        }
        return fn(config);
    }


    static Service(name: string, config?: ServiceConfig) {
        var fn = (config?: ServiceConfig) => {
            var configSave = config;
            return (target: Function) => {
                var config = configSave || <ServiceConfig>{};
                var meta = <ServiceMeta>{
                    name: name,
                    config: config,
                    factory: target
                }
                Reflect.defineMetadata(MetaName.Service, meta, target);
                MetaRegistry.RegisterService(name, <typeof BaseService>target);
            }
        }
        return fn(config);
    }

    static Factory(name: string, config?: FactoryConfig) {
        var fn = (config?: FactoryConfig) => {
            var configSave = config;
            return (target: Function) => {
                var config = configSave || <FactoryConfig>{};
                var meta = <FactoryMeta>{
                    name: name,
                    config: config,
                    factory: target['$Factory']
                }
                Reflect.defineMetadata(MetaName.Factory, meta, target);
                MetaRegistry.RegisterFactory(name, <typeof BaseFactory>target);
            }
        }
        return fn(config);
    }

    static Directive(name: string, config?: DirectiveMeta) {
        var fn = (config?: DirectiveConfig) => {
            var configSave = config;
            return (target: Function) => {
                var config = configSave || <DirectiveConfig>{};
                var meta = <DirectiveMeta>{
                    config: config,
                    factory: target['$Factory']
                }
                Reflect.defineMetadata(MetaName.Directive, meta, target);
                MetaRegistry.RegisterDirective(name, target);
            }
        }
        return fn(config);
    }

    static Filter(name: string, config?: FilterMeta) {
        var fn = (config?: FilterConfig) => {
            var configSave = config;
            return (target: Function) => {
                var config = configSave || <FilterConfig>{};
                var meta = <FilterMeta>{
                    config: config,
                    factory: target['$Factory']
                }
                Reflect.defineMetadata(MetaName.Filter, meta, target);
                MetaRegistry.RegisterFilter(name, target);
            }
        }
        return fn(config);
    }

    static Controller(name: string, config?: ControllerConfig) {
        var fn = (config?: ControllerConfig) => {
            var configSave = config;
            return (target: typeof ControllerBase) => {
                var config = configSave || <ControllerConfig>{};
                if (config.state && !config.state.controller) {
                    if (config.state['MobileControllerAs']) {
                        config.state.controller = name + ' as ctrl';
                    }
                    else 
                        config.state.controller = name;
                    if (!config.state.controllerAs)
                        config.state.controllerAs = "ctrl";                    
                }
                var meta = <ControllerMeta>{
                    config: config,
                    factory: target
                }
                Reflect.defineMetadata(MetaName.Controller, meta, target);
                MetaRegistry.RegisterController(name, target);
            }
        }
        return fn(config);
    }
}

export class MetaRegistry {
    static Controllers = new Dictionary<string, typeof ControllerBase>();
    static Services = new Dictionary<string, typeof BaseService>();
    static Factories = new Dictionary<string, typeof BaseFactory>();

    static Directives = new Dictionary<string, Function>();
    static Filters = new Dictionary<string, Function>();

    static RegisterController(name: string, target: typeof ControllerBase) {
        if (this.Controllers.Get(name))
            throw new Error('Controller ' + name + ' already registered');
        this.Controllers.Add(name, target);
    }

    static RegisterService(name: string, target: typeof BaseService) {
        if (this.Services.Get(name))
            throw new Error('Service ' + name + ' already registered');
        this.Services.Add(name, target);
    }

    static RegisterDirective(name: string, target: Function) {
        if (this.Directives.Get(name))
            throw new Error('Directive ' + name + ' already registered');
        this.Directives.Add(name, target);
    }

    static RegisterFilter(name: string, target: Function) {
        if (this.Filters.Get(name))
            throw new Error('Filter ' + name + ' already registered');
        this.Filters.Add(name, target);
    }

    static RegisterFactory(name: string, target: typeof BaseFactory) {
        if (this.Factories.Get(name))
            throw new Error('Factory ' + name + ' already registered');
        this.Factories.Add(name, target);
    }

}