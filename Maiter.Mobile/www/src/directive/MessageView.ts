/// <reference path="../ref/angularjs/angular.d.ts" />

export class MessageView {
    static Factory(): MessageView {
        return new MessageView();
    }

    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    public template = '';
    public scope = {};

    // templateUrl: function(elem, attr){
    // return 'customer-'+attr.type+'.html';
    // }

    constructor( /*list of dependencies*/) {

        this.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

        };
    }
}