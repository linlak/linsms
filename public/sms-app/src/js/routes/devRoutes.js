define(["app", "pageRoutes"], app => {
    "use strict";
    app.config([
        "$stateProvider",
        function (
            $stateProvider
        ) {
            $stateProvider
                //developer
                .state("developer", {
                    url: "developer",
                    parent: "root",
                    abstract: true,
                    views: {
                        'body@root': {
                            templateUrl: '/sms-temps/developer/',
                            controller: "devMainCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['devMainCtrl']);
                        }
                    }
                })
                .state('dev', {
                    parent: 'developer',
                    title: 'Developer',
                    description: "at linsms we help developers to easily integrate their systems with our open api, our api gives you access to our sms getway, online payment system, funds tranfers and sandbox testing",
                    url: '',
                    craw_me: true,
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/home.html',
                            controller: "devHomeCtrl"
                        },
                        'nav@developer': {
                            templateUrl: ' /sms-temps/developer/nav.html',
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['devHomeCtrl']);
                        }
                    }
                })
                .state('console', {
                    parent: 'developer',
                    title: 'Developer Console',
                    url: '/console',
                    abstract: true,
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/console/'
                        },
                        'nav@developer': {
                            templateUrl: '/sms-temps/developer/console/nav.html'
                        }
                    }
                })
                .state('console.home', {
                    url: '',
                    title: 'Developer Console',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/console/home.html'
                        }
                    },
                })
                .state('console.domains', {
                    url: '/my-domains',
                    title: 'My Domains',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@console': {
                            templateUrl: '/sms-temps/developer/console/domains.html',
                            controller: 'myDomainsCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['myDomainsCtrl']);
                        },
                        mydomains: function (devService) {
                            return devService.getConsole('domains');
                        }
                    }
                })
                .state('console.app', {
                    url: '/create-app',
                    title: 'Create App',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@console': {
                            templateUrl: '/sms-temps/developer/console/myapps/create-app.html',
                            controller: 'createAppCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['createAppCtrl']);
                        }
                    },
                })
                .state('console.apps', {
                    url: '/my-apps',
                    title: 'My Apps',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@console': {
                            templateUrl: '/sms-temps/developer/console/myapps/',
                            controller: 'myappsCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['myappsCtrl']);
                        },
                        apps: function (devService) {
                            return devService.getConsole('my-apps');
                        }
                    },
                })
                .state('appdetail', {
                    parent: 'console',
                    url: '/my-app/{id}',
                    title: 'My App',
                    auth: true,
                    abstract: true,
                    redTo: 'dev',
                    views: {
                        'body@console': {
                            templateUrl: '/sms-temps/developer/console/myapps/details/',
                            controller: "appDetCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['appDetCtrl']);
                        },
                        app_id: function (devService, $stateParams) {
                            return devService.setAppId($stateParams.id);
                        }
                    },
                    description: ""
                })
                .state('appdetail.home', {
                    url: '',
                    title: 'My App',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@appdetail': {
                            templateUrl: '/sms-temps/developer/console/myapps/details/home.html',
                            controller: 'myappCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['myappCtrl']);
                        },
                        web_app: function (devService, $stateParams) {
                            return devService.getApp();
                        }
                    },
                })
                .state('appdetail.edit', {
                    url: '/edit',
                    title: 'My App',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@appdetail': {
                            templateUrl: '/sms-temps/developer/console/myapps/details/edit.html',
                            controller: 'myappCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['myappCtrl']);
                        },
                        web_app: function (devService, $stateParams) {
                            return devService.getApp('/edit');
                        }
                    },
                })
                .state('appdetail.messages', {
                    url: '/messages',
                    title: 'App Messages',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@appdetail': {
                            templateUrl: '/sms-temps/developer/console/myapps/details/messages.html',
                            controller: 'myappSmsCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['myappSmsCtrl']);
                        },
                        web_app: function (devService, $stateParams) {
                            return devService.getApp('/messages');
                        }
                    },
                })
                .state('appdetail.settings', {
                    url: '/settings',
                    title: 'App Settings',
                    auth: true,
                    redTo: 'dev',
                    // views: {
                    //     'body@appdetail': {
                    //         templateUrl: '/sms-temps/developer/console/myapps/details/home.html',
                    //         controller: 'myappCtrl'
                    //     }
                    // },
                    // resolve: {
                    //     loadit: function (lazyLoader) {
                    //         return lazyLoader.loadModule(['myappCtrl']);
                    //     },
                    //     web_app: function (devService, $stateParams) {
                    //         return devService.getApp('/messages');
                    //     }
                    // },
                })
                .state('appdetail.hooks', {
                    url: '/web-hooks',
                    title: 'App WebHooks',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@appdetail': {
                            templateUrl: '/sms-temps/developer/console/myapps/details/web-hooks.html',
                            // controller: 'myappCtrl'
                        }
                    },
                    // resolve: {
                    //     loadit: function (lazyLoader) {
                    //         return lazyLoader.loadModule(['myappCtrl']);
                    //     },
                    //     web_app: function (devService, $stateParams) {
                    //         return devService.getApp('/messages');
                    //     }
                    // },
                })
                .state('appdetail.stats', {
                    url: '/statistics',
                    title: 'App Statistics',
                    auth: true,
                    redTo: 'dev',
                    views: {
                        'body@appdetail': {
                            templateUrl: '/sms-temps/developer/console/myapps/details/stats.html',
                            controller: 'myappStatsCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['myappStatsCtrl']);
                        },
                        web_app: function (devService, $stateParams) {
                            return devService.getApp('/stats');
                        }
                    },
                })
                .state('tutorials', {
                    parent: 'developer',
                    title: 'Developer',
                    url: '/tutorials',
                    abstract: true,
                    views: {
                        'nav@developer': {
                            templateUrl: '/sms-temps/developer/tutorials/nav.html',
                            controller: function ($scope) {
                                $scope.navItems = [];
                            }
                        }
                    }
                })
                .state('tutorials.home', {
                    url: '',
                    title: 'Docs',
                    craw_me: true,
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/tutorials/',
                            controller: "tutorialsCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['tutorialsCtrl']);
                        },
                        tutorials: function (devService) {
                            return devService.getData('tutorials');
                        }
                    }
                })
                .state('tutorials.details', {
                    url: '/{title_link}',
                    title: 'Docs',
                    craw_me: true,
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/tutorials/tutorial.html',
                            controller: "tutorialDetCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['tutorialDetCtrl']);
                        },
                        tutorial: function (devService, $stateParams) {
                            return devService.getData('tutorials/' + $stateParams.title_link);
                        }
                    }
                });
        }
    ]);
});
