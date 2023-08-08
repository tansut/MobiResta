/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../ref/lodash/lodash.d.ts" />


import {EntityController} from './../../Kalitte/UI/EntityController';
import {MetaData} from '../../Data/MetaService';
import {Tag} from '../../Data/TagService';
import {Remote} from '../../Kalitte/Data/RemoteService';
import {Entity, Data, ViewModels} from '../../Data/Models';
import {$state, $stateParams, $timeout, $q} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';
import {Kalitte} from '../../Kalitte/Data/Models';
import { Dialog } from '../../Kalitte/UI/Web/DialogService';

interface CascadeSearch {
    menuSearch: string;
    sectionSearch: string;
    menuSelected: Entity.Menu;
    sectionSelected: Entity.MenuSection;
}


@Meta.Controller(EditFoodController.ControllerName)
export class EditFoodController extends EntityController<Entity.Food> {
    public static ControllerName = 'EditFoodController';
    public static LastCurrency = '';
    userMenuList: Array<Entity.Menu>;
    currencyList: Array<string>;
    cascade: CascadeSearch;
    $Service = Remote.Entity("Food");
    $MenuService = Remote.Entity("Menu");

    editingProperty: Entity.FoodProperty;
    editingPropertyTmp: Entity.FoodProperty;

    editingPropertyItem: Entity.FoodPropertyItem;
    editingPropertyItemTmp: Entity.FoodPropertyItem;

    initCascade() {
        this.cascade = <CascadeSearch>{
            menuSearch: '',
            sectionSearch: '',
            menuSelected: undefined,
            sectionSelected: undefined
        };
    }

    queryCurrency(search: string = undefined) {
        if (!this.$Ready)
            return $q.reject();

        return new $q((resolve) => {
            var list = this.currencyList;
            resolve(search ? list.filter((item) => typeof search == 'undefined' || item.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0) : list);
        });
    }

    queryMenu(search: string = undefined) {
        var listPromise: ng.IPromise<Array<Entity.Menu>>;
        var defer = $q.defer<Array<Entity.Menu>>();
        if (!this.$Ready)
            return $q.reject();

        var defer = $q.defer<Array<Entity.Menu>>();
        listPromise = defer.promise;
        defer.resolve(this.userMenuList);


        return this.errorHandled(listPromise.then((items) => {
            var list = this.userMenuList;
            return search ? list.filter((item) => typeof search == 'undefined' || item.Name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0) : list;
        }))
    }

    initDbValues() {
        var list = new Array<ng.IPromise<any>>();
        list.push(this.errorHandled(this.$MenuService.Call<Array<Entity.Menu>>('UserList', {}, {}).then((items) => {
            return this.userMenuList = items;
        })));
        list.push(this.errorHandled(MetaData.ListCurrency().then((list) => {
            return this.currencyList = list;
        })));

        return $q.all(list);
    }

    querySection(search: string = undefined) {
        if (!this.$Ready)
            return $q.reject();

        return this.queryMenu().then(() => {
            if (this.cascade.menuSelected)
                return _.filter(this.cascade.menuSelected.Sections, (item) => typeof search == 'undefined' || item.Name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0);
        });
    }

    queryTagSearch(search: string = undefined) {
        if (!this.$Ready)
            return $q.reject();

        return Tag.Search(Entity.Food.EntityName, search).then((tags) => {
            if (tags.length)
                return tags;
            else return [search];
        });

    }

    menuSelectedChange(item) {
        if (!item) {
            this.cascade.sectionSelected = undefined;
            this.cascade.sectionSearch = '';
        }
    }
    newTag(chip) {
        return <Entity.EntityTag>{
            Name: chip,
            EntityId: this.$Entity.Id,
            EntityName: Entity.Food.EntityName
        }
    }

    ExecuteQuery() {
        return this.$Service.Call('GetFoodWithProperties', {
            'attachments': true, 'tags': true, foodId: this.$Id
        });
    }


    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.food.new',
            {
                url: '/new/:menuId/:sectionId',
                templateUrl: "src/web/Food/Edit.html",
                controller: EditFoodController.ControllerName,
                controllerAs: 'ctrl',
                data: { authenticated: true, title: 'Menü İçeriği Oluştur' }
            })
            .state('app.food.edit',
            {
                url: '/edit/:Id',
                templateUrl: "src/web/Food/Edit.html",
                controller: EditFoodController.ControllerName,
                data: { authenticated: true, title: 'Güncelle' },
                controllerAs: 'ctrl',
            })
    }


    private showDialog(templateUrl, callbackFn?) {

        var dialog = Dialog.Show({
            controller: () => { return this; },
            templateUrl: templateUrl,
        });

        if (callbackFn)
            dialog.then(callbackFn, callbackFn);
    }

    private closeDialog() {
        if (this.editingPropertyItem) {
            this.swapTempPropertyItem();
        }
        Dialog.Hide();
    }

    private backToFoodEdit() {
        if (this.editingProperty) {
            this.swapTempProperty();
            this.editingProperty = null;
        }
    }


    //*
    // FoodProperty Methods begin
    //*

    //private showPropertyDialog() {
    //    this.showDialog('src/web/Food/propertyEdit.html', (succ) => {
    //        if (!succ) {
    //            this.swapTempProperty();
    //        }
    //    });
    //}

    newProperty() {
        this.editingProperty = <Entity.FoodProperty>{
            FoodId: this.$Id
        };
        if (!(this.$Entity.FoodProperties instanceof Array))
            this.$Entity.FoodProperties = new Array<Entity.FoodProperty>();
        //this.showPropertyDialog();
    }

    editProperty(property) {
        this.editingProperty = property;
        this.editingPropertyTmp = angular.copy(property);
      //  this.showPropertyDialog();
    }

    removeProperty(property) {
        _.remove(this.$Entity.FoodProperties, (e) => { return e === property });
    }

    priceTypes() {
        var priceTypes = {};
        priceTypes[Entity.FoodPriceType.Modifier] = 'Ekler';
        priceTypes[Entity.FoodPriceType.Net] = 'Değiştirir';
        return priceTypes;
    }

    getPriceType(priceType: Entity.FoodPriceType): string {
        return this.priceTypes()[priceType];
    }

    propertySelectionTypes() {
        var propertySelectionType = {};
        propertySelectionType[Entity.FoodPropertySelectionType.Single] = 'Tekil';
        propertySelectionType[Entity.FoodPropertySelectionType.Multiple] = 'Çoklu';
        propertySelectionType[Entity.FoodPropertySelectionType.MultipleLimited] = 'Çoklu Limitli';
        return propertySelectionType;
    }

    getPropertySelectionType(propertySelectionType: Entity.FoodPropertySelectionType): string {
        return this.propertySelectionTypes()[propertySelectionType];
    }

    MultipleLimitedSelType() {
        return Entity.FoodPropertySelectionType.MultipleLimited;
    }

    saveProperty() {

        var index = _.findIndex(this.$Entity.FoodProperties, (e) => { return e == this.editingProperty; });
        if (index === -1) {
            this.$Entity.FoodProperties.push(this.editingProperty);
        }
        this.editingProperty = null;
        this.editingPropertyTmp = null;
        //Dialog.Hide();
    }

    private swapTempProperty() {

        if (this.editingPropertyTmp) {
            var index = _.findIndex(this.$Entity.FoodProperties, (e) => { return e == this.editingProperty; });
            if (index > -1) {
                this.$Entity.FoodProperties[index] = this.editingPropertyTmp;
            }
        }
    }

    //*
    // FoodProperty Methods end
    //*

    //*
    // FoodPropertyItem Methods Begin
    //*

    private showPropertyItemDialog() {
        this.showDialog('src/web/Food/propertyItemEdit.html', (succ) => {
            if (!succ) {
                this.swapTempPropertyItem();
            }
        });
    }


    private swapTempPropertyItem() {
        if (this.editingPropertyItemTmp) {
            var index = _.findIndex(this.editingProperty.FoodPropertyItems, (e) => { return e == this.editingPropertyItem; });
            if (index > -1) {
                this.editingProperty.FoodPropertyItems[index] = this.editingPropertyItemTmp;
            }
        }
    }


    newPropertyItem(fProperty: Entity.FoodProperty) {
        if (!(fProperty.FoodPropertyItems instanceof Array))
            fProperty.FoodPropertyItems = new Array<Entity.FoodPropertyItem>();
        this.editingPropertyItem = <Entity.FoodPropertyItem>{
            FoodPropertyId: this.editingProperty.Id
        };
        this.showPropertyItemDialog();

    }

    editPropertyItem(propertyItem: Entity.FoodPropertyItem) {
        this.editingPropertyItem = propertyItem;
        this.editingPropertyItemTmp = angular.copy(propertyItem);
        this.showPropertyItemDialog();
    }

    savePropertyItem() {
        var index = _.findIndex(this.editingProperty.FoodPropertyItems, (e) => { return e == this.editingPropertyItem; });
        if (index === -1) {
            this.editingProperty.FoodPropertyItems.push(this.editingPropertyItem);
        }
        this.editingPropertyItemTmp = null;
        Dialog.Hide();
    }

    removePropertyItem(propertyItem: Entity.FoodPropertyItem) {
        _.remove(this.editingProperty.FoodPropertyItems, (e: Entity.FoodPropertyItem) => {
            return e === propertyItem;
        });
    }
    
    //*
    // FoodPropertyItem Methods end
    //*

    save() {
        if (!this.cascade.menuSelected || !this.cascade.sectionSelected) {
            this.error('Lütfen ilişkili menü kısmını seçin');
            return null;
        }

        this.$Entity.MenuSectionId = this.cascade.sectionSelected.Id;
        EditFoodController.LastCurrency = this.$Entity.Currency;
        return super.save().then(() => {
            this.historyBack();
        });
    }

    initialize(): ng.IPromise<any> {
        this.initCascade();
        var initPromise = this.initDbValues();

        return initPromise.then(() => {
            return super.initialize().then(() => {

                if (!this.$Id) {
                    var menuSection = $stateParams['sectionId'];
                    this.cascade.menuSelected = _.find<Entity.Menu>(this.userMenuList, 'Id', $stateParams['menuId']);
                    this.cascade.sectionSelected = _.find<Entity.MenuSection>(this.cascade.menuSelected.Sections, 'Id', menuSection);
                } else {
                    this.cascade.menuSelected = _.find<Entity.Menu>(this.userMenuList, (item) => {
                        return _.find(item.Sections, 'Id', this.$Entity.MenuSectionId) != null;
                    });
                    this.cascade.sectionSelected = _.find<Entity.MenuSection>(this.cascade.menuSelected.Sections, 'Id', this.$Entity.MenuSectionId);
                }

                if (!this.$Id && EditFoodController.LastCurrency)
                    this.$Entity.Currency = EditFoodController.LastCurrency;
            })


        })
    }

    EmptyEntity() {
        return <Entity.Food>{
            Tags: new Array<Entity.EntityTag>()
        };
    }

    constructor($scope: angular.IScope) {
        super($scope);
        this.$Entity = this.EmptyEntity();
    }
}   