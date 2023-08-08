/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../Kalitte/UI/ControllerBase';
import {$timeout, $location, $rootScope, $state, $stateParams, $q} from '../../Kalitte/Vendor/AngularService';
import {$cordovaBarcodeScanner} from '../../Kalitte/Vendor/CordovaService';
import {Account} from '../../Kalitte/Data/AccountService';
import {AnonymousPrincipal} from '../../Kalitte/Core/Principal';
import {AES} from '../../Kalitte/Core/AESService';
import {Meta} from '../../Kalitte/Core/Meta';
import {SendMessageRequest} from '../../Core/Request/SendMessageRequest';
import {Branch, AllBranches} from '../../Core/Request/Branch';
import {CustomerSessionData, CustomerSession} from '../../Core/CustomerSession';
import {RequestTemplates} from '../../Core/Request/RequestTemplates';
import {QR} from '../../Core/QR';
import {ViewModels} from '../../Data/Models';


@Meta.Controller('InitSessionController', { state: { name: 'app.initSession', url: '/init-session', MobileControllerAs: true, templateUrl: 'src/mobile/InitSession/InitSession.html', data: { title: 'Oturum Aç' } } })
export class InitSessionController extends ControllerBase {
    private userMsg: string;
    private scanner = $cordovaBarcodeScanner;

    encodeTagData(tagData: string): string {
        var asEnc: string = window.atob(tagData);
        var parts1 = asEnc.split('?');
        var parts2 = parts1[1].split('?');

        var tag = <ViewModels.Common.TagContent> {
            Id: parts2[1],
            Time: parseInt(parts2[0]),
            Version: parts1[0]
        }

        return tagData;
    }

    getQRData(test: boolean = false): ng.IPromise<string> {
        var defer: ng.IDeferred<string>;


        if (test) {
            var tagData = 'MS4wP1p2MEU5Rk5sUnJBL3JrSUlVWHBMWm5WaVF3eXBOVitTWGMwekpCR21zajNlenQvZEYyQkJuSng5N0RGR3J3eGg=';
            defer = $q.defer<string>();

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
                    defer.reject('Barkod Bilgisi Okunamadı.');
                }
            }, (error) => {
                    defer.reject('Okunamadı');
                });
        }
        return defer.promise;
    }

    sessionByQrCode(test: boolean = false) {

        var promise = this.getQRData(test).then((input: string) => {
            console.log('Read QR code');
            var encodedTag = this.encodeTagData(input);
            if (!encodedTag) {
                return $q.reject("Invalid Tag");
            } 

            var sessionRequest = <ViewModels.Mobile.SessionRequest> {
                TagContent: encodedTag,
                Location: {
                    Lat: 12,
                    Long: 12
                }
            }
            return CustomerSession.getRemoteInitData(sessionRequest).then((sessionData) => {
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

    initialize() {
        if (!window['cordova'])
            this.sessionByQrCode(true)
    }

}   