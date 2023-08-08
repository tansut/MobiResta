/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Registration} from '../../service/RegistrationService';
import {BaseController} from '../../lib/BaseController';
import {$timeout, $location, $rootScope} from '../../service/AngularService';
import {$mdSidenav, $mdDialog, $mdUtil} from '../../service/MaterialService';
import {Account} from '../../service/data/AccountService';
import {AnonymousPrincipal} from '../../lib/Security';
import {ISection, SectionType, IPage, Sitemap, ISiteMapItem} from '../../service/SitemapService';

export var AppControllerInstance: AppController;

export class AppController extends BaseController {
    public static ControllerName = 'AppController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,

            views: {
                'page': {
                    templateUrl: 'src/app/App/app.html',
                    controller: function () {
                        return AppControllerInstance;
                    },
                },

                'sidenav': {
                    templateUrl: 'src/app/App/sidenav.html',
                    controller: function () {
                        return AppControllerInstance;
                    },
                    controllerAs: 'app'
                },

                'toolbar': {
                    templateUrl: 'src/app/App/toolbar.html',
                    controller: function () {
                        return AppControllerInstance;
                    },
                    controllerAs: 'app'
                }

            }
        })
    }

    sitemap = Sitemap;
    menuSections: Array<ISection>;

    autoFocusContent: boolean;
    toggleRight: () => void;
    toggleLeft: () => void;
    account = Account;


    mainContentArea: any;

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
        var userAuthenticated = Account.principal.isAuthenticated;

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

    constructor($scope: angular.IScope) {
        super($scope);
        AppControllerInstance = this;
        this.mainContentArea = document.querySelector("[role='main']");
        this.toggleRight = this.buildToggler('right');
        this.toggleLeft = this.buildToggler('left');
        this.generateMenuItems();
        $rootScope.$on('UserLoggedIn', this.generateMenuItems.bind(this));
        $rootScope.$on('UserLoggedOff', this.generateMenuItems.bind(this));
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

    static register = Registration.RegisterController(AppController.ControllerName, AppController);

}   