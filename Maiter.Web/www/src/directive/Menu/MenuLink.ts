/// <reference path="../../ref/angularjs/angular.d.ts" />

export class MenuLink {
    static Factory(): MenuLink {
        return new MenuLink();
    }

    public link: (scope: any, element: any, attrs: angular.IAttributes) => void;
    public templateUrl = 'src/directive/Menu/menu-link.tmpl.html';
    public scope = {
        section: '='
    };

    constructor( /*list of dependencies*/) {

        this.link = (scope: any, element: any, attrs: angular.IAttributes) => {
            var controller = element.parent().controller();

            scope.isSelected = function() {
                return controller.isSelected(scope.section);
            };

            scope.focusSection = function() {
                // set flag to be used later when
                // $locationChangeSuccess calls openPage()
                controller.autoFocusContent = true;
            };
        };
    }
}