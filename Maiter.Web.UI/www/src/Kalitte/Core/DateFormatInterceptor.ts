/// <reference path="../../ref/angularjs/angular.d.ts" />

import {Meta} from '../Core/Meta';
import {BaseFactory} from '../Core/BaseFactory';

///
// Gelen JSON Result'da ki DateTime Formatındaki verileri new Date(format);  ile instance oluşturmaya yarar.
///

@Meta.Factory('DateFormatInterceptor')
export class DateFormatInterceptor extends BaseFactory {

    static iso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

    static Configure(factory, app: ng.IModule) {

        app.config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('DateFormatInterceptor');
        }]);

        BaseFactory.Configure(factory, app);
    }


    response(response: any) {
        
        // interceptor'da this çalışmıyor context değişiyor, bunları da static-public'e çekmek istemedim.
        function isIso8601(value) {
            return angular.isString(value) && DateFormatInterceptor.iso8601.test(value);
        }

        function convertToDate(input: any) {
            if (!angular.isObject(input)) {
                return input;
            }

            angular.forEach(input, function (value, key) {
                if (isIso8601(value)) {
                    input[key] = new Date(value);
                } else if (angular.isObject(value)) {
                    convertToDate(value);
                }
            });
        }

        convertToDate(response.data);
        return response;
    };



    static $Factory(): DateFormatInterceptor {
        return new DateFormatInterceptor();
    }
}