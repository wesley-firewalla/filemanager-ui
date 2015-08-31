(function () {

    'use strict';

    App.config(function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

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

        })
        .controller('NullController', function () {});

})();