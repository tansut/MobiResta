/// <reference path="../ref/angularjs/angular.d.ts" />

export class AppController {

	static $inject = ['$scope','$rootScope'];

	constructor(private $scope: ng.IScope, $rootScope : ng.IRootScopeService) {

	    $rootScope.$on('$stateChangeStart',
	        (event, toState, toParams, fromState, fromParams) => {
	            //event.preventDefault(); 
	            // transitionTo() promise will be rejected with 
	            // a 'transition prevented' error
	    });
	}
}
   