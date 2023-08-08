/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {App, Application} from '../../Kalitte/Core/Application';
import {$timeout, $location, $rootScope, AngularService, $localStorage, $state} from '../../Kalitte/Vendor/AngularService';
import {$mdSidenav, $mdDialog, $mdUtil} from '../../Kalitte/Vendor/MaterialService';
import {Account} from '../../Kalitte/Data/AccountService';
import {AnonymousPrincipal} from '../../Kalitte/Core/Principal';
import {ISection, SectionType, IPage, Sitemap, ISiteMapItem} from '../../Kalitte/UI/SitemapService';
import {Meta} from '../../Kalitte/Core/Meta';
import { Translate, TranslateService } from '../../Kalitte/Vendor/TranslateService';

export var AppControllerInstance: AppController;

@Meta.Controller('AppController')
export class AppController extends ControllerBase {
    public static ControllerName = 'AppController';
    static ConfigureStates($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise('/app');
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,

            resolve: {
                app: () => App.Ready
            },

            views: {
                'page': {
                    templateUrl: 'src/web/App/App.html',
                    controller: function () {
                        return AppControllerInstance;
                    },
                },

                'sidenav': {
                    templateUrl: 'src/web/App/sidenav.html',
                    controller: function () {
                        return AppControllerInstance;
                    },
                    controllerAs: 'app'
                },

                'toolbar': {
                    templateUrl: 'src/web/App/toolbar.html',
                    controller: function () {
                        return AppControllerInstance;
                    },
                    controllerAs: 'app'
                }
            }
        })
    }

    Translate = Translate;
    Languages = TranslateService.Configuration.Languages;
    sitemap = Sitemap;
    menuSections: Array<ISection>;
    App: Application<any>;
    Test: string;
   
    autoFocusContent: boolean;
    toggleRight: () => void;
    toggleLeft: () => void;
    account = Account;
    profileModel: any;

    mainContentArea: any;

    changeLanguage(lang: string) {
        Translate.SetLanguage(lang);
        window.location.reload();
    }

    buildToggler(navID, method: string = 'toogle') {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID).toggle()
                .then(function () {
                });
        }, 300);
        return debounceFn;
    }

    generateMenuItems() {

        var self = this;
        this.menuSections = [];
        var acc = Account;
        var userAuthenticated = Account.principal.isAuthenticated;
        if (userAuthenticated)
            this.Test = Account.principal.identity.Title;

        var okForMenu = (item: ISiteMapItem): boolean => {
            if (item.authenticated === false) {
                if (!userAuthenticated)
                    return true;
            } else if (item.authenticated === true) {
                if (userAuthenticated)
                    return true;
            } else return true;

            return false;
        }

        var manageSection = (orig: ISection, dest?: ISection, target: string = 'menu') => {
            if (okForMenu(orig)) {
                var copySection: ISection = angular.extend({}, orig);
                copySection.pages = [];
                copySection.children = [];
                if (target == 'menu')
                    this.menuSections.push(copySection);
                else dest.children.push(copySection)
                if (orig.pages)
                    orig.pages.forEach((page) => {
                        if (okForMenu(page))
                            copySection.pages.push(page)
                    });
                if (orig.children)
                    orig.children.forEach((child) => {
                        manageSection(child, copySection, 'children');
                    })
            }
        }

        Sitemap.sections.forEach((section) => {
            if (okForMenu(section)) {
                manageSection(section);
            }
        });
    }

    initialize() {
        this.App = App;
        this.mainContentArea = document.querySelector("[role='main']");
        this.toggleRight = this.buildToggler('right');
        this.toggleLeft = this.buildToggler('left');

        $rootScope.$on('UserLoggedIn', this.generateMenuItems.bind(this));
        $rootScope.$on('UserLoggedOff', this.generateMenuItems.bind(this));

        return App.Ready.then(() => {
            this.generateMenuItems();
            $timeout(() => {
                angular.element(document.body).addClass('ready');
            }, 150);

        }).then(() => super.initialize()).then(() => {
                var self = this;
               
            if (this.account.principal.isAuthenticated)
                this.account.getUserProfile().then((response) => {
                    this.profileModel = response.data;

                });
        });
    }



    openMenu($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    }

    constructor($scope: angular.IScope) {
        super($scope);
        AppControllerInstance = this;
    }


    closeSidenav(menu: string = 'left') {
        $timeout(function () { $mdSidenav(menu).close(); });
    }

    openSidenav(menu: string = 'left') {
        $timeout(function () { $mdSidenav(menu).open(); });
    }

    path() {
        return $location.path();
    }

    goHome($event) {
        this.sitemap.selectPage(null, null);
        $location.path('/');
    }

    openPage() {
        this.closeSidenav();

        if (this.autoFocusContent) {
            this.focusMainContent();
            this.autoFocusContent = false;
        }
    }
    
    profileEdit: boolean;
    profileEditToggle() {
       
        this.profileEdit = !this.profileEdit;
    }

    focusMainContent($event?: ng.IAngularEvent) {
        // prevent skip link from redirecting
        if ($event) { $event.preventDefault(); }

        $timeout(function () {
            this.mainContentArea.focus();
        }, 90);

    }

    isSelected(page) {
        return this.sitemap.isPageSelected(page);
    }

    isSectionSelected(section) {
        var selected = false;
        var openedSection = this.sitemap.openedSection;
        if (openedSection === section) {
            selected = true;
        }
        else if (section.children) {
            section.children.forEach(function (childSection) {
                if (childSection === openedSection) {
                    selected = true;
                }
            });
        }
        return selected;
    }

    isOpen(section) {
        return this.sitemap.isSectionSelected(section);
    }

    toggleOpen(section) {
        this.sitemap.toggleSelectSection(section);
    }
    changeProfileInfo() {
        this.account.updateAccount(this.profileModel).then(() => {
            this.profileEditToggle();
            debugger;
          this.closeSidenav('right');
        });
    }


}   