
import {$rootScope, $location, $state} from './AngularService';
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

export interface IAppState {
    name: string;
    url?: string;
    title?: string;
}

export class AppState {

    public static Get(stateName: string): IAppState {
        var state = $state.get(stateName);
        if (!state)
            throw new Error('Not found state ' + stateName);
        var result = <IAppState>{
            name: stateName,
            url: state.url,
            title: state.data && state.data.title
        };

        var states = stateName.split('.');        
        if (states.length > 1) {
            var url = '', stateTemp = '';
            states.forEach((item) => {

                if (stateTemp == '')
                    stateTemp = item;
                else stateTemp = stateTemp + '.' + item;

                var parentState = $state.get(stateTemp);
                if (parentState) {
                    url = url + parentState.url;
                }
            });
            result.url = url;
        }


        return result;
    }
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

    constructor(name: string, type: string, children?: Array<ISection>) {
        super(name);
        this.type = type;
        if (children)
            children.forEach((item) => this.children.push(item));
    }

    public static FromState(stateName: string, titleOverride?: string): Section {
        var instance = new Section(stateName, 'link');

        var state = AppState.Get(stateName);
        if (!state)
            throw Error('State not found: ' + stateName);
        instance.url = state.url;
        instance.label = state.title;
        if (titleOverride)
            instance.label = titleOverride;
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
        var state = AppState.Get(stateName);
        if (!state)
            throw Error('State not found: ' + stateName);
        instance.url = state.url;
        instance.label = state.title;
        if (titleOverride)
            instance.label = titleOverride;
        return instance;
    }

    setAuth(value: boolean): Page {
        this.authenticated = value;
        return this;
    }
}

export class SitemapService {
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

    }

    constructor() {
        this.generateMenuItems();
        $rootScope.$on('$locationChangeSuccess', this.onLocationChange.bind(this));
        Sitemap = this;
    }

}


