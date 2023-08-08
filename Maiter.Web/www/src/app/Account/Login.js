/// <reference path="../../ref/angularjs/angular.d.ts" />
/// <reference path="../../ref/angular-ui-router/angular-ui-router.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RegistrationService_1 = require('../../service/RegistrationService');
var AngularService_1 = require('../../service/AngularService');
var Account_1 = require('./Account');
var LoginController = (function (_super) {
    __extends(LoginController, _super);
    //   loginAsService() {
    //       this.service.companyLogin(this.model).then((identity) => {
    //		$state.go('home');
    //	})
    //}
    function LoginController($scope) {
        _super.call(this, $scope);
        this.model = {
            ID: 'tansu@gmail',
            Password: '1',
            CompanyID: '112'
        };
    }
    LoginController.ConfigureStates = function ($stateProvider) {
        $stateProvider
            .state('app.account.login', {
            url: '/login',
            templateUrl: "src/app/Account/Login.html",
            controller: LoginController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: 'Sistem giri?i' }
        })
            .state('app.account.resetpassword', {
            url: '/reset-password',
            templateUrl: "src/app/Account/reset-password.html",
            controller: LoginController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: '?ifremi unuttum' }
        });
    };
    LoginController.prototype.loginAsCustomer = function () {
        this.service.login(this.model).then(function (identity) {
            AngularService_1.$state.go('app.home');
        });
    };
    LoginController.ControllerName = 'LoginController';
    LoginController.register = RegistrationService_1.Registration.RegisterController(LoginController.ControllerName, LoginController);
    return LoginController;
})(Account_1.BaseAccountController);
exports.LoginController = LoginController;
