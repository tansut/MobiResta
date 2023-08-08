/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/sprintf/sprintf-js.d.ts" />

import {RequestBase, RequestMetadata} from '../shared/RequestBase';
import {$stateParams, $q, $log, $state} from '../shared/Common';

export interface RequestTemplate {
	kitchen?: Array<string>,
	service?: Array<string>,
	vale?: Array<string>,
	management?: Array<string>
}

export class RequestTemplates {
	static Templates: RequestTemplate;

	static init(): ng.IPromise<RequestTemplate> {
		return new $q((resolve: ng.IQResolveReject<RequestTemplate>) => {
			RequestTemplates.Templates =
			{
				service: ['Kolonyalı mendil lütfen', 'Peçete lütfen', 'Kürdan lütfen', 'Şal lütfen']
			}
			resolve(RequestTemplates.Templates)
		})
	}
}