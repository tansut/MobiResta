/// <reference path="../../ref/angularjs/angular.d.ts" />
import {AngularService, $sce} from '../Vendor/AngularService';
import {Meta} from '../Core/Meta';

@Meta.Filter('trustAsResourceUrl')
export class TrustAsResourceUrl {
	
    static $Factory() {
        return new TrustAsResourceUrl().Filter;
    }

	Filter(value) {
        return $sce.trustAsResourceUrl(value);
	}
}