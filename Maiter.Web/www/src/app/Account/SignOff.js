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
var SignOffController = (function (_super) {
    __extends(SignOffController, _super);
    function SignOffController($scope) {
        _super.call(this, $scope);
        if (this.service.principal.isAuthenticated)
            AngularService_1.$timeout(this.logOff.bind(this), 1500);
    }
    SignOffController.ConfigureStates = function ($stateProvider) {
        $stateProvider.state('app.account.signOff', {
            url: '/account/logoff',
            templateUrl: "src/app/Account/SignOff.html",
            controller: SignOffController.ControllerName,
            controllerAs: 'ctrl',
            data: { title: 'Sistemden çıkış' }
        });
    };
    SignOffController.prototype.logOff = function () {
        this.service.logOff().then(function () {
            AngularService_1.$state.go('app.home');
        });
    };
    SignOffController.ControllerName = 'SignOffController';
    SignOffController.register = RegistrationService_1.Registration.RegisterController(SignOffController.ControllerName, SignOffController);
    return SignOffController;
})(Account_1.BaseAccountController);
exports.SignOffController = SignOffController;
