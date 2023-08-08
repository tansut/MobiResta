import {EntityController} from '../../../Kalitte/UI/EntityController';
import {Entity, Data, ViewModels} from '../../../Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';


@Meta.Controller('MenuSectionController')
export class MenuSectionController extends EntityController<Entity.MenuSection> {
    idParameter = 'sectionId';
    $Service = Remote.Entity<Entity.MenuSection>("MenuSection");
    $MenuService = Remote.Entity<Entity.Menu>("Menu");

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {

        $stateProvider.state('app.menu.sections.new', {
            url: '/new',
            controller: 'MenuSectionController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }
        }).state('app.menu.sections.edit', {
            url: '/editSection/:sectionId',
            controller: 'MenuSectionController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }
        })
    }

    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { attachments: true});
    }

    save() {
        var inserting = !this.$Entity.Id;
        if (inserting) {
            this.$Entity.MenuId = $stateParams['Id'];
        }
        return super.save().then(() => {
            $rootScope.$broadcast(inserting ? 'Entity.MenuSection.Inserted': 'Entity.MenuSection.Updated', this.$Entity);
            Dialog.Hide();
        });
    }


    initialize() {
        return super.initialize().then(() => {
            Dialog.Show({
                controller: () => this,
                controllerAs: 'ctrl',
                templateUrl: 'src/web/Menu/Sections/Edit.html'
            }).finally(() => {
                $state.go('^');
            });
        });        
    }

    CloseDialog() {
        Dialog.Hide();
    }
}