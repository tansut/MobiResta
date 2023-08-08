interface CordovaGeolocationService {
    getCurrentPosition(options: PositionOptions): ng.IPromise<Position>;
    watchPosition(options: GeoLocationWatchOptions): GeoLocationWatch;
    clearWatch(watch: GeoLocationWatch):  void;
}

interface GeoLocationWatch extends ng.IPromise<Position> {
    clearWatch(): void;
}

interface GeoLocationWatchOptions extends PositionOptions {
    frequency?: number;
}