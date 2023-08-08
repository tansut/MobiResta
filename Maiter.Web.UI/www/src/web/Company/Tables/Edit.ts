import {EntityController} from '../../../Kalitte/UI/EntityController';
import {Entity, Data, ViewModels} from '../../../Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import {$mdDialog} from '../../../Kalitte/Vendor/MaterialService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {Tag} from '../../../Data/TagService';


@Meta.Controller('EditTableController')
export class TableController extends EntityController<Entity.ResTable> {
    idParameter = 'tableId';
    $Service = Remote.Entity<Entity.ResTable>("Table");
    TagDomain = ViewModels.Common.TagContent.TAGDOMAIN;

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {

        $stateProvider.state('app.company.tables.new', {
            url: '/new',
            controller: 'EditTableController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            },
            resolve: {
                sectionId: ['$stateParams', ($stateParams) => {
                    return $stateParams.sectionId;
                }]
            }
        }).state('app.company.tables.edit', {
            url: '/:tableId/edit',
            controller: 'EditTableController',
            controllerAs: 'ctrl',
            onExit: () => {
                Dialog.Hide();
            },
            resolve: {
                sectionId: ['$stateParams', ($stateParams) => {
                    return $stateParams.sectionId;
                }]
            }
        })
    }

    ExecuteQuery() {
        return this.$Service.Id(this.$Id, { tags: true, attachments: true });
    }

    queryTagSearch(search: string = undefined) {
        if (!this.$Ready)
            return $q.reject();

        return Tag.Search(Entity.ResTable.EntityName, search).then((tags) => {
            if (tags.length)
                return tags;
            else return [search];
        });

    }


    newTag(chip) {
        return <Entity.EntityTag>{
            Name: chip,
            EntityId: this.$Entity.Id,
            EntityName: Entity.ResTable.EntityName
        }
    }

    save() {
        var inserting = !this.$Entity.Id;
        if (inserting) {
            this.$Entity.SectionId = $stateParams["sectionId"];
        }
        return super.save().then(() => {
            $rootScope.$broadcast(inserting ? 'Entity.Table.Inserted': 'Entity.Table.Updated', this.$Entity);
            Dialog.Hide();
        });
    }

    EmptyEntity() {
        return <Entity.ResTable>{
            Tags: new Array<Entity.EntityTag>()
        };
    }

    initialize() {    
        return super.initialize().then(() => {
            Dialog.Show({
                controller: () => this,
                controllerAs: 'ctrl',
                templateUrl: 'src/web/Company/Tables/Edit.html'
            }).finally(() => {
                $state.go('^');
            });
        });        
    }

    constructor($scope: angular.IScope) {
        super($scope);
        this.$Entity = this.EmptyEntity();
    }

    CloseDialog() {
        Dialog.Hide();
    }
}