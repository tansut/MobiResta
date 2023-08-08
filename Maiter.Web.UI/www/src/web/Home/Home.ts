/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope} from '../../Kalitte/Vendor/AngularService';
import {Account} from '../../Kalitte/Data/AccountService';
import {AnonymousPrincipal} from '../../Kalitte/Core/Principal';
import {Meta} from '../../Kalitte/Core/Meta';
import {ViewModels, Entity} from '../../Data/Models';


@Meta.Controller('HomeController')
export class HomeController extends ControllerBase {
    public static ControllerName = 'HomeController';

    hi = 'hello world';

    initialize() {        
        return super.initialize();
    }

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.home', {
            url:'',
            templateUrl: () => {
                if (Account.principal instanceof AnonymousPrincipal)
                    return "src/web/Home/home.html";
                else return "src/web/Home/user-home.html";
            },
            controller: HomeController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: 'Ana Sayfa'  }
        });
    }
}   