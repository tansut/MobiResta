/// <reference path="../ref/angularjs/angular.d.ts" />

export class NoSpace {
	
    static Factory() {
        return new NoSpace().Filter;
    }

	Filter(value) {
		return (!value) ? '' : value.replace(/ /g, '');		
	}
}