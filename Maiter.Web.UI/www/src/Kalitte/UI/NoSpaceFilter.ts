/// <reference path="../../ref/angularjs/angular.d.ts" />
import {AngularService} from '../Vendor/AngularService';
import {Meta} from '../Core/Meta';

@Meta.Filter('nospace')
export class NoSpace {
	
    static $Factory() {
        return new NoSpace().Filter;
    }

	Filter(value) {
		return (!value) ? '' : value.replace(/ /g, '');		
	}
}