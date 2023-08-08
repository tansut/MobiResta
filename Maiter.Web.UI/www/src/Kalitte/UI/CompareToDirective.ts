/// <reference path="../../ref/angularjs/angular.d.ts" />

import {AngularService} from '../../Kalitte/Vendor/AngularService';
import {Meta} from '../../Kalitte/Core/Meta';

@Meta.Directive('compareTo')
export class CompareTo {

    static $Factory(): CompareTo {
        return new CompareTo();
    }

    public link: (scope: any, element: any, attrs: angular.IAttributes, ngModel: angular.INgModelController) => void;
    public require = "ngModel";
    public scope = {
        otherModel: '=compareTo'
    };

    constructor() {
        this.link = (scope: any, element: any, attrs: angular.IAttributes, ngModel: angular.INgModelController) => {
            ngModel.$validators["compareTo"] = function (modelValue) {
                return modelValue == scope.otherModel;
            };

            scope.$watch("otherModel", function () {
                ngModel.$validate();
            });
        };
    }
}