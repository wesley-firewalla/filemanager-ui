(function() {

    'use strict';

    App.controller('DiskController', function($scope, toastr, $modal, $http, $state) {

        $scope.items = [];
        $scope.isGridView = true;
        $scope.showTree = false;
        $scope.viewModeButtonIconClass = 'fa-clock-o';

        var rootItem = {
            name: 'Home',
            virtualPath: '~/upload',
            type: 'folder'
        };

        $scope.breadcrumbs = [rootItem];
        $scope.currentPath = rootItem.virtualPath;

        var requestFiles = function(virtualPath) {
            $.Utils.showSpinner();

            var ajaxUrl = '/server/disk-root.json';
            if (virtualPath == '~/upload/test1') {
                ajaxUrl = '/server/disk-test1-folder.json';
            }

            $http.get(ajaxUrl).then(function(response) {

                $scope.items = response.data;

                $.Utils.hideSpinner();

            });
        };

        requestFiles($scope.currentPath);

        $scope.toggleTree = function() {
            $scope.showTree = !$scope.showTree;
        };

        $scope.sortByDate = function(cssClass) {
            $scope.isGridView = false;
            $scope.viewModeButtonIconClass = cssClass;
        };

        $scope.sortByAlphabetic = function(cssClass) {
            $scope.isGridView = false;
            $scope.viewModeButtonIconClass = cssClass;
        };


        $scope.showGridView = function(cssClass) {
            $scope.isGridView = true;
            $scope.viewModeButtonIconClass = cssClass;
        };


        // Select part
        $scope.allSelected = false;
        $scope.selectAll = function() {
            var items = $scope.items;
            for (var i in items) {
                items[i].isSelected = $scope.allSelected;
            }
        };

        $scope.selectItem = function() {
            var allSelected = true;

            var items = $scope.items;
            for (var i in items) {
                if (!items[i].isSelected) {
                    allSelected = false;
                    break;
                }
            }

            $scope.allSelected = allSelected;
        };


        $scope.clickItem = function(item) {

            if (item.type == 'folder') {
                requestFiles(item.virtualPath);
                $scope.currentPath = item.virtualPath;

                var folderNames = item.virtualPath.replace(rootItem.virtualPath, '').split('/');
                $scope.breadcrumbs = [rootItem];
                var virtualPath = rootItem.virtualPath;
                for (var i in folderNames) {
                    var folderName = folderNames[i];
                    if (folderName) {
                        virtualPath += '/' + folderName;
                        $scope.breadcrumbs.push({
                            type: 'folder',
                            virtualPath: virtualPath,
                            name: folderName
                        });
                    }
                }
            }

        };
    });


})();
