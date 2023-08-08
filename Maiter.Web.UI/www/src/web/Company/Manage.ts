/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />

import {EntityController} from '../../Kalitte/UI/EntityController';
import {Company as DataService} from '../../Data/CompanyService';
import {EntityService} from '../../Kalitte/Data/RemoteService';
import {Entity, Data, ViewModels} from '../../Data/Models';
import {WorkItemCommand, WorkItemInfo} from '../../Data/Company';
import {$state, $stateParams, $timeout, $q} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Controller('ManageCompanyController', { state: { url: '/:Id/manage', name: 'app.company.manage', templateUrl: 'src/web/Company/Manage.html', data: { title: 'Restaurant Yönetimi', roles: [] } } })
export class ManageCompanyController extends EntityController<Entity.Company> {
    WorkItemStatusList: Array<ViewModels.Company.WorkItemStatus>;
    WorkItems: Array<WorkItemInfo>;
    StatusType = ViewModels.Company.Completeness;
    CompletenessPerc: number = 30;
    TotalDone: number = 0;
    $stateParams = $stateParams;
    TagDomain = ViewModels.Common.TagContent.TAGDOMAIN;

    

    ExecuteQuery() {        

        return DataService.Id(this.$Id, { attachments: true, contentType: 'image', workitems: true }).then((company) => {
            this.WorkItems = DataService.getWorkItems();
            this.WorkItemStatusList = company.WorkItems;
            this.TotalDone = 0;

            this.WorkItems.forEach((wi) => {
                this.WorkItemStatusList.forEach((ws) => {
                    if (ws.Item == wi.Id)
                        wi.Status = ws.Status;
                });
                if (wi.Status == ViewModels.Company.Completeness.Done)
                    this.TotalDone++;
            });

            var perc = this.TotalDone / this.WorkItems.length;
            var perc2 = this.CompletenessPerc = (Math.floor((perc) * 100.0));
            return company;    
        });




    }

    initialize() {
        return super.initialize();

    }

    manageIt(cmd: WorkItemCommand) {
        //ui - sref="{{cmd.State}}({Id: ctrl.$stateParams['Id'], entity: ctrl.$Entity.constructor.AttachName, title: ctrl.$Entity.Name  + ' > ' + item.Title })"
        var stateParams = {
            Id: this.$Id
        };
        if (cmd.Name == "photos") {
            stateParams = {
                Id: this.$Id,
                entity: Entity.Company.EntityName,
                title: this.$Entity.Name + ' > ' + cmd.Title
            }
        } 

        if (cmd.StateParams) {
            angular.extend(stateParams, cmd.StateParams);
        }
        
        $state.go(cmd.State, stateParams);
    }


    constructor($scope: angular.IScope) {
        super($scope, DataService);
    }
}   