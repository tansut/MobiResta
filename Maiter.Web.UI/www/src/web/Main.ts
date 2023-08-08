import './References';
import {MaiterWebApplication, IMaiterWebApplicationConfig} from '../Core/MaiterWebApplication';

var defaultLang = 'en';

try {
    defaultLang = config.ServiceConfig['TranslateService'].Default = (navigator.userLanguage || navigator.language).split('-')[0];
} catch (e) {
}

var config = <IMaiterWebApplicationConfig>{
    ApplicationName: "Maiter.WebApplication",
    ApplicationTitle: "MobiResta",
    PublicClientId: 'theClientId',
    AuthStorageKey: 'theAuthStorageKey',
    PrincipalStorageKey: 'thePrincipalStorageKey',
    ShortLivedClientId: 'defaultSlidingExprationClient',
    ServiceConfig: {
        'SitemapService': {
            ConfigFile: 'config/web-SitemapService.json'
        },
        'RemoteService': {
            ConfigFile: 'config/web-RemoteService.json'
        },
        'TranslateService': {
            Languages: {
                en: 'English',
                tr: 'Turkish'
            },
            Default: defaultLang,
            Debug: true
        }
    },

    RunningMode: "debug"
};

var app = new MaiterWebApplication(config);
console.log('Trying to boot application ...');
app.Boot().then(
    () => console.log(config.ApplicationName + ' successfully booted.'),
    (err) => {
        console.log(config.ApplicationName + ' failed');
        console.log(err);
    });

