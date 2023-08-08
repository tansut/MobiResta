/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {EntityService} from '../../Kalitte/Data/RemoteService';
import {$timeout, $location, $rootScope, $state, $stateParams} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';

export interface IBack {
    state: string;
    params: Object;
}

@Meta.Controller('DeleteEntityController', { state: { url: '/deleteEntity', params: { service: undefined, Id: undefined, title: '', back: undefined }, name: 'app.deleteEntity', templateUrl: 'src/Web/Helper/DeleteEntity.html', data: { authenticated: true, title: 'Silme Onayı' } } })
export class DeleteEntityController extends ControllerBase {
    Title: string = $stateParams['title'];
    Service = <EntityService<any>>$stateParams['service'];
    Id: string = $stateParams['Id'];
    Back: IBack = $stateParams['back'];


    cancelDeletion() {
        this.historyBack();
    }



    deleteEntity() {

        this.errorHandled(this.Service.del(this.Id).then(() => {
            if (this.Back)
                $state.go(this.Back.state, this.Back.params);
            else this.historyBack();
        }));
    }
}   