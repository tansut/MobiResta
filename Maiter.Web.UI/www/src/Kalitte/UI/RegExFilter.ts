/// <reference path="../../ref/angularjs/angular.d.ts" />
import {AngularService} from '../Vendor/AngularService';
import {Meta} from '../Core/Meta';

@Meta.Filter('regex')
export class NoSpace {

    static $Factory() {
        return new NoSpace().Filter;
    }

    Filter(input, field, regex) {
        var patt = new RegExp(regex);
        if (angular.isArray(input)) {
            var out = [];
            for (var i = 0; i < input.length; i++) {
                if (patt.test(input[i][field]))
                    out.push(input[i]);
            }
            return out;
        } else {
            var out2 = {};
            for (var key in input) {
                if (field == 'key' && patt.test(key))
                    out2[key] = input[key];
                else if (field == 'value' && patt.test(input[key]))
                    out2[key] = input[key];
            } 
            return out2;
        }

    }
}