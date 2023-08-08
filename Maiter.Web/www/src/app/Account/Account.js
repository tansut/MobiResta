/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RegistrationService_1 = require('../../service/RegistrationService');
var BaseController_1 = require('../../lib/BaseController');
var AccountService_1 = require('../../service/data/AccountService');
var BaseAccountController = (function (_super) {
    __extends(BaseAccountController, _super);
    function BaseAccountController() {
        _super.apply(this, arguments);
        this.service = AccountService_1.Account;
    }
    BaseAccountController.ConfigureStates = function ($stateProvider) {
        $stateProvider.state('app.account', {
            url: '/account',
            abstract: true,
            templateUrl: 'src/app/Account/Account.html'
        });
    };
    BaseAccountController.ControllerName = 'BaseAccountController';
    BaseAccountController.register = RegistrationService_1.Registration.RegisterController(BaseAccountController.ControllerName, BaseAccountController);
    return BaseAccountController;
})(BaseController_1.BaseController);
exports.BaseAccountController = BaseAccountController;
