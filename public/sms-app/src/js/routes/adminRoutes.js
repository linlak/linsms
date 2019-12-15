define(['app', 'pageRoutes'], function (app) {
    "use strict";
    let tempsAdmin = "/sms-temps/admin/";
    app.config([
        "$stateProvider",
        function (
            $stateProvider
        ) {
            $stateProvider
                .state("admin", {
                    parent: "root",
                    url: "administration",
                    abstract: true,
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/admin/main.html",
                            controller: 'adminCtrl'
                        },
                        "adminhead@admin": {
                            templateUrl: "/sms-temps/admin/admin-head.html"
                        },
                        "adminnav@admin": {
                            templateUrl: "/sms-temps/admin/nav.html"
                        }
                    },
                    resolve: {
                        loadit: (lazyLoader) => {
                            return lazyLoader.loadModule(['adminCtrl']);
                        }
                    }
                })
                .state("admin.home", {
                    url: ".html",
                    auth: true,
                    views: {
                        "admin@admin": {
                            templateUrl: "/sms-temps/admin/notice.html"
                        }
                    },
                    admin: true,
                    title: "Administration"
                })

                //payments
                .state("a_sms", {
                    url: "/payments",
                    parent: "admin",
                    /*views:{
                    	''
                    },*/
                    abstract: true
                })
                .state("a_sms.all", {
                    url: "",
                    auth: true,
                    admin: true,
                    isSuper: true,
                    views: {
                        "admin@admin": {
                            templateUrl: "/sms-temps/admin/sms/sms-pay-list.html",
                            controller: "allSmsCtrl"
                        }
                    },
                    title: "Payments",
                    resolve: {
                        loadit: function (lazyLoader) {
                            lazyLoader.loadModule(["allSmsCtrl"]);
                        },
                        payts: function (adminService) {
                            return adminService.getData("payments");
                        }
                    }
                })
                //me2u
                .state("a_share", {
                    url: "/me2u",
                    parent: "admin",
                    abstract: true
                })
                .state("a_share.all", {
                    url: "",
                    auth: true,
                    admin: true,
                    isSuper: true,
                    title: "Me2U",
                    views: {
                        "admin@admin": {
                            templateUrl: "/sms-temps/admin/sms/me2u.html",
                            controller: "a_me2uCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            lazyLoader.loadModule(["a_me2uCtrl"]);
                        },
                        me2u: function (adminService) {
                            return adminService.getData("payments/me2u");
                        }
                    }
                })
                //sms
                .state("a_sent", {
                    parent: "admin",
                    url: "/sms",
                    abstract: true
                })
                .state("a_sent.all", {
                    url: "",
                    auth: true,
                    admin: true,
                    isSuper: true,
                    title: "SMS Sent",
                    views: {
                        "admin@admin": {
                            templateUrl: "/sms-temps/admin/sms/sms-sent-list.html",
                            controller: 'a_smsListCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['a_smsListCtrl']);
                        },
                        smslist: function (adminService) {
                            return adminService.getData("sms");
                        }
                    }
                })
                //views
                .state("a_views", {
                    url: "/views",
                    parent: "admin",
                    abstract: true
                }).state("a_views.all", {
                    url: "",
                    auth: true,
                    admin: true,
                    title: "User views"
                })
                //quotes
                .state('a_quotes', {
                    parent: 'admin',
                    url: '/quotes',
                    abstract: true,
                })
                .state('a_quotes.all', {
                    url: '',
                    auth: true,
                    admin: true,
                    title: 'Quotes',
                    views: {
                        'admin@admin': {
                            templateUrl: '/sms-temps/admin/quotes/',
                            controller: 'adminQuotesCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['adminQuotesCtrl']);
                        },
                        quotes: function (adminService) {
                            return adminService.getData('quotes');
                        }
                    }
                })
                .state('a_quotes.single', {
                    url: '/{id}',
                    auth: true,
                    admin: true,
                    title: 'Quote Details',
                    views: {
                        'admin@admin': {
                            templateUrl: '/sms-temps/admin/quotes/details.html',
                            controller: 'adminQuoteCtrl'

                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['adminQuoteCtrl']);
                        }
                    }
                })
                //blog
                .state("a_blog", {
                    url: "/blog",
                    parent: "admin",
                    abstract: true
                })
                .state("a_blog.all", {
                    url: "",
                    title: 'Blog',
                    auth: true,
                    admin: true,
                })
                .state("a_blog.cats", {
                    url: "-categories",
                    title: 'Blog Categories',
                    auth: true,
                    admin: true,
                })
                //jobs
                .state("a_jobs", {
                    url: "/jobs",
                    parent: "admin",
                    abstract: true
                })
                .state("a_jobs.all", {
                    url: "",
                    title: 'Jobs',
                    auth: true,
                    admin: true,
                    views: {
                        'admin@admin': {
                            templateUrl: tempsAdmin + 'news/'
                        }
                    },
                })
                //news
                .state("a_news", {
                    url: "/news",
                    parent: "admin",
                    abstract: true
                })
                .state("a_news.all", {
                    url: "",
                    title: 'News',
                    auth: true,
                    admin: true,
                    views: {
                        'admin@admin': {
                            templateUrl: tempsAdmin + 'news/'
                        }
                    },
                })
                .state("a_news.add", {
                    url: "/add",
                    title: 'Add News',
                    auth: true,
                    admin: true,
                    views: {
                        'admin@admin': {
                            templateUrl: tempsAdmin + 'news/add-news.html',
                            controller: 'newsCtrl'
                        }
                    },
                    resolve: {
                        loadit: (lazyLoader) => {
                            return lazyLoader.loadModule(['newsCtrl']);
                        }
                    }
                })
                .state("a_news.detail", {
                    url: "/{id}",
                    title: 'News',
                    auth: true,
                    admin: true,
                })
                .state("a_news.edit", {
                    url: "/edit/{id}",
                    title: 'News',
                    auth: true,
                    admin: true,
                })
                .state("a_pusher", {
                    url: "/pusher-apps",
                    parent: "admin",
                    abstract: true
                })
                .state("a_pusher.all", {
                    url: "",
                    title: 'Pusher Apps',
                    auth: true,
                    admin: true,
                })
                .state("a_pusher.manage", {
                    url: "/{app_id}",
                    title: 'Pusher Apps',
                    abstract: true
                })
                .state("a_pusher.manage.home", {
                    url: "",
                    title: 'Pusher Apps',
                    auth: true,
                    admin: true,
                })
                .state("a_pusher.manage.edit", {
                    url: "/edit",
                    title: 'Pusher Apps',
                    auth: true,
                    admin: true,
                })
                .state("a_pusher.manage.stats", {
                    url: "/statistics",
                    title: 'Pusher Apps',
                    auth: true,
                    admin: true,
                })
                //tuts
                .state("a_tuts", {
                    url: "/tutorials",
                    parent: "admin",
                    abstract: true
                })
                .state("a_tuts.all", {
                    url: "",
                    title: 'Tutorials',
                    auth: true,
                    admin: true,
                    views: {
                        'admin@admin': {
                            templateUrl: tempsAdmin + 'tutorials/',
                            controller: 'a_tutsCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['a_tutsCtrl']);
                        },
                        tutorials: function (adminService) {
                            return adminService.getData('tutorials');
                        }
                    }
                })
                .state('a_tuts.add', {
                    url: '/add-topic',
                    auth: true,
                    admin: true,
                    title: 'Add Topic',
                    views: {
                        'admin@admin': {
                            templateUrl: tempsAdmin + 'tutorials/new-topic.html',
                            controller: 'a_tutsAddCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['a_tutsAddCtrl']);
                        },
                    }
                })
                .state("a_tuts.edit", {
                    url: "/{id}",
                    title: 'Tutorials',
                    auth: true,
                    admin: true,
                    views: {
                        'admin@admin': {
                            templateUrl: tempsAdmin + 'tutorials/edit-tutorial.html',
                            controller: "a_tutsEditCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['a_tutsEditCtrl']);
                        },
                        tutorial: function (adminService, $stateParams) {
                            return adminService.getData('tutorials/' + $stateParams.id);
                        }
                    }
                });

        }
    ]);
});
