/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/lodash/lodash.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $http, $stateParams, $sce} from '../../Kalitte/Vendor/AngularService';
import {Account} from '../../Kalitte/Data/AccountService';
import {Meta} from '../../Kalitte/Core/Meta';


@Meta.Controller('ContentViewController', {
    state: {
        name: 'app.contentview',
        url: "/contentview/:title",
        templateUrl: 'src/mobile/App/ContentViewer.html',
        data: {
            title: ''
        },
        MobileControllerAs: true,
        params: {
            url: null
        }
    }
})
export class AppController extends ControllerBase {

    contentString: any;
    title: string;

    initialize() {
        var url = $stateParams['url'];
        this.title = $stateParams['title'];
        return this.errorHandled($http.get(url, {
            responseType: 'text'
        }).then((data) => {                
                this.contentString = $sce.trustAsHtml(data.data.toString());
            return super.initialize();
        }));        
    }
}