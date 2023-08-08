/// <reference path="../../ref/angularjs/angular.d.ts" />


import {Meta} from '../Core/Meta';
import {BaseService, ServiceConfiguration} from '../Core/BaseService';


export var LocationService: GeolocationService;

interface GeolocationServiceConfiguration extends ServiceConfiguration {
    Debug: boolean;
}

@Meta.Service('GeolocationService')
class GeolocationService extends BaseService {
    
    static InstanceReady(instance) {
        LocationService = instance;
    }

    static Configure(factory, app, config: GeolocationServiceConfiguration) {
        BaseService.Configure(factory, app, config);
    }


    getCurrentPosition(options: PositionOptions): ng.IPromise<Position> {
        return this.geoLocationService.getCurrentPosition(options);
    }

    watchPosition(options: GeoLocationWatchOptions): GeoLocationWatch {
        return this.geoLocationService.watchPosition(options);
    }

    clearWatch(watch: GeoLocationWatch): void {
        return this.clearWatch(watch);
    }

    static $inject = ['$cordovaGeolocation'];

    constructor(private geoLocationService : CordovaGeolocationService) {
        super();
    }
}