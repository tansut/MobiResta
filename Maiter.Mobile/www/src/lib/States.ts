/// <reference path="../ref/angularjs/angular.d.ts" />
/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />

import {Branch} from '../request/Branch';
import {RequestBase} from '../shared/RequestBase';

export class AppStates {

    private static createRequestStates($stateProvider: ng.ui.IStateProvider) {

        for (var type in RequestBase.requestClasses) {
            var upperType = type[0].toUpperCase() + type.substring(1, type.length);
            var fn = RequestBase.requestClasses[type];
            var isVirtual = fn['virtual'] && fn.hasOwnProperty('virtual');
            if (!isVirtual) {
                $stateProvider.state('app.customerRequest' + type, {
                    url: "/{branch}/request-" + type,
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/request-' + type + '.html',
                            controller: upperType + 'Request' + 'Controller as ctrl'
                        }
                    }
                })
            } else {
                // do nothing (tansu)
            }
        }
    }

    static Configure($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/app-menu.html",
            controller: 'AppController as ctrl'
        })
            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html",
                        controller: 'HomeController as ctrl'
                    }
                }
            })
            .state('app.initSession', {
                url: "/init-session",
                params: {
                    toState: null,
                    toStateParams: null
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/init-session.html",
                        controller: 'InitSessionController as ctrl'
                    }
                }
            })
            .state('app.chatlist', {
                url: "/{branch}/chat-list",
                params: {
                    notify: null
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/chat-list.html",
                        controller: 'ChatListController as ctrl'
                    }
                }, 
                onEnter: () => {
                    console.log("chat-list-enter");
                },
                onExit: () => {
                    console.log("chat-list-out");
                }
            });

        AppStates.createRequestStates($stateProvider);

        $urlRouterProvider.otherwise('/app/home');
    }
}

