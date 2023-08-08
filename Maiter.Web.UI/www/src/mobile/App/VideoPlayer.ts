/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/lodash/lodash.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $http, $stateParams, $sce} from '../../Kalitte/Vendor/AngularService';
import {Account} from '../../Kalitte/Data/AccountService';
import {Remote} from '../../Kalitte/Data/RemoteService';
import {Entity} from '../../Data/Models';
import {GetYoutubeEmbedUrl} from '../../Core/Helpers';
import {Meta} from '../../Kalitte/Core/Meta';


@Meta.Controller('VideoPlayerController', {
    state: {
        name: 'app.videoplayer',
        url: "/videoplayer/:Id",
        templateUrl: 'src/mobile/App/VideoPlayer.html',
        data: {
            title: ''
        },
        MobileControllerAs: true,
        params: {
            url: null
        }
    }
})
export class VideoPlayerController extends ControllerBase {
    title: string;
    Attachment: Entity.EntityAttachment;
    DataService = Remote.Entity < Entity.EntityAttachment>('Attachment');
    AttachmentUrl: any;
    initialize() {
        this.title = $stateParams['title'];
        return this.DataService.Id($stateParams['Id']).then((entity) => {
            this.Attachment = entity;
            this.AttachmentUrl = GetYoutubeEmbedUrl(entity.FileName, true);
            return super.initialize();     
        });
    }
}   