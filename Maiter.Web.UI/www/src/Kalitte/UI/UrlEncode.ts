/// <reference path="../../ref/angularjs/angular.d.ts" />
import {AngularService} from '../Vendor/AngularService';
import {Meta} from '../Core/Meta';

@Meta.Filter('urlencode')
export class UrlEncode {
	
    static $Factory() {
        return new UrlEncode().Filter;
    }

	Filter(value) {
        if (value) {
            return window['encodeURIComponent'](value);
        }
        return "";
	}
}