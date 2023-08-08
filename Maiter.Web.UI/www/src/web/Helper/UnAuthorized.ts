/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope, $state} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';



@Meta.Controller('UnAuthorized', { state: { url:'/unauthorized', name: 'app.unauthorized', templateUrl: 'src/Web/Helper/Unauthorized.html', data: { title: 'Yetkisiz İşlem' } } })
export class UnAuthorized extends ControllerBase {
    constructor(scope: ng.IScope) {
        super(scope);
    }    
}   