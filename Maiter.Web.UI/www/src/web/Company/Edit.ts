/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {EntityController} from './../../Kalitte/UI/EntityController';
import {Company as DataService} from '../../Data/CompanyService';
import {EntityService} from '../../Kalitte/Data/RemoteService';
import {Entity, Data} from '../../Data/Models';
import {$state, $stateParams, $timeout, $q} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';
import {Kalitte} from '../../Kalitte/Data/Models';
import {Remote} from '../../Kalitte/Data/RemoteService';
import {MetaData} from '../../Data/MetaService';
import {Dictionary} from '../../Kalitte/Core/Dictionary';


var _self: EditCompanyController;

@Meta.Controller(EditCompanyController.ControllerName)
export class EditCompanyController extends EntityController<Entity.Company> {
    public static ControllerName = 'EditCompanyController';
    $CountryService = Remote.Entity("Country");
    $StateService = Remote.Entity("State");
    $CityService = Remote.Entity("City");
    mapLong: number;
    mapLat: number;
    locationInfo: Data.GeoPoint;
    position: string;
    infoWindows: any;
    haritaDurum: boolean = false;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company.new',
            {
                url: '/new',
                templateUrl: "src/web/Company/Edit.html",
                controller: EditCompanyController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: 'Yeni Restaurant Kaydı' }
            })
            .state('app.company.edit',
                {
                    url: '/edit/:Id',
                    templateUrl: "src/web/Company/Edit.html",
                    controller: EditCompanyController.ControllerName,
                    data: { title: 'Restaurant Bilgilerini Güncelle' },
                    controllerAs: 'ctrl',
                })
        //.state('app.company.edit.maps',
        //        {
        //            url: '/maps',
        //            templateUrl: "src/web/Company/maps.html",
        //            controller: EditCompanyController.ControllerName,
        //            data: { title: 'Restaurant Yeri Seç' },
        //            controllerAs: 'ctrl',
        //        })
    }

    constructor(public $scope: angular.IScope) {

        super($scope, DataService);

        _self = this;


    }

    save() {
        var entity = this.$Entity;
       
        if (this.mapLong) {
            entity.Location = <Data.GeoPoint>{
                Long: this.mapLong,
                Lat: this.mapLat,
            }
        }else
        entity.Location = <Data.GeoPoint>{
            Lat: _self.$Entity.Location.Lat,
            Long: _self.$Entity.Location.Long
        };
        entity.CountryName = this.cascade.countrySelected.Name;
        entity.StateName = this.cascade.stateSelected.Name;
        entity.CityName = this.cascade.citySelected.Name;
        entity.CityId = this.cascade.citySelected.Id;
        //entity.Location = this.locationInfo;
        return super.save().then(() => {
            if (!this.$Id)
                $timeout(() => $state.go("app.company.manage", { Id: this.$Entity.Id }), 500);
            else this.historyBack();
        });
    }
    haritaGoster() {
        this.haritaDurum = !this.haritaDurum;
        //if (this.haritaDurum && this.position) {
        //    var lat = parseFloat(this.position.split(',')[0]);
        //    var long = parseFloat(this.position.split(',')[1]);

        //    if (this.map) {
        //        _self.map.setCenter({ latLng: { G: lat, K: long } });
        //    } else {
        //        this.$scope.$on('mapInitialized', (scope, map) => {
        //            _self.map.setCenter({ latLng: { G : lat , K : long } });
        //        });
        //    }
        //}

    }

    CountryList: Array<Entity.Country>;
    StateList: Array<Entity.CountryState>;
    CityList: Array<Entity.City>;
    cascade: CascadeSearch;
    TimeZones: Dictionary<string, string>;

    initDbValues() {
        var list = new Array<ng.IPromise<any>>();
        list.push(this.errorHandled(this.$CountryService.Call<Array<Entity.Country>>('List').then((items) => {
            return this.CountryList = items;
        })));

        return $q.all(list);
    }

    initcascade() {
        this.cascade = <CascadeSearch>{
            countrySearch: '',
            stateSearch: '',
            citySearch: '',
            countrySelected: undefined,
            stateSelected: undefined,
            citySelected: undefined

        };
    }
    queryCountry(search: string = undefined) {
        if (!this.$Ready)
            return $q.reject();
        var listPromise: ng.IPromise<Array<Entity.Country>>;
        var defer = $q.defer<Array<Entity.Country>>();

        listPromise = defer.promise;
        defer.resolve(this.CountryList);
        return this.errorHandled(listPromise.then((items) => {
            var list = this.CountryList;
            return search ? list.filter((item) => typeof search == 'undefined' || item.Name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0) : list;
        }))
    }
    queryState(search: string = undefined) {

        if (!this.$Ready)
            return $q.reject();

        return this.$StateService.Call<Array<Entity.CountryState>>('List', {
            countryId: this.cascade.countrySelected.Id
        }).then((states) => {
            return _.filter(states, (item) => typeof search == 'undefined' || item.Name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0);
        });

    }
    queryCity(search: string = undefined) {

        if (!this.$Ready || this.cascade.stateSelected == undefined)
            return $q.reject();

        return this.$CityService.Call<Array<Entity.City>>('List', {
            stateId: this.cascade.stateSelected.Id
        }).then((city) => {

            return _.filter(city, (item) => typeof search == 'undefined' || item.Name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0);

        });

    }
    countrySelectedChange(item) {
        if (!item) {
            this.cascade.stateSelected = undefined;
            this.cascade.stateSearch = '';
        }

    }
    stateSelectedChange(item) {
        if (!item) {
            this.cascade.citySelected = undefined;
            this.cascade.citySearch = '';
        }
    }

    map : any;

    alertLocation(event: any,map) {
        _self.SetEntityLocation.call(_self, event, this);
        _self.toast('Point.X.Y: ' + event.latLng);
    }

    private SetEntityLocation(event, map,scopeApply) {
        if (this.$Id) {
            this.$Entity.Location.Lat = event.latLng.G;
            this.$Entity.Location.Long = event.latLng.K;
        }
        var location = event.latLng;
        
        if (scopeApply)
            this.getScope().$apply(() => {
                this.position = location.G + ',' + location.K;
                _self.mapLat = location.G;
                _self.mapLong = location.K;
            });
        else {
            this.position = location.G + ',' + location.K;
            _self.mapLat = location.G;
            _self.mapLong = location.K;
        }
        map.infoWindows.mapInfoWindow.setPosition(event.latLng);
        _self.toast('Point.X.Y: ' + event.latLng);
    }

    initTimeZonesList() {
        MetaData.ListTimezones().then((zones) => {
            var returnTimeZones = new Dictionary<string, string>();
            for (var item in zones.data) {
                if (zones.data.hasOwnProperty(item))
                    returnTimeZones.Add(item, zones.data[item]);
            }
            return this.TimeZones = returnTimeZones;
        });
    }

    initialize(): ng.IPromise<any> {
   
        var self = this;
        self.initcascade();
        this.initTimeZonesList();
        var initPromise = this.initDbValues();
        return initPromise.then(() => {
            return super.initialize().then(() => {

                if (!self.$Id) {
                    var x = this.cascade;
                    self.cascade.countrySelected = _.find<Entity.Country>(self.CountryList, 'Name', self.$Entity.CountryName);

                } else {
                    self.cascade.countrySelected = _.find<Entity.Country>(self.CountryList, 'Name', self.$Entity.CountryName);
                    self.$Service.Call<Entity.City>("GetCompanyCity", { companyId: self.$Id }).then((resp) => {
                        self.cascade.stateSelected = resp.State;
                        self.cascade.citySelected = resp;
                        self.position = self.$Entity.Location.Lat + ',' + self.$Entity.Location.Long;

                    });

                }


                this.getScope().$on('mapInitialized', function (scope, maps) {
                    self.map = maps;
                    if (!self.$Id)
                        self.SetEntityLocation.call(self, { latLng: maps.center }, this, false);
                });
            })
        })

    }
}

interface CascadeSearch {
    countrySearch: string;
    stateSearch: string;
    countrySelected: Entity.Country;
    stateSelected: Entity.CountryState;
    citySelected: Entity.City;
    citySearch: string;
}  