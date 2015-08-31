(function () {

    'use strict';

    App.controller('AppController', function ($rootScope, $scope, $state, $window, $localStorage, $timeout, toggleStateService) {

        // Hook not found
        $rootScope.$on('$stateNotFound',
            function (event, unfoundState, fromState, fromParams) {
                console.log(unfoundState.to);
                console.log(unfoundState.toParams);
                console.log(unfoundState.options);
            });

        // Hook error
        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                console.log(error);
            });

        // Hook success
        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                $window.scrollTo(0, 0);
            });

        $rootScope.pageTitle = function () {
            return $rootScope.app.name;
        };

        toggleStateService.restoreState($(document.body));

        // Applies animation to main view for the next pages to load
        $timeout(function () {
            $rootScope.mainViewAnimation = $rootScope.app.viewAnimation;
        });

        // cancel click event easily
        $rootScope.cancel = function ($event) {
            $event.stopPropagation();
        };
    });

})();