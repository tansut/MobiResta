/// <reference path="../../ref/angularjs/angular.d.ts" />


import {Meta} from '../Core/Meta';
import {BaseService, ServiceConfiguration} from '../Core/BaseService';
import {$localStorage} from './AngularService';


export var Translate: TranslateService;

interface TranslateConfiguration extends ServiceConfiguration {
    Languages: {
        [id: string]: string
    }
    Default: string;
    Debug: boolean;
}

@Meta.Service('TranslateService')
export class TranslateService extends BaseService {

    static Configuration: TranslateConfiguration;

    static InstanceReady(instance) {
        Translate = instance;
    }

    static Configure(factory, app, config: TranslateConfiguration) {
        TranslateService.Configuration = config;
        BaseService.Configure(factory, app, config);
    }

    static $inject = ['gettextCatalog', 'gettext'];

    CurrentLanguage() {
        return this.Catalog.currentLanguage;
    }

    SetLanguage(lang: string) {
        this.Catalog.setCurrentLanguage(lang);
        $localStorage.set('lang', this.Catalog.currentLanguage);
    }

    constructor(public Catalog, public GetText) {
        super();
        Catalog.debug = TranslateService.Configuration.Debug;
        var userLang = $localStorage.get<string>('lang');
        if (!TranslateService.Configuration.Languages[userLang])
            userLang = TranslateService.Configuration.Default;
        Catalog.setCurrentLanguage(userLang);
        //Catalog.baseLanguage = 'tr';
    }
}