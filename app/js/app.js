var App = angular.module('fileManager', ['ngAnimate', 'ngStorage', 'ngSanitize',
        'ngCookies', 'ui.bootstrap', 'ui.router', 'ngResource', 'toastr'
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
(function () {

    'use strict';

    App.config(["$stateProvider", "$urlRouterProvider", "$controllerProvider", "$compileProvider", "$filterProvider", "$provide", function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

            App.controller = $controllerProvider.register;
            App.directive = $compileProvider.directive;
            App.filter = $filterProvider.register;
            App.factory = $provide.factory;
            App.service = $provide.service;
            App.constant = $provide.constant;
            App.value = $provide.value;

            // default route
            $urlRouterProvider.otherwise('/app/disk');

            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'views/app.html',
                    controller: 'AppController'
                })
                .state('app.disk', {
                    url: '/disk',
                    templateUrl: 'views/disk.html'
                }).state('app.doc', {
                    url: '/doc',
                    templateUrl: 'views/doc.html'
                }).state('app.audio', {
                    url: '/audio',
                    templateUrl: 'views/audio.html'
                }).state('app.image', {
                    url: '/image',
                    templateUrl: 'views/image.html'
                }).state('app.recent', {
                    url: '/recent',
                    templateUrl: 'views/recent.html'
                }).state('app.video', {
                    url: '/video',
                    templateUrl: 'views/video.html'
                });

        }])
        .controller('NullController', function () {});

})();
(function () {

    'use strict';

    App.controller('AudioController', ["$scope", "toastr", "$modal", "$filter", "$state", function ($scope, toastr, $modal, $filter, $state) {




    }]);

})();
(function() {

    'use strict';

    App.controller('DiskController', ["$scope", "toastr", "$modal", "$http", "$state", function($scope, toastr, $modal, $http, $state) {

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
    }]);


})();

(function () {

    'use strict';

    App.controller('DocumentController', ["$scope", "toastr", "$modal", "$filter", "$state", function ($scope, toastr, $modal, $filter, $state) {




    }]);

})();
(function () {

    'use strict';

    App.controller('ImageController', ["$scope", "toastr", "$modal", "$filter", "$state", function ($scope, toastr, $modal, $filter, $state) {




    }]);

})();
(function () {

    'use strict';

    App.controller('AppController', ["$rootScope", "$scope", "$state", "$window", "$localStorage", "$timeout", "toggleStateService", function ($rootScope, $scope, $state, $window, $localStorage, $timeout, toggleStateService) {

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
    }]);

})();
(function () {

    'use strict';

    App.controller('NavigationController', ["$rootScope", "$scope", "$state", function ($rootScope, $scope, $state) {

        var isActive = function (sref) {
            return $state.is(sref) || $state.includes(sref);
        };

        $scope.getMenuItemPropClasses = function (sref) {
            return isActive(sref) ? ' active' : '';
        };
    }]);

})();
(function () {

    'use strict';

    App.controller('RecentController', ["$scope", "toastr", "$modal", "$filter", "$state", function ($scope, toastr, $modal, $filter, $state) {




    }]);

})();
(function () {

    'use strict';

    App.controller('VideoController', ["$scope", "toastr", "$modal", "$filter", "$state", function ($scope, toastr, $modal, $filter, $state) {




    }]);

})();
'use strict';

App.directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return '' + value;
            });
            ngModel.$formatters.push(function(value) {
                return parseFloat(value, 10);
            });
        }
    };
});

'use strict';

App.directive('toggleState', ["toggleStateService", function(toggleStateService) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var $body = $('body');

            $(element).on('click', function(e) {
                e.preventDefault();
                var classname = attrs.toggleState;

                if (classname) {
                    if ($body.hasClass(classname)) {
                        $body.removeClass(classname);
                        if (!attrs.noPersist)
                            toggleStateService.removeState(classname);
                    } else {
                        $body.addClass(classname);
                        if (!attrs.noPersist)
                            toggleStateService.addState(classname);
                    }

                }

            });
        }
    };

}]);

'use strict';

App.service('toggleStateService', ["$rootScope", function($rootScope) {

    var storageKeyName = 'toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
        hasWord: function(phrase, word) {
            return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
        },
        addWord: function(phrase, word) {
            if (!this.hasWord(phrase, word)) {
                return (phrase + (phrase ? ' ' : '') + word);
            }
        },
        removeWord: function(phrase, word) {
            if (this.hasWord(phrase, word)) {
                return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
            }
        }
    };

    // Return service public methods
    return {
        // Add a state to the browser storage to be restored later
        addState: function(classname) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            if (!data) {
                data = classname;
            } else {
                data = WordChecker.addWord(data, classname);
            }

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Remove a state from the browser storage
        removeState: function(classname) {
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if (!data) return;

            data = WordChecker.removeWord(data, classname);

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Load the state string and restore the classlist
        restoreState: function($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            // nothing to restore
            if (!data) return;
            $elem.addClass(data);
        }

    };

}]);

'use strict';

(function ($, window, doc) {

    var $html = $('html'),
        $win = $(window);

    $.support.transition = (function () {

        var transitionEnd = (function () {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                },
                name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && {
            end: transitionEnd
        };
    })();

    $.support.animation = (function () {

        var animationEnd = (function () {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                },
                name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && {
            end: animationEnd
        };
    })();

    $.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    $.support.touch = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (window.DocumentTouch && document instanceof window.DocumentTouch) ||
        (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
        false
    );
    $.support.mutationobserver = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

    $.Utils = {};


    $.Utils.showSpinner = function () {
        $('.content-wrapper').addClass('whirl');
    };

    $.Utils.hideSpinner = function () {
        $('.content-wrapper').removeClass('whirl');
    };

    $.Utils.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    $.Utils.removeCssRules = function (selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if (!selectorRegEx) return;

        setTimeout(function () {
            try {
                _ref = document.styleSheets;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    stylesheet = _ref[_i];
                    idxs = [];
                    stylesheet.cssRules = stylesheet.cssRules;
                    for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                        if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                            idxs.unshift(idx);
                        }
                    }
                    for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                        stylesheet.deleteRule(idxs[_k]);
                    }
                }
            } catch (_error) {}
        }, 0);
    };

    $.Utils.isInView = function (element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(),
            window_top = $win.scrollTop(),
            offset = $element.offset(),
            left = offset.left,
            top = offset.top;

        options = $.extend({
            topoffset: 0,
            leftoffset: 0
        }, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
            return true;
        } else {
            return false;
        }
    };

    $.Utils.options = function (string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf('{') : -1),
            options = {};

        if (start != -1) {
            try {
                options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
            } catch (e) {}
        }

        return options;
    };

    $.Utils.events = {};
    $.Utils.events.click = $.support.touch ? 'tap' : 'click';


    $(function () {

        // Check for dom modifications
        if (!$.support.mutationobserver) return;

        // Install an observer for custom needs of dom changes
        var observer = new $.support.mutationobserver($.Utils.debounce(function (mutations) {
            $(doc).trigger('domready');
        }, 300));

        // pass in the target node, as well as the observer options
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    });

    // add touch identifier class
    $html.addClass($.support.touch ? 'touch' : 'no-touch');

}(jQuery, window, document));