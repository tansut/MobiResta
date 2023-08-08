import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {Meta} from '../../Kalitte/Core/Meta';
import { RequestBase } from '../../Core/RequestBase';

@Meta.Controller('RegisterRequestsController')
export class RegisterRequestsController extends ControllerBase {
    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.request', {
            abstract: true,
            controller: 'RegisterRequestsController as ctrl',
            template: ' <ion-nav-view></ion-nav-view>'            
        });
    }
}