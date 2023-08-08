/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-file-upload/angular-file-upload.d.ts" />

import {Meta} from '../Core/Meta';
import {BaseService} from '../Core/BaseService';

	
export var FileUpload: FileUploadService;
export interface IFileProgressEvent extends angular.angularFileUpload.IFileProgressEvent { }
export interface IUploadPromise<T> extends angular.angularFileUpload.IUploadPromise<T> { }


@Meta.Service('FileUploadService')
export class FileUploadService extends BaseService {


    static InstanceReady(instance) {
        FileUpload = instance;
    }

    static $inject = ['Upload'];

    constructor(public Service: angular.angularFileUpload.IUploadService) {
        super();
        FileUpload = this;
	}
}