/// <reference path="../../ref/angularjs/angular.d.ts" />


import {RemoteService, EntityService} from './RemoteService';

import {Entity} from '../../lib/Models';

export var Company: CompanyService;

export class CompanyService extends EntityService<Entity.Company> {
    listOfUser() {
        return this.$http().get<Array<Entity.Company>>(this.url('company/UserCompanyList')).then((result) => result.data);
    }


    constructor() {
        super('company');
        Company = this;
    }
}