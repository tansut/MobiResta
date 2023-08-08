/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {BaseController} from './../../lib/BaseController';
import {Registration} from '../../service/RegistrationService';
import {Company} from '../../service/data/CompanyService';
import {EntityService} from '../../service/data/RemoteService';
import {Entity, Data} from '../../lib/Models';


export class CompanyController extends BaseController {
    public static ControllerName = 'CompanyController';


    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company',
            {
                url: '/company',
                abstract: true,
                templateUrl: "src/app/Company/home.html",
                controller: CompanyController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: '' }
            })
            .state('app.company.list', {
                url: '',
                templateUrl: "src/app/Company/list.html",
                controller: CompanyController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: '??letmelerim' }
            })
            .state('app.company.new',
            {
                url: '/new',
                templateUrl: "src/app/Company/edit.html",
                controller: CompanyController.ControllerName,
                controllerAs: 'ctrl',
                data: { title: '??letme Ekle' }
            })
            .state('app.company.edit',
            {
                url: '/edit',
                templateUrl: "src/app/Company/edit.html",
                controller: CompanyController.ControllerName,
                controllerAs: 'ctrl'
            })
    }

    entityList: Array<Entity.Company>;

    constructor($scope: angular.IScope) {
        super($scope);
        this.errorHandled(Company.listOfUser().then((result) => {
            this.entityList = result;

            //var id = this.entityList[0].Id;
            //var service = new EntityService<Entity.Company>('company');
            //service.Id(id).then((result) => {
            //    this.alert(result.Name);
            //});

        }));
    }

    newEntity() {

        var entity = <Entity.Company>{};
        entity.Address = <Data.Address>{};
        entity.Location = <Data.GeoPoint>{};
        entity.Name = "Foo";
        entity.Address.Line1 = "addres";
        entity.Location.Lat = 35.12222;
        entity.Location.Long = 35.12222;

        var service = new EntityService<Entity.Company>('company');
        service.Post(entity);
    }

    editEntiy(entity, event) {
        debugger;
    }

    static register = Registration.RegisterController(CompanyController.ControllerName, CompanyController);
}   