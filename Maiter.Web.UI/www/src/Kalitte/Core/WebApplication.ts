/// <reference path="../../ref/reflect-metadata/reflect-metadata.d.ts" />

import {Application, IApplicationConfig, AppPlatform} from '../../Kalitte/Core/Application';
import {$mdSidenav, $mdDialog, $mdToast} from '../Vendor/MaterialService';
import {BlockUI} from '../Vendor/BlockUIService';

export interface IWebApplicationConfig extends IApplicationConfig {

}


export class WebApplication extends Application<IWebApplicationConfig> {

    Platform = AppPlatform.Desktop;

    Busy(msg: string, promise?: ng.IPromise<any>, delay?: number) {
        if (promise) {
            BlockUI.Service.start(msg);
            promise.finally(() => {
                BlockUI.Service.stop();
            });
        } else BlockUI.Service.message(msg);
    }


    Alert(content: string, title?: string) {
        return $mdDialog.show(
            $mdDialog.alert()
                .title(title || 'Mesajınız var')
                .content(content)
                .ok('Tamam')
            );
    }


    Toast(msg: string, delay?: number) {
        return $mdToast.show(
            $mdToast.simple()
                .content(msg)
                .position('top left right')
                .hideDelay(delay || 3000)
            );
    }


    Confirm(content: string, title?: string) {
        var confirm = $mdDialog.confirm()
            .title(title || 'Lütfen onaylayın veya iptal edin')
            .content(content)
            .ok('Tamam')
            .cancel('Cancel');

        return $mdDialog.show(confirm);
    }

    constructor(config: IWebApplicationConfig) {
        super(config);

        this.AngularApp.config(['blockUIConfig', (blockUIConfig) => {
            blockUIConfig.message = 'İşlem devam ediyor...';
            blockUIConfig.delay = 1500;
        }]);

        this.AngularApp.config(['$mdIconProvider', ($mdIconProvider) => {
            $mdIconProvider
                .iconSet('action', 'img/icons/material-design/action-icons.svg', 24)
                .iconSet('alert', 'img/icons/material-design/alert-icons.svg', 24)
                .iconSet('av', 'img/icons/material-design/av-icons.svg', 24)
                .iconSet('communication', 'img/icons/material-design/communication-icons.svg', 24)
                .iconSet('content', 'img/icons/material-design/content-icons.svg', 24)
                .iconSet('device', 'img/icons/material-design/device-icons.svg', 24)
                .iconSet('editor', 'img/icons/material-design/editor-icons.svg', 24)
                .iconSet('file', 'img/icons/material-design/file-icons.svg', 24)
                .iconSet('hardware', 'img/icons/material-design/hardware-icons.svg', 24)
                .iconSet('icons', 'img/icons/material-design/icons-icons.svg', 24)
                .iconSet('image', 'img/icons/material-design/image-icons.svg', 24)
                .iconSet('maps', 'img/icons/material-design/maps-icons.svg', 24)
                .iconSet('navigation', 'img/icons/material-design/navigation-icons.svg', 24)
                .iconSet('notification', 'img/icons/material-design/notification-icons.svg', 24)
                .iconSet('social', 'img/icons/material-design/social-icons.svg', 24)
                .iconSet('toggle', 'img/icons/material-design/toggle-icons.svg', 24)
            //.defaultIconSet('img/icons/sets/core-icons.svg', 24);
        }]);


    }
}