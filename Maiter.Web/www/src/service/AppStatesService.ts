import {IAppState, AppState} from './SitemapService';

export var AppStates: AppStatesService;

export class AppStatesService {
    Root = <IAppState>{ name: 'app', url:'/app' };
    Home = <IAppState>{ name: 'app.home' };
    Account = <IAppState>{ name: 'app.account', url: '/account' };


    constructor() {
        AppStates = this;
    }
}