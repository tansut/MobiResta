/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {EntityController} from './../../Kalitte/UI/EntityController';
import {MetaData} from '../../Data/MetaService';
import {Remote} from '../../Kalitte/Data/RemoteService';
import {Entity, Data, ViewModels} from '../../Data/Models';
import {$state, $stateParams, $timeout, $q} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';
import {Kalitte} from '../../Kalitte/Data/Models';

@Meta.Controller(EditMenuController.ControllerName)
export class EditMenuController extends EntityController<Entity.Menu> {
    public static ControllerName = 'EditMenuController';
    selectedLanguage: Entity.Culture;
    cultures: Array<Entity.Culture>;
    $Service = Remote.Entity<Entity.Menu>("Menu");


    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.menu.new',
            {
                url: '/new',
                templateUrl: "src/web/Menu/Edit.html",
                controller: EditMenuController.ControllerName,
                controllerAs: 'ctrl',
                data: { authenticated: true, title: 'Yeni Menu Oluştur' }
            })
            .state('app.menu.edit',
            {
                url: '/edit/:Id',
                templateUrl: "src/web/Menu/Edit.html",
                controller: EditMenuController.ControllerName,
                data: { title: 'Menüyü Güncelle' },
                controllerAs: 'ctrl',
            })
    }

    DisplayOptions() {
        var object = {};
        object[Entity.MenuDisplayOption.DisplayAlways] = 'Her zaman göster';
        object[Entity.MenuDisplayOption.DisplayByLanguage] = 'Müşteri dil seçimine uygunsa göster';
        object[Entity.MenuDisplayOption.None] = 'Menüyü gösterme';
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

    initialize() {
        return MetaData.ListCultures().then((cultures) => {
            this.cultures = cultures;
            return super.initialize();
        });
    }

    LoadEntity() {
        return super.LoadEntity().then(() => {
            this.selectedLanguage = _.find(this.cultures, 'Code', this.$Entity.Language) || <Entity.Culture>{};

        });
    }

    save() {
        this.$Entity.Language = this.selectedLanguage.Code;
        return super.save().then(() => {
            debugger;
            if (!this.$Id)
                $state.go("app.menu.sections", { Id: this.$Entity.Id });
            else this.historyBack();
        });
    }



    constructor($scope: angular.IScope) {
        super($scope);
    }

}   