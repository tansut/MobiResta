/// <reference path="../../ref/angularjs/angular.d.ts" />

import {$q, $http, $rootScope, $timeout} from './../AngularService';
import {Entity, Data} from '../../lib/Models';



export class RemoteService {
    $http() {
        return $http;
    }

    url(postfix: string, args: Object = {}) {        
        var url = 'api/' + postfix;
        var argsAdded = false;
        for (var key in args) {
            if (!argsAdded)
                url = url + '?';
            url = url.concat(key + '=' + encodeURI(args[key]) + '&');
            argsAdded = true;
        }
        if (argsAdded)
            url = url.substring(0, url.length - 1);
        return url;
    }
}


export class EntityService<T> extends RemoteService {

    constructor(public entityName: string) {
        super();
    }

    Id(id: string): angular.IPromise<T> {
        return this.$http().get<T>(this.url('entity/id/' + this.entityName + '/' + id)).then((result) => result.data);
    }

    Post(entity: T): angular.IPromise<Data.CreatedResponse> {
        return this.$http().post<Data.CreatedResponse>(this.url(this.entityName  + '/create'), entity).then((result) => result.data);        
    }

    //del(id: string): angular.IPromise<void> {
    //    return this.$http().delete<void>('api/' + this.entityName + '/id/' + id);
    //}
}