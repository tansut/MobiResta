/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {Meta} from '../../../Kalitte/Core/Meta';
import {ViewModels, Entity} from '../../../Data/Models';

import {$timeout, $location, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {LocationService} from '../../../Kalitte/Vendor/GeolocationService';
import {SignalRConnection} from '../../../Kalitte/Vendor/SignalRConnectionService';
import {Translate} from '../../../Kalitte/Vendor/TranslateService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {RemoteService} from '../../../Kalitte/Data/RemoteService';
import {AnonymousPrincipal} from '../../../Kalitte/Core/Principal';

import {CustomerSession } from '../../../Core/Session/CustomerSession';
import {Session } from '../../../Core/Session/SessionService';
import {$stateParams, $q, $log, $state} from '../../../Kalitte/Vendor/AngularService';
import {$ionicHistory} from '../../../Kalitte/Vendor/IonicService';


@Meta.Controller('CustomerHomeController')
export class HomeController extends ControllerBase {
    static LastTable: string;
    Session = Session;
    loginLogOffTitle: string;
    Principal = Account.principal;
    HeaderImages = new Array<ViewModels.Mobile.EntityAttachmentViewModel>();
    RemoteUrl = RemoteService.Host.Url();
    ServiceKinds = ViewModels.Company.ServiceKind;
    AppMenuDisplayOptions = Entity.AppMenuDisplayOption;
    requestGroups: {
        [id: string]: Array<ViewModels.Mobile.CustomerRequestType>
    }

    public static ControllerName = 'CustomerHomeController';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('app.customer.home', {
            url: '',
            templateUrl: () => {
                if (Account.principal instanceof AnonymousPrincipal)
                    return "src/mobile/Customer/Home/home.html";
                else return "src/mobile/Customer/Home/home.html";
            },
            controller: HomeController.ControllerName + ' as ctrl',
            controllerAs: 'ctrl',
            data: { title: 'MobiResta' }
        });
    }

    companyHasMenuItems() {
        if (!Session.Customer)
            return false;
        for (var i = 0; i < Session.Customer.InitData.AppMenuItems.length; i++) {
            var item = Session.Customer.InitData.AppMenuItems[i];
            if (item.DisplayType == Entity.AppMenuDisplayOption.DisplayAsHome ||
                item.DisplayType == Entity.AppMenuDisplayOption.Both)
                return true;
        }
        return false;
    }

    logOutUser() {
        Account.logOff().then(() => { $state.go('app.login'); });
    }

    loginOrLogOff() {

    }

    sendMessage() {

    }

    beforeEnter() {

        return super.beforeEnter();
    }

    initialize() {
        this.setupCustomerSession();

        //this.requestGroups = Session.Customer ? this.requestGroups : null;
        //if (!this.requestGroups && Session.Customer)
            


        return super.initialize();
    }

    navigateCompanyMenu($event, item) {
        var items = [item];
        $state.go('app.customer.companycontent', {
            Ids: _.map(items, 'Id').join(','),
            items: items
        });
    }

    setupCustomerSession() {
        this.requestGroups = Session.Customer ? _.groupBy<ViewModels.Mobile.CustomerRequestType>(Session.Customer.InitData.AvailableRequests.filter((item) => item.DisplayOrder > 0), (item) => item.Group.Value) : {};
        this.HeaderImages = Session.Customer ? Session.Customer.InitData.CompanyAttachments.filter((item) => item.AttachmentType == Entity.AttachmentType.Image) : [];
        var menus = Session.Customer ? Session.Customer.InitData.Menu : [];
        if (Session.Customer && Session.Customer.InitData.TableId != HomeController.LastTable) {
            HomeController.LastTable = Session.Customer.InitData.TableId;
            var welcomeMessages = Session.Customer.InitData.AppMenuItems.filter((item) => item.DisplayType == Entity.AppMenuDisplayOption.DisplayAsWelcome || item.DisplayType == Entity.AppMenuDisplayOption.Both);

            if (welcomeMessages.length) {
                $timeout(() => {
                    $state.go('app.customer.companycontent', {
                        Ids: _.map(welcomeMessages, 'Id').join(','),
                        items: welcomeMessages
                    })
                }, 1500);
            }
        }
    }

    constructor(scope: ng.IScope) {
        super(scope);

        this.on("CustomerSessionCreated", 'CustomerSessionDisconnected', (event, arg) => {
            this.setupCustomerSession();
        });


        //this.on('SignalRConnectionReceived', (event, data) => {
        //    console.log(data);
        //});



        //LocationService.getCurrentPosition({ timeout: 5000, enableHighAccuracy: true }).then((resp) => { console.log(resp); }, (c: PositionError) => { console.log(c.code); });

        //var watch =LocationService.watchPosition({ frequency: 1, enableHighAccuracy: true, timeout: 5000, maximumAge : -1 });
        //watch.then(null, (resp: PositionError) => { console.log(resp); }, (resp: Position) => { console.log(resp); });

        //LocationService.clearWatch(watch).then(() => { });


        // watch.clearWatch();


    }
}   