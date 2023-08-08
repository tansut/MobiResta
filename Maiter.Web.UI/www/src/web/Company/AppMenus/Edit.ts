import {EntityController} from '../../../Kalitte/UI/EntityController';
import {EntityListController} from '../../../Kalitte/UI/EntityListController';
import {Entity, Data, ViewModels, Security} from '../../../Data/Models';
import {Kalitte} from '../../../Kalitte/Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {BSMenu} from '../../../Kalitte/UI/Web/BSMenuService';
import {BSMenuItem} from '../../../Kalitte/UI/BSMenu';
import {MetaData} from '../../../Data/MetaService';



@Meta.Controller('CompanyMenuItemController')
export class CompanyMenuItemController extends EntityController<Entity.CompanyAppMenuItem> {
    idParameter = 'MenuItemId';
    $Service = Remote.Entity<Entity.CompanyAppMenuItem>("CompanyAppMenuItem");
    $CompanyService = Remote.Entity<Entity.Company>("Company");
    selectedLanguage: Entity.Culture;
    cultures: Array<Entity.Culture>;

    DisplayOptions() {
        var object = {};
        object[Entity.MenuDisplayOption.DisplayAlways] = 'Her zaman göster';
        object[Entity.MenuDisplayOption.DisplayByLanguage] = 'Müşteri dil seçimine uygunsa göster';
        object[Entity.MenuDisplayOption.None] = 'Menüyü gösterme';
        return object;
    }

    DisplayTypes() {
        var object = {};
        object[Entity.AppMenuDisplayOption.DisplayAsHome] = 'Display as Home menu';
        object[Entity.AppMenuDisplayOption.DisplayAsWelcome] = 'Display as Welcome message';
        object[Entity.AppMenuDisplayOption.Both] = 'Both';
        return object;
    }

    queryLanguage(search: string = undefined) {
        if (!this.$Ready)
            return $q.reject();

        return new $q((resolve) => {
            var list = (search ? this.cultures.filter((item) => typeof search == 'undefined' || item.Name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0) : this.cultures);
            resolve(list);
        });
    }

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.company.appmenus.new', {
            url: '/new',
            controller: 'CompanyMenuItemController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }
        }).state('app.company.appmenus.edit', {
            url: '/:MenuItemId/edit',
            controller: 'CompanyMenuItemController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            }
        })
    }

    initialize() {
        return MetaData.ListCultures().then((cultures) => {
            this.cultures = cultures;
            return super.initialize().then(() => {
                Dialog.Show({
                    controller: () => this,
                    controllerAs: 'ctrl',
                    templateUrl: 'src/web/Company/appmenus/Edit.html'
                }).finally(() => {
                    $state.go('^')
                });
            });
        });
    }

    LoadEntity() {
        return super.LoadEntity().then(() => {
            this.selectedLanguage = _.find(this.cultures, 'Code', this.$Entity.Language) || <Entity.Culture>{};
        });
    }



    save() {
        this.$Entity.Language = this.selectedLanguage.Code;
        var inserting = !this.$Entity.Id;

        if (inserting) {
            this.$Entity.CompanyId = $stateParams['Id'];
        }
        return super.save().then(() => {
            $rootScope.$broadcast(inserting ? 'Entity.CompanyAppMenuItem.Inserted' : 'Entity.CompanyAppMenuItem.Updated', this.$Entity);
            Dialog.Hide();
        })

    }

    CloseDialog() {
        Dialog.Hide();
    }


}