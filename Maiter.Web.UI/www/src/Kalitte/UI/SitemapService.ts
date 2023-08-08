import {$rootScope, $location, $state, AngularService, $q, $timeout, $http} from '../Vendor/AngularService';
import {Meta} from '../Core/Meta';
import {BaseService, ServiceConfiguration} from '../Core/BaseService';
import {App} from '../Core/Application';
import {UIState, StateInfo} from '../Core/UIState';


export var Sitemap: SitemapService;

export var SectionType = {
    heading: 'heading',
    link: 'link',
    toggle: 'toggle'
}

export interface ISiteMapItem {
    id?: string;
    state?: string;
    name: string;
    label?: string;
    url?: string;
    roles?: Array<string>;
    authenticated?: boolean;
}

export interface IPage extends ISiteMapItem {
}

export interface ISection extends ISiteMapItem {
    type: string;
    children?: Array<ISection>;
    pages?: Array<IPage>;
}



export class SiteMapItem implements ISiteMapItem {
    id: string;
    state: string;
    name: string;
    label: string;
    roles = new Array<string>();
    authenticated: boolean = undefined;

    constructor(name: string) {
        this.name = name;
    }
}

export class Section extends SiteMapItem implements ISection {
    type: string;
    children = Array<ISection>();
    pages = Array<IPage>();
    url: string;

    constructor(name: string, type: string, children?: Array<ISection>, pages?: Array<IPage>) {
        super(name);
        this.type = type;
        if (children)
            children.forEach((item) => this.children.push(item));
        if (pages)
            pages.forEach((item) => this.pages.push(item));
    }

    public static FromState(stateName: string, titleOverride?: string): Section {
        var instance = new Section(stateName, 'link');

        var state = <UIState>$state.get(stateName);
        if (!state) {
            throw new Error('Not found state ' + stateName);

        }
        instance.url = $state.href(state);
        instance.label = state.data ? state.data.title: '';
        if (titleOverride)
            instance.label = titleOverride;
        instance.authenticated = state.data ? state.data.authenticated : undefined;
        instance.roles = state.data ? state.data.roles : undefined;
        return instance;
    }

    setAuth(value: boolean): Section {
        this.authenticated = value;
        return this;
    }
}

export class Page extends SiteMapItem implements IPage {
    public url: string;
    public static FromState(stateName: string, titleOverride?: string): Page {
        var instance = new Page(stateName);
        var state = <UIState>$state.get(stateName);
        if (!state) {
            throw new Error('Not found state ' + stateName);
        }
        instance.url = $state.href(state);
        instance.label = state.data ? state.data.title: '';
        if (titleOverride)
            instance.label = titleOverride;
        instance.authenticated = state.data ? state.data.authenticated : undefined;
        instance.roles = state.data ? state.data.roles : undefined;
        return instance;
    }

    setAuth(value: boolean): Page {
        this.authenticated = value;
        return this;
    }
}

interface SitemapServiceConfiguration extends ServiceConfiguration {
}


@Meta.Service('SitemapService')
export class SitemapService extends BaseService {

    static Configuration: SitemapServiceConfiguration;

    static Configure(factory, app, config: SitemapServiceConfiguration) {
        SitemapService.Configuration = config;
        BaseService.Configure(factory, app, config);
    }


    public sections = new Array<ISection>();

    openedSection: ISection;
    currentSection: ISection;
    currentPage: IPage;

    selectSection(section) {
        this.openedSection = section;
    }

    toggleSelectSection(section) {
        this.openedSection = (this.openedSection === section ? null : section);
    }

    isSectionSelected(section: ISection) {
        return this.equals(this.openedSection, section);
    }

    selectPage(section, page) {
        this.currentSection = section;
        this.currentPage = page;
    }

    isPageSelected(page: IPage) {
        return this.equals(this.currentPage, page);
    }

    onLocationChange() {
        var path = $location.path();

        this.locate(path, (section, page) => {
            this.selectSection(section);
            this.selectPage(section, page);
        });
    }

    equals(item1: ISiteMapItem, item2: ISiteMapItem) {
        if (!item1 || !item2)
            return false;
        return item1 === item2 ||
            (item1.id && item2.id ? (item1.id === item2.id) : false) ||
            (item1.name && item2.name ? (item1.name === item2.name) : false);
    }

    locate(path: string, callback: (section: ISection, page: IPage) => void) {

        var matchPage = function (section, page) {
            if (path === page.url) {
                callback(section, page);
            }
        };

        this.sections.forEach(function (section) {
            if (section.type === 'link') {
                matchPage.call(this, section, section);
            } else
                if (section.children) {
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
    }


    generateMenuItems() {

        var createSection = (item: ISection, children?: Array<ISection>, pages?: Array<IPage>): Section => {
            var result: Section;
            if (item.type == 'link')
                result = Section.FromState(item.name);
            else result = new Section(item.name, item.type, children, pages);
            if (typeof item.authenticated != 'undefined')
                result.authenticated = item.authenticated;
            if (typeof item.roles != 'undefined')
                result.roles = item.roles;
            return result;
        }

        var fillSection = (item: ISection, section: Section) => {
            item.children = item.children || [];
            item.pages = item.pages || [];
            item.children.forEach((child: ISection) => {
                var childSection = createSection(child);
                fillSection(child, childSection);
                section.children.push(childSection);
            });

            item.pages.forEach((child: IPage) => {
                var childPage = Page.FromState(child.name)
                section.pages.push(childPage);
            });
        }


        return $http.get(SitemapService.Configuration.ConfigFile, { responseType: 'json' }).then((result) => {
            var sections = <Array<ISection>>result.data;
            var section: Section;
            var children: Array<ISection>;
            var pages: Array<IPage>;
            sections.forEach((item) => {
                section = createSection(item, children, pages);
                fillSection(item, section);


                //children = new Array<ISection>();
                //if (item.children)
                //    item.children.forEach((child: ISection) => {
                //        children.push(createSection(child, child.children));
                //    });
                //pages = new Array<IPage>();
                //if (item.pages)
                //    item.pages.forEach((child: ISection) => {
                //        pages.push(Page.FromState('app.account.login'));
                //    });

                
                this.sections.push(section);
            });
        });



        //this.sections.push(Section.FromState('app.home'));

        //var accountHeader = new Section('Kullanıcı Hesabı İşlemleri', 'heading');
        //this.sections.push(accountHeader);
        //var accountSection = new Section('Hesap İşlemleri', 'toggle');
        //accountHeader.children.push(accountSection);
        //accountSection.pages.push(Page.FromState('app.account.login').setAuth(false));
        //accountSection.pages.push(Page.FromState('app.account.signOff').setAuth(true));
        //accountSection.pages.push(Page.FromState('app.account.register').setAuth(false));

        //var insSectionHeader = new Section('Kurumsal', 'heading');
        //this.sections.push(insSectionHeader);
        //var orgySection = new Section('Restaurant İşlemleri', 'toggle');
        //insSectionHeader.children.push(orgySection);

        //orgySection.pages.push(Page.FromState('app.company.list'));
    }

    static InstanceReady(instance) {
        Sitemap = instance;
    }

    constructor() {
        super();
        this.Resolve['SiteMapService:LoadMenuItems'] = this.generateMenuItems();
        $rootScope.$on('$locationChangeSuccess', this.onLocationChange.bind(this));
    }
}


