/// <reference path="../../../ref/angularjs/angular.d.ts" />

import {AngularService} from '../../Vendor/AngularService';
import {Meta} from '../../Core/Meta';

@Meta.Directive('menuLink')
export class MenuLink {

    static $Factory(): MenuLink {
        return new MenuLink();
    }

    public link: (scope: any, element: any, attrs: angular.IAttributes) => void;
    public templateUrl = 'src/Kalitte/UI/web/MenuLink.html';
    public scope = {
        section: '='
    };

    constructor() {

        this.link = (scope: any, element: any, attrs: angular.IAttributes) => {
            var controller = element.parent().controller();

            scope.isSelected = function() {
                return controller.isSelected(scope.section);
            };

            scope.focusSection = function() {
                controller.autoFocusContent = true;
            };
        };
    }
}