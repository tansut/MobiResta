/// <reference path="../../ref/angularjs/angular.d.ts" />


import {Kalitte} from '../../Kalitte/Data/Models';

export class Error {

    errorMessages: Array<string>;

    constructor(public Data: any) {
        this.errorMessages = new Array<string>();
    }
}

enum RemoteErrorCodes {
    BadRequest = 400,
    AuthorizationError = 401,
    NotFound = 404,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503

}


export class RemoteError extends Error {
    config: ng.IRequestConfig;
    status: number;
    statusText: string;
    private data: any;
    headers: ng.IHttpHeadersGetter;
    isModelError: boolean;


    constructor(data: ng.IHttpPromiseCallbackArg<any>) {
        super(data);
        this.config = data.config;
        this.data = data.data;
        this.statusText = data.statusText;
        this.status = data.status;
        this.headers = data.headers;

        this.isModelError = false;
        if (data.data && data.data.ErrorCode) {
            this.parseHandledExceptions(data.data);
        }
        else if (data.data) {
            this.parseRemoteErrorData(data.data, data.status);
        } else {
            this.pushErrorCodeErrors(data.status, data.data);
        }
    }

    private parseHandledExceptions(data: Kalitte.AjaxExceptionResult) {
        // burada bişeyler yapmak gerekebilir.
        this.errorMessages.push(data.Message);

    }

    private pushErrorCodeErrors(statusCode: number, remoteData: any) {

        if (statusCode == RemoteErrorCodes.NotFound) {
            this.errorMessages.push('The requested resouce haven\'t been found on the server');
        } else if (statusCode == RemoteErrorCodes.AuthorizationError) {
            this.errorMessages.push('Authorization have been denied for this request.');
        } else if (statusCode == RemoteErrorCodes.Forbidden) {
            this.errorMessages.push('You don\'t have the sufficent priviliges to make this action');
        } else if (statusCode == RemoteErrorCodes.InternalServerError) {
            this.errorMessages.push('An unknown error occurred at');
        } else if (statusCode == RemoteErrorCodes.ServiceUnavailable || statusCode == RemoteErrorCodes.TooManyRequests) {
            this.errorMessages.push('Server couldn\'t handle the request. Please wait a little more to retry this action');
        }
    }

    private parseRemoteErrorData(remoteData: any, statusCode: number) {
        if (remoteData.ModelState) {
            this.isModelError = true;
            this.pushModelStateErrors(remoteData.ModelState)
        } else if (statusCode == RemoteErrorCodes.BadRequest) {
            this.parseBadRequest(remoteData);
        } else {
            this.pushErrorCodeErrors(statusCode, remoteData);
        }
    }


    private parseBadRequest(remoteData: any) {
        if (remoteData.Message)
            this.errorMessages.push(remoteData.Message);
        else if (remoteData.error_description) {
            this.errorMessages.push(remoteData.error_description);
        }
        else
            this.errorMessages.push('An Invalid Request Have Been Made');
    }

    private pushModelStateErrors(modelState) {
        for (var stateError in modelState) {
            var errorArr: string[];
            errorArr = modelState[stateError]
            errorArr.forEach((e) => {
                this.errorMessages.push(e);
            });
        }
    }
}

export class AuthorizationError extends RemoteError {
    constructor(data: ng.IHttpPromiseCallback<any>) {
        super(data);
    }
}