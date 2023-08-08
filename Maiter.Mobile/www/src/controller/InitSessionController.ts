/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../shared/QR.ts" />

import {SendMessageRequest} from '../request/SendMessageRequest';
import {Branch, AllBranches} from '../request/Branch';
import {RequestTemplates} from '../request/RequestTemplates';
import {BaseController} from '../shared/BaseController';
import {$stateParams, $q, $log, $state, $timeout} from '../shared/Common';
import {QR} from '../shared/QR';
import {CustomerSession, CustomerTag} from '../lib/CustomerSession';


export class InitSessionController extends BaseController {

    static $inject = ['$cordovaBarcodeScanner', '$scope'];
    private userMsg: string;

    constructor(private scanner: any,
        $scope: ng.IScope) {
        super($scope);
    }

    getQRData(test: boolean = false): ng.IPromise<CustomerTag> {
        var defer: ng.IDeferred<CustomerTag>;

        if (test) {
            defer = $q.defer<CustomerTag>();

            $timeout(() => {
                defer.resolve({
                    tableId: '123',
                    createdAt: Date.now()
                });
            })

        } else {
            this.scanner.scan().then((barcodeData) => {
                if (barcodeData && barcodeData.cancelled !== 1) {
                    var decoder = QR.createDecoder(barcodeData.format, barcodeData.text);
                    var decoded;
                    try {
                        decoded = decoder.decode();
                        defer.resolve(decoded);
                    } catch (err) {
                        defer.reject(err.message);
                    }
                } else {
                    defer.reject('Barkod Bilgisi Okunamadı.');
                }
            }, (error) => {
                defer.reject('Okunamadı');
            });
        }
        return defer.promise;
    }
    
    beforeEnter() {
        if (!window['cordova'])
        this.sessionByQrCode(true)
    }

    sessionByQrCode(test: boolean = false) {

        var promise = this.getQRData(test).then((input) => {
            console.log('Read QR code');
            return CustomerSession.getRemoteInitData(input).then((sessionData) => {
                console.log('Session data received. Trying to start session ...');
                var instance = CustomerSession.getInstance();
                return instance.start(sessionData).then(() => {
                    var toState = $stateParams['toState'] || 'app.home';
                    var toStateParams = $stateParams['toStateParams'] || undefined;
                    if (!RequestTemplates.Templates) {
                        return RequestTemplates.init().then(() => {
                            return $state.go(toState, toStateParams);
                        })
                    }
                    else return $state.go(toState, toStateParams);
                }, (error) => {
                    this.userMsg = "Bağlantı hatası: " + error;
                });
            })
        })

        this.showLoading('Gerekli işlemleri yapıyorum', promise);
        return promise;
    }
}
