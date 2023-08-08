/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {EntityListController} from '../../Kalitte/UI/EntityListController';
import {EntityService, Remote} from '../../Kalitte/Data/RemoteService';
import {$timeout, $location, $rootScope, $state, $stateParams, $filter} from '../../Kalitte/Vendor/AngularService';
import {FileUpload, IFileProgressEvent} from '../../Kalitte/Vendor/FileUploadService';
import {Meta} from '../../Kalitte/Core/Meta';
import {Entity, Data} from '../../Data/Models';
import {Attachment as DataService} from '../../Data/AttachmentService';
import {GetYoutubeThumbnail} from '../../Core/Helpers';



import {BSMenu} from '../../Kalitte/UI/Web/BSMenuService';
import {Dialog} from '../../Kalitte/UI/Web/DialogService';
import {BSMenuItem} from '../../Kalitte/UI/BSMenu';



export interface IBack {
    state: string;
    params: Object;
}


@Meta.Controller('AttachmentController', { state: { url: '/attachment/:entity/:Id/:title/:attachtype', params: { entity: undefined, Id: undefined, title: '', back: undefined, attachtype: null }, name: 'app.attachment', templateUrl: 'src/Web/Helper/Attachment.html', data: { authenticated: true, title: 'Ekleri belirle' } } })
export class AttachmentController extends EntityListController<Entity.EntityAttachment> {
    Title: string = $stateParams['title'];
    EntityName: string = $stateParams['entity'];
    EntityId: string = $stateParams['Id'];
    Back: IBack = $stateParams['back'];
    AttachType: Entity.AttachmentType;
    AttachmentTypes = Entity.AttachmentType;
    AttachedFile: File;
    UploadInProgress: boolean = false;
    UploadPercentage: number = 0;
    FileTitle: string;
    Desc: string;
    FileName: string;
    DisplayOrder: number;

    addFileTitle: string;
    selectFileTitle: string;
    fileListTitle: string;

    editId: string;

    DataService = Remote.Entity('Attachment');

    videoThumbnail = GetYoutubeThumbnail;

    getItemOptions(entity: Entity.EntityAttachment): Array<BSMenuItem> {
        return new Array<BSMenuItem>(
            {
                Name: 'edit',
                Title: 'Düzenle',
                Handler: (entity: Entity.EntityAttachment) => {
                    this.editAttachment(entity.Id);
                    BSMenu.Hide();
                }
            },
            {
                Name: 'delete', Title: 'Sil', Handler: (entity: Entity.EntityAttachment) => {
                    $state.go('app.deleteEntity', { service: DataService, Id: entity.Id, title: entity.Title || entity.FileName }).then(() => {
                        BSMenu.Hide();
                    });
                }
            })
    }


    showEntityActions($event, entity: Entity.EntityAttachment) {
        BSMenu.Show({
            Header: entity.Title || entity.FileName,
            Items: this.getItemOptions(entity),
            $event: $event,
            Data: entity,
        });
    }

    cleanUpAttach() {
        this.UploadInProgress = false;
        this.UploadPercentage = 0;
        this.FileTitle = "";
        this.AttachedFile = undefined;
    }

    editAttachment(attachmentId: string) {
        this.editId = attachmentId;
        var entity = _.find(this.$List, "Id", attachmentId);
        this.FileTitle = entity.Title;
        this.DisplayOrder = entity.DisplayOrder;
        this.FileName = entity.FileName;
        this.Desc = entity.Desc;
        Dialog.Show({
            controller: () => this,
            controllerAs: 'ctrl',
            templateUrl: this.AttachType == Entity.AttachmentType.Image ? 'src/web/Helper/AttachmentDialog.html' :
                'src/web/Helper/VideoAttachmentDialog.html'
        });
    }

    initialize() {
        var stateAttach = $stateParams['attachtype'];

        this.AttachType = stateAttach ? <Entity.AttachmentType>stateAttach : Entity.AttachmentType.Image;
        if (this.AttachType == Entity.AttachmentType.Image) {
            this.selectFileTitle = $filter('translate')("Add new photo");
            this.fileListTitle = $filter('translate')("Existing Photos");
            this.addFileTitle = $filter('translate')("Select File");
        } else if (this.AttachType == Entity.AttachmentType.VideoLink) {
            this.selectFileTitle = $filter('translate')("Add new video");
            this.fileListTitle = $filter('translate')("Existing Videos");
            this.addFileTitle = $filter('translate')("Select Video");
        }

        return super.initialize();
    }

    selectNewFile() {
        this.editId = undefined;
        this.FileTitle = '';
        this.FileName = '';
        this.DisplayOrder = 0;
        this.Desc = '';
        Dialog.Show({
            controller: () => this,
            controllerAs: 'ctrl',
            templateUrl: this.AttachType == Entity.AttachmentType.Image ? 'src/web/Helper/AttachmentDialog.html' :
                'src/web/Helper/VideoAttachmentDialog.html'
        });
    }

    ExecuteQuery() {
        return DataService.ListOfEntity(this.EntityName, this.EntityId, this.AttachType);
    }

    constructor(scope: ng.IScope) {
        super(scope, DataService);

    }

    attachNewVideo() {
        var entity = <Entity.EntityAttachment> {
            AttachmentType: Entity.AttachmentType.VideoLink,
            DisplayOrder: this.DisplayOrder,
            Title: this.FileTitle,
            EntityId: this.EntityId,
            EntityName: this.EntityName,
            Desc: this.Desc,
            FileName: this.FileName,
            Id: this.editId,
            Length: 0,
            ContentType: Entity.AttachmentType[Entity.AttachmentType.VideoLink]            
        }
        var promise: ng.IPromise<any>;
        if (!this.editId)
            promise = this.DataService.Create(entity);
        else promise = this.DataService.Update(entity);
        promise = this.errorHandled(promise);
        promise.then(() => {
            Dialog.Hide();
            this.LoadItems();
        });
    }

    attachNewFile() {
        if (!this.editId  && !this.AttachedFile)
            this.error("Please select a file to attach");
        else {
            FileUpload.Service.upload<any>({
                url: '/api/attachment/upload',
                fields: {
                    Entity: this.EntityName,
                    Id: this.EntityId,
                    Title: this.FileTitle,
                    DisplayOrder: this.DisplayOrder,
                    EditId: this.editId,
                    Desc: this.Desc
                },
                file: this.AttachedFile,
                method: 'POST'
            }).progress((evt: IFileProgressEvent) => {
                this.UploadInProgress = true;
                this.UploadPercentage = 100.0 * evt.loaded / evt.total;
            }).success((data, status, headers, config) => {
                $timeout(() => {
                    this.cleanUpAttach();
                    Dialog.Hide();
                    this.LoadItems();
                    //$scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                });
            }).catch(() => {
                this.cleanUpAttach();
                this.error("Hata");
            });
        }

    }

    CloseDialog() {
        Dialog.Hide();
    }

}   