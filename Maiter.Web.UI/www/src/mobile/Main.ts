import './References';
import {IMaiterMobileApplicationConfig, MaiterMobileApplication} from '../Core/MaiterMobileApplication';

var defaultLang = 'en';

var config: IMaiterMobileApplicationConfig = {
    ApplicationName: "Maiter.MobileApplication",
    ApplicationTitle: "MobiResta",
    PublicClientId: 'theClientId',
    AuthStorageKey: 'theAuthStorageKeyMobil',
    PrincipalStorageKey: 'thePrincipalStorageKeyMobil',
    ShortLivedClientId: 'defaultSlidingExprationClient',
    ServiceConfig: {
        'SitemapService': {
            ConfigFile: 'config/mobile-SitemapService.json'
        },
        'RemoteService': {
            ConfigFile: 'config/mobile-RemoteService.json'
        },
        'TranslateService': {
            Languages: {
                en: 'English',
                tr: 'Turkish'
            },
            Default: 'en',
            Debug: true
        },
        'AESService': {
            Title: '*ID//Generatorx*'
        },
        'SignalRHubConfiguration': {
            Server: '/signalr',
            Hub: 'defaultHub'
        },

        'SignalRConnectionService': {
            Path: '/SignalRService'
        }
    },

    RunningMode: "debug"
};

function RunApp() {
    var app = new MaiterMobileApplication(config);
    console.log('Trying to boot application ...');
    app.Boot().then(
        () => console.log(config.ApplicationName + ' successfully booted.'),
        (err) => {
            console.log(config.ApplicationName + ' failed');
            console.log(err);
        });
}

if (!window.cordova) {
    try {
        config.ServiceConfig['TranslateService'].Default = (navigator.userLanguage || navigator.language).split('-')[0];
    } catch (e) {

    }
    RunApp();
} else {
    RunApp();

    //navigator.globalization.getPreferredLanguage(
    //    function (language) {            
    //        try {
    //            config.ServiceConfig['TranslateService'].Default = language.value.split('-')[0];
    //        } catch (e) {
    //        }
    //        RunApp();
    //    },
    //    function () { console.log('Error getting language\n'); RunApp(); }
    //    );
}
