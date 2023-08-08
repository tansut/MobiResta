import {EntityController} from '../../../Kalitte/UI/EntityController';
import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Entity, Data, ViewModels} from '../../../Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';


@Meta.Controller('CompanySectionController')
export class CompanySectionController extends EntityController<Entity.CompanySection> {
    idParameter = 'sectionId';
    $Service = Remote.Entity<Entity.CompanySection>("CompanySection");
    $CompanyService = Remote.Entity<Entity.Company>("Company");

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company.sections.new', {
            url: '/new',
            controller: 'CompanySectionController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }
        }).state('app.company.sections.edit', {
            url: '/:sectionId/edit',
            controller: 'CompanySectionController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }

        })
    }

    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { attachments: true });
    }

    save() {
        var inserting = !this.$Entity.Id;
        if (inserting) {
            this.$Entity.CompanyId = $stateParams['Id'];
        }
        return super.save().then(() => {
            $rootScope.$broadcast(inserting ? 'Entity.CompanySection.Inserted' : 'Entity.CompanySection.Updated', this.$Entity);
            Dialog.Hide();
        });
    }

    CloseDialog() {
        Dialog.Hide();
    }

    initialize() {
        return super.initialize().then(() => {
            Dialog.Show({
                controller: () => this,
                controllerAs: 'ctrl',
                templateUrl: 'src/web/Company/Sections/Edit.html'
            }).finally(() => {
                $state.go('^');
            });
        });
    }
}