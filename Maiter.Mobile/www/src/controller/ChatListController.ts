/// <reference path="../ref/angular-ui-router/angular-ui-router.d.ts" />

import {SendMessageRequest} from '../request/SendMessageRequest';
import {RequestController} from './RequestController';
import {$stateParams, $q, $log, $state,$ionicScrollDelegate} from '../shared/Common';

    export class ChatListController extends RequestController<SendMessageRequest> {

        static $inject = ['$scope'];

        private textMessage: string;
        public chatParams: any;
        
        init(){
            super.init();
            $ionicScrollDelegate.scrollBottom(true);
        }

        showNotify(msg) {
			return this.alert(msg);          
        }

        beforeEnter() {
            $ionicScrollDelegate.scrollBottom(true);
            var result = super.beforeEnter(); 
            if (result) {                
                if (this.chatParams.notify) {
                    this.showNotify(this.chatParams.notify);
                }
            }
            return  result;
        }

        constructor($scope: ng.IScope) {
            super(SendMessageRequest, $scope);
            this.chatParams = $stateParams;
        }

        createChatMessage(text: string) {

        }

        go(form) {
            if(form.$valid){
                 return super.go(false).then(()=> {
                this.init();
            });
            }
        }
        
    }