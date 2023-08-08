/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RegistrationService_1 = require('../../service/RegistrationService');
var BaseController_1 = require('../../lib/BaseController');
var AngularService_1 = require('../../service/AngularService');
var MaterialService_1 = require('../../service/MaterialService');
var AccountService_1 = require('../../service/data/AccountService');
var SitemapService_1 = require('../../service/SitemapService');
exports.AppControllerInstance;
var AppController = (function (_super) {
    __extends(AppController, _super);
    function AppController($scope) {
        _super.call(this, $scope);
        this.sitemap = SitemapService_1.Sitemap;
        this.account = AccountService_1.Account;
        exports.AppControllerInstance = this;
        this.mainContentArea = document.querySelector("[role='main']");
        this.toggleRight = this.buildToggler('right');
        this.toggleLeft = this.buildToggler('left');
        this.generateMenuItems();
        AngularService_1.$rootScope.$on('UserLoggedIn', this.generateMenuItems.bind(this));
        AngularService_1.$rootScope.$on('UserLoggedOff', this.generateMenuItems.bind(this));
    }
    AppController.ConfigureStates = function ($stateProvider) {
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            views: {
                'page': {
                    templateUrl: 'src/app/App/app.html',
                    controller: function () {
                        return exports.AppControllerInstance;
                    },
                },
                'sidenav': {
                    templateUrl: 'src/app/App/sidenav.html',
                    controller: function () {
                        return exports.AppControllerInstance;
                    },
                    controllerAs: 'app'
                },
                'toolbar': {
                    templateUrl: 'src/app/App/toolbar.html',
                    controller: function () {
                        return exports.AppControllerInstance;
                    },
                    controllerAs: 'app'
                }
            }
        });
    };
    AppController.prototype.buildToggler = function (navID, method) {
        if (method === void 0) { method = 'toogle'; }
        var debounceFn = MaterialService_1.$mdUtil.debounce(function () {
            MaterialService_1.$mdSidenav(navID).toggle()
                .then(function () {
            });
        }, 300);
        return debounceFn;
    };
    AppController.prototype.generateMenuItems = function () {
        var _this = this;
        var self = this;
        this.menuSections = [];
        var userAuthenticated = AccountService_1.Account.principal.isAuthenticated;
        var okForMenu = function (item) {
            if (item.authenticated === false) {
                if (!userAuthenticated)
                    return true;
            }
            else if (item.authenticated === true) {
                if (userAuthenticated)
                    return true;
            }
            else
                return true;
            return false;
        };
        var manageSection = function (orig, dest, target) {
            if (target === void 0) { target = 'menu'; }
            if (okForMenu(orig)) {
                var copySection = angular.extend({}, orig);
                copySection.pages = [];
                copySection.children = [];
                if (target == 'menu')
                    _this.menuSections.push(copySection);
                else
                    dest.children.push(copySection);
                if (orig.pages)
                    orig.pages.forEach(function (page) {
                        if (okForMenu(page))
                            copySection.pages.push(page);
                    });
                if (orig.children)
                    orig.children.forEach(function (child) {
                        manageSection(child, copySection, 'children');
                    });
            }
        };
        SitemapService_1.Sitemap.sections.forEach(function (section) {
            if (okForMenu(section)) {
                manageSection(section);
            }
        });
    };
    AppController.prototype.closeSidenav = function (menu) {
        if (menu === void 0) { menu = 'left'; }
        AngularService_1.$timeout(function () { MaterialService_1.$mdSidenav(menu).close(); });
    };
    AppController.prototype.openSidenav = function (menu) {
        if (menu === void 0) { menu = 'left'; }
        AngularService_1.$timeout(function () { MaterialService_1.$mdSidenav(menu).open(); });
    };
    AppController.prototype.path = function () {
        return AngularService_1.$location.path();
    };
    AppController.prototype.goHome = function ($event) {
        this.sitemap.selectPage(null, null);
        AngularService_1.$location.path('/');
    };
    AppController.prototype.openPage = function () {
        this.closeSidenav();
        if (this.autoFocusContent) {
            this.focusMainContent();
            this.autoFocusContent = false;
        }
    };
    AppController.prototype.focusMainContent = function ($event) {
        // prevent skip link from redirecting
        if ($event) {
            $event.preventDefault();
        }
        AngularService_1.$timeout(function () {
            this.mainContentArea.focus();
        }, 90);
    };
    AppController.prototype.isSelected = function (page) {
        return this.sitemap.isPageSelected(page);
    };
    AppController.prototype.isSectionSelected = function (section) {
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
    };
    AppController.prototype.isOpen = function (section) {
        return this.sitemap.isSectionSelected(section);
    };
    AppController.prototype.toggleOpen = function (section) {
        this.sitemap.toggleSelectSection(section);
    };
    AppController.ControllerName = 'AppController';
    AppController.register = RegistrationService_1.Registration.RegisterController(AppController.ControllerName, AppController);
    return AppController;
})(BaseController_1.BaseController);
exports.AppController = AppController;
