/// <reference path="../../../ref/angularjs/angular.d.ts" />
/// <reference path="../../../ref/lodash/lodash.d.ts" />
/// <reference path="../../../ref/angular-ui-router/angular-ui-router.d.ts" />


import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {$timeout, $rootScope, $state, $http, $stateParams, $sce} from '../../../Kalitte/Vendor/AngularService';
import {$ionicTabsDelegate} from '../../../Kalitte/Vendor/IonicService';
import {Account} from '../../../Kalitte/Data/AccountService';
import {ViewModels} from '../../../Data/Models';
import {Meta} from '../../../Kalitte/Core/Meta';
import {GetYoutubeThumbnail} from '../../../Core/Helpers';
import {Session } from '../../../Core/Session/SessionService';


@Meta.Controller('CompanyContentController', {
    state: {
        name: 'app.customer.companycontent',
        url: "/companycontent/:Ids",
        templateUrl: 'src/mobile/Customer/Home/ContentViewer.html',
        data: {
            title: ''
        },
        MobileControllerAs: true,
        params: {
            items: null
        }
    }
})
export class CompanyContentController extends ControllerBase {
    contentString: any;
    Items: Array<ViewModels.Company.CompanyAppMenuItemViewModel>;
    GetYoutubeThumbnail = GetYoutubeThumbnail;

    loadContent(url: string): ng.IPromise<string> {
        return this.errorHandled($http.get(url, {
            responseType: 'text'
        }).then((data) => {
            return data.data.toString();
        }))
    }

    initialize() {
        var itemIds = $stateParams['Ids'].split(',');
        this.Items =  angular.copy($stateParams['items']);
        if (this.Items == null)
            this.Items = Session.Customer.InitData.AppMenuItems.filter((item) => itemIds.indexOf(item.Id) >= 0);
        this.Items.forEach((item) => {
            var iitem = item;
            if (item.Content)
                item['contentString'] = $sce.trustAsHtml(item.Content);
            else this.loadContent(item.Url).then((result) => iitem['contentString'] = $sce.trustAsHtml(result));
        });
        $timeout(()=>$ionicTabsDelegate.select(0));
    }
}   