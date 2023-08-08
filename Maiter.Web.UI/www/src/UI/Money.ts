/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/lodash/lodash.d.ts" />
/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {$q, $filter} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {ControllerBase} from '../Kalitte/UI/ControllerBase';
import {Entity} from '../Data/Models';
import {Dialog} from '../Kalitte/UI/Web/DialogService';
import { Remote} from '../Kalitte/Data/RemoteService';
import { ViewModels} from '../Data/Models';
import { Session } from '../Core/Session/SessionService';

class MoneyController extends ControllerBase {
    amount: number;
    currency: string;




    constructor(scope: ng.IScope) {
        super(scope);

    }
}

@Meta.Directive('money')
export class Money {
    controllerAs = 'ctrl';
    controller = MoneyController;
    scope = {};
    bindToController = {
        currency: '=',
        amount:'=money'
    }

    static $Factory(): Money {
        return new Money();
    }

    link(scope: any, element: any, attrs: angular.IAttributes, controller) {

    }

    public templateUrl = 'src/UI/Money.html';

    constructor() {
    }
}