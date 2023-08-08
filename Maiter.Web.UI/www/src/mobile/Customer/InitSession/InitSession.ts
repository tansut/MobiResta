/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope, $state, $stateParams, $q} from '../../../Kalitte/Vendor/AngularService';
import {$cordovaBarcodeScanner} from '../../../Kalitte/Vendor/CordovaService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {AnonymousPrincipal} from '../../../Kalitte/Core/Principal';
import {AES} from '../../../Kalitte/Core/AESService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {QR} from '../../../Core/QR';
import {ViewModels} from '../../../Data/Models';
import {CustomerSession } from '../../../Core/Session/CustomerSession';
import {Session } from '../../../Core/Session/SessionService';

@Meta.Controller('InitSessionController', { state: { name: 'app.customer.initSession', params: { returnState: null, returnStateParams: null }, url: '/init-session', MobileControllerAs: true, templateUrl: 'src/mobile/Customer/InitSession/InitSession.html', data: { title: 'Oturum Aç' } } })
export class InitSessionController extends ControllerBase {
    private userMsg: string;
    private scanner = $cordovaBarcodeScanner;

    encodeTagData(tagData: string): ViewModels.Common.TagContent {
        var tag = tagData.replace(ViewModels.Common.TagContent.TAGDOMAIN, '');
        var asEnc: string = window.atob(tag);
        var instance = JSON.parse(asEnc);

        return instance;
    }

    getQRData(test: boolean = false): ng.IPromise<string> {
        var defer = $q.defer<string>();

        if (test) {
            //var tagData = 'http://www.mobiresta.com/tag/eyJUeXBlIjowLCJWZXJzaW9uIjoiMS4wIiwiSWQiOiJvWmJzQ056bHhVNmJZdVFZWE9ad0Z3IiwiU2lnbiI6IkdIMHhaaXRzNXREL1g3U3NWWk1JSExsaVlOd2VYTXg1WjhIYlM4aWgwTDg9In0=';
            var tagData = 'http://www.mobiresta.com/tag/eyJUeXBlIjoyLCJWZXJzaW9uIjoiMS4wIiwiSWQiOiJhM1pqTThhUUlVMnlCWnFmbnZGM1NRIiwiU2lnbiI6IkMvUllSa2toVTZON0lHTmcyejdxZ2JadWtJd0ZkL2lDamRISU4rR082TDA9In0=';
            
            $timeout(() => {
                defer.resolve(tagData);
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
                    defer.reject('Unable to read barcode');
                }
            }, (error) => {
                    defer.reject('Unable to read barcode');
                });
        } 
        return defer.promise;
    }

    sessionByQrCode(test: boolean = false): ng.IPromise<any> {
        var promise = this.getQRData(test).then((input: string) => {
            var encodedTag = this.encodeTagData(input);
            if (!encodedTag) {
                return $q.reject("Invalid Tag");
            }

            var sessionRequest = <ViewModels.Mobile.RequestTypes.CheckInRequest> {
                Tag: encodedTag
            }

            return Session.CreateCustomerSession(sessionRequest);
        });     
        return promise;
    }

    initialize() {
        var promise: ng.IPromise<any>;
        if (!window['cordova'])
            promise = this.sessionByQrCode(true)
        else promise = this.sessionByQrCode(false);

        return this.errorHandled(promise).then(() => {
            if ($stateParams['returnState'])
                $state.go($stateParams['returnState'], $stateParams['returnStateParams']);
            else $state.go('app.customer.home', {}, { reload: true });
        });
    }
}   