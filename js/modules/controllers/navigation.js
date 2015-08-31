(function () {

    'use strict';

    App.controller('NavigationController', function ($rootScope, $scope, $state) {

        var isActive = function (sref) {
            return $state.is(sref) || $state.includes(sref);
        };

        $scope.getMenuItemPropClasses = function (sref) {
            return isActive(sref) ? ' active' : '';
        };
    });

})();