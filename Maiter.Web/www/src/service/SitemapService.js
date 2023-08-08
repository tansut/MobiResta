var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AngularService_1 = require('./AngularService');
exports.Sitemap;
exports.SectionType = {
    heading: 'heading',
    link: 'link',
    toggle: 'toggle'
};
var AppState = (function () {
    function AppState() {
    }
    AppState.Get = function (stateName) {
        var state = AngularService_1.$state.get(stateName);
        if (!state)
            throw new Error('Not found state ' + stateName);
        var result = {
            name: stateName,
            url: state.url,
            title: state.data && state.data.title
        };
        var states = stateName.split('.');
        if (states.length > 1) {
            var url = '', stateTemp = '';
            states.forEach(function (item) {
                if (stateTemp == '')
                    stateTemp = item;
                else
                    stateTemp = stateTemp + '.' + item;
                var parentState = AngularService_1.$state.get(stateTemp);
                if (parentState) {
                    url = url + parentState.url;
                }
            });
            result.url = url;
        }
        return result;
    };
    return AppState;
})();
exports.AppState = AppState;
var SiteMapItem = (function () {
    function SiteMapItem(name) {
        this.roles = new Array();
        this.authenticated = undefined;
        this.name = name;
    }
    return SiteMapItem;
})();
exports.SiteMapItem = SiteMapItem;
var Section = (function (_super) {
    __extends(Section, _super);
    function Section(name, type, children) {
        var _this = this;
        _super.call(this, name);
        this.children = Array();
        this.pages = Array();
        this.type = type;
        if (children)
            children.forEach(function (item) { return _this.children.push(item); });
    }
    Section.FromState = function (stateName, titleOverride) {
        var instance = new Section(stateName, 'link');
        var state = AppState.Get(stateName);
        if (!state)
            throw Error('State not found: ' + stateName);
        instance.url = state.url;
        instance.label = state.title;
        if (titleOverride)
            instance.label = titleOverride;
        return instance;
    };
    Section.prototype.setAuth = function (value) {
        this.authenticated = value;
        return this;
    };
    return Section;
})(SiteMapItem);
exports.Section = Section;
var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        _super.apply(this, arguments);
    }
    Page.FromState = function (stateName, titleOverride) {
        var instance = new Page(stateName);
        var state = AppState.Get(stateName);
        if (!state)
            throw Error('State not found: ' + stateName);
        instance.url = state.url;
        instance.label = state.title;
        if (titleOverride)
            instance.label = titleOverride;
        return instance;
    };
    Page.prototype.setAuth = function (value) {
        this.authenticated = value;
        return this;
    };
    return Page;
})(SiteMapItem);
exports.Page = Page;
var SitemapService = (function () {
    function SitemapService() {
        this.sections = new Array();
        this.generateMenuItems();
        AngularService_1.$rootScope.$on('$locationChangeSuccess', this.onLocationChange.bind(this));
        exports.Sitemap = this;
    }
    SitemapService.prototype.selectSection = function (section) {
        this.openedSection = section;
    };
    SitemapService.prototype.toggleSelectSection = function (section) {
        this.openedSection = (this.openedSection === section ? null : section);
    };
    SitemapService.prototype.isSectionSelected = function (section) {
        return this.equals(this.openedSection, section);
    };
    SitemapService.prototype.selectPage = function (section, page) {
        this.currentSection = section;
        this.currentPage = page;
    };
    SitemapService.prototype.isPageSelected = function (page) {
        return this.equals(this.currentPage, page);
    };
    SitemapService.prototype.onLocationChange = function () {
        var _this = this;
        var path = AngularService_1.$location.path();
        this.locate(path, function (section, page) {
            _this.selectSection(section);
            _this.selectPage(section, page);
        });
    };
    SitemapService.prototype.equals = function (item1, item2) {
        return item1 === item2 ||
            (item1.id && item2.id ? (item1.id === item2.id) : false) ||
            (item1.name && item2.name ? (item1.name === item2.name) : false);
    };
    SitemapService.prototype.locate = function (path, callback) {
        var matchPage = function (section, page) {
            if (path === page.url) {
                callback(section, page);
            }
        };
        this.sections.forEach(function (section) {
            if (section.type === 'link') {
                matchPage.call(this, section, section);
            }
            else if (section.children) {
                section.children.forEach(function (childSection) {
                    if (childSection.pages) {
                        childSection.pages.forEach(function (page) {
                            matchPage.call(this, childSection, page);
                        }, this);
                    }
                }, this);
            }
            else if (section.pages) {
                section.pages.forEach(function (page) {
                    matchPage.call(this, section, page);
                }, this);
            }
        }, this);
    };
    SitemapService.prototype.generateMenuItems = function () {
        this.sections.push(Section.FromState('app.home'));
        var accountHeader = new Section('Kullanıcı Hesabı İşlemleri', 'heading');
        this.sections.push(accountHeader);
        var accountSection = new Section('Hesap İşlemleri', 'toggle');
        accountHeader.children.push(accountSection);
        accountSection.pages.push(Page.FromState('app.account.login').setAuth(false));
        accountSection.pages.push(Page.FromState('app.account.resetpassword').setAuth(false));
        accountSection.pages.push(Page.FromState('app.account.signOff').setAuth(true));
        var insSectionHeader = new Section('Kurumsal', 'heading');
        this.sections.push(insSectionHeader);
        var orgySection = new Section('Restaurant İşlemleri', 'toggle');
        insSectionHeader.children.push(orgySection);
        orgySection.pages.push(Page.FromState('app.company.list'));
        orgySection.pages.push(Page.FromState('app.company.new'));
    };
    return SitemapService;
})();
exports.SitemapService = SitemapService;
