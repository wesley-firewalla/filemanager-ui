var App = angular.module('fileManager', ['ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize',
        'ngCookies', 'ui.bootstrap', 'ui.router', 'ngResource', 'xeditable', 'toastr', 'smart-table'
    ])
    .run(['$rootScope', '$state', '$stateParams', '$window', 'editableOptions', function ($rootScope, $state, $stateParams, $window, editableOptions) {

        editableOptions.theme = 'bs3';

        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;

        // Scope Globals
        // ----------------------------------- 
        $rootScope.app = {
            name: 'File Manager',
            viewAnimation: 'ng-fadeInUp'
        };
    }]);