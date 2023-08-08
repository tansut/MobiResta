/// <reference path="../../../ref/sprintf/sprintf-js.d.ts" />

import {EntityController} from '../../../Kalitte/UI/EntityController';
import {ControllerBase} from '../../../Kalitte/UI/ControllerBase';
import {Entity, Data, ViewModels} from '../../../Data/Models';
import {$state, $stateParams, $timeout, $q, $rootScope} from '../../../Kalitte/Vendor/AngularService';
import { Dialog } from '../../../Kalitte/UI/Web/DialogService';
import {Meta} from '../../../Kalitte/Core/Meta';
import {Remote} from '../../../Kalitte/Data/RemoteService';
import {Tag} from '../../../Data/TagService';


@Meta.Controller("CompanyTableGenerateController")
export class CompanyTableGenerateController extends EntityController<Entity.CompanySection> {
    idParameter = 'sectionId';
    $Service = Remote.Entity<Entity.CompanySection>("CompanySection");
    $TableService = Remote.Entity<Entity.CompanySection>("Table");
    $model = <ViewModels.Company.TableGeneration>{};
    generateMode = '';

    static ConfigureStates($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state("app.company.tables.generate", {
            url: '/generate',
            onExit: () => {
                Dialog.Hide();
            },
            controller: "CompanyTableGenerateController",
            controllerAs: "ctrl",
            resolve: {
                sectionId: ['$stateParams', ($stateParams) => {
                    return $stateParams.sectionId;
                }]
            }
        });
    }

    initialize() {        
        return super.initialize().then(() => {
            this.$model.CompanySectionId = this.$Entity.Id;
            this.$model.Start = 1;
            this.$model.Finish = 12;
            this.$model.Digits = 2;
            
            this.$model.Tags = [];

            Dialog.Show({
                controller: () => this,
                controllerAs: 'ctrl',
                templateUrl: 'src/web/Company/Tables/Generate.html'
            }).finally(() => {
                $state.go('^');
            });
        });
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
        return chip;
    }

    generate(event) {

        var total = this.$model.Finish - this.$model.Start + 1;
        if (total <= 0)
            this.error('Lütfen masa başlangış ve bitiş numaralarının doğruluğunu onaylayın');

        this.errorHandled(this.$TableService.Call<Array<Entity.ResTable>>('Generate', {
            simulate: this.generateMode == 'simulate'
        }, this.$model)).then((items) => {
            $rootScope.$broadcast(this.generateMode == 'simulate' ? 'TableGeneration:Simulated' : 'TableGeneration:Created', items);
            Dialog.Hide();
        });
    }

    CloseDialog() {
        Dialog.Hide();
    }
}