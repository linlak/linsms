define(['angular', 'angular-ui-router'], function (angular) {
    let app = angular.module('smsApp', ['ui.router', 'ngAnimate', 'ngSanitize', 'ngTouch', 'ui.bootstrap', /*'ngMaps',*/ 'chieffancypants.loadingBar', 'toaster', 'ngServices', 'ui.bootstrap.datetimepicker', 'bootstrapLightbox']);
    app.config(function ($controllerProvider, $animateProvider, $provide, $compileProvider, $filterProvider) {
        app._controller = app.controller;
        app._service = app.service;
        app._factory = app.factory;
        app._value = app.value;
        app._directive = app.directive;
        app._component = app.component;
        app._filter = app.filter;
        app._animation = app.animation;
        app.controller = function (name, constructor) {
            $controllerProvider.register(name, constructor);
            return (this);
        };
        app.service = function (name, constructor) {
            $provide.service(name, constructor);
            return (this);
        };
        app.factory = function (name, constructor) {
            $provide.factory(name, constructor);
            return (this);
        };
        app.value = function (name, constructor) {
            $provide.value(name, constructor);
            return (this);
        };
        app.directive = function (name, constructor) {
            $compileProvider.directive(name, constructor);
            return (this);
        };
        app.component = function (name, constructor) {
            $compileProvider.component(name, constructor);
            return (this);
        };
        app.animation = function (name, constructor) {
            $animateProvider.register(name, constructor);
            return (this);
        };
        app.filter = function (name, constructor) {
            $filterProvider.register(name, constructor);
            return (this);
        };
    });
    app.run(['$templateCache', function ($templateCache) {
        'use strict';

        $templateCache.put('lightbox-custom.html',
            "<div class=\"modal-body bg-light text-dark\" ng-swipe-left=Lightbox.nextImage() ng-swipe-right=Lightbox.prevImage()><div class=lightbox-nav><button class=close aria-hidden=true ng-click=$dismiss()>×</button><div class=btn-group ng-if=\"Lightbox.images.length > 1\"><a class=\"btn btn-sm btn-default\" ng-click=Lightbox.prevImage()>‹ Previous</a> <a ng-href={{Lightbox.imageUrl}} target=_blank class=\"btn btn-sm btn-default\" title=\"Open in new tab\">Open image in new tab</a> <a class=\"btn btn-sm btn-default\" ng-click=Lightbox.nextImage()>Next ›</a></div></div><div class=lightbox-image-container><div class=lightbox-image-caption><span>{{Lightbox.imageCaption}}</span></div><img ng-if=!Lightbox.isVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}}><div ng-if=Lightbox.isVideo(Lightbox.image) class=\"embed-responsive embed-responsive-16by9\"><video ng-if=!Lightbox.isSharedVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}} controls autoplay></video><embed-video ng-if=Lightbox.isSharedVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}} ng-href={{Lightbox.imageUrl}} iframe-id=lightbox-video class=embed-responsive-item><a ng-href={{Lightbox.imageUrl}}>Watch video</a></embed-video></div></div></div>"
        );

    }]).config(function (LightboxProvider) {
        //     LightboxProvider.fullScreenMode = true;
        LightboxProvider.templateUrl = 'lightbox-custom.html';

    });
    app.config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    });
    app.config(['$httpProvider', ($httpProvider) => {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);
    app.config(function ($linstoreProvider) {
        $linstoreProvider.setStorageKey('lin_sms');
        $linstoreProvider.setTitileExt('-- LinSMS');
    });
    app.run(function (storage) {});
    app.run(function (user) {});
    app.run(function (sessionChecker) {});
    app.run(function (pusherService, httpService, $log, titleService, $rootScope) {
        pusherService.setKey('zetU0rnPeh1VrMoJ');
        pusherService.setOptions('cluster', 'mt1');
        pusherService.setOptions('wsHost', window.location.hostname);
        pusherService.setOptions('wsPort', 6001);
        pusherService.setOptions('httpHost', window.location.hostname);
        pusherService.setOptions('statsHost', window.location.hostname);
        pusherService.setOptions('httpPath', '/statistics');
        pusherService.setOptions('authEndpoint', '/broadcasting/auth');

        pusherService.setOptions('disableStats', true);
        pusherService.setOptions('authorizer', function (channel, options) {
            let authorize = function (socketId, callback) {
                let query = 'socket_id=' + encodeURIComponent(socketId) +
                    '&channel_name=' + encodeURIComponent(channel.name);
                for (var i in options.authOptions.params) {
                    query += "&" + encodeURIComponent(i) + "=" + encodeURIComponent(options.authOptions.params[i]);
                }
                httpService.postData(options.authEndpoint, query).then(res => {
                    callback(false, res);
                }, err => {
                    callback(true, err);
                });
            };


            return ({
                authorize: authorize,
            });
        });
        // pusherService.privateChannel('App.User.1');
        // pusherService.presenceChannel('App.User.1');
        let lin = pusherService.channel('lin');
        lin.bind('quote.slider', function (e) {
            titleService.setScrollText(e.body);
        });
        lin.bind('quote.created', function (e) {
            titleService.setScrollText(e.body);
        });
        lin.bind('quote.updated', function (e) {
            titleService.setScrollText(e.body);
        });
        lin.bind('quote.deleted', function (e) {
            titleService.setScrollText(e.body);
        });
        lin.bind('quote.viewed', function (e) {
            titleService.setScrollText(e.body);
        });
        $rootScope.$on('$destroy', function () {
            pusherService.channel('lin', true);
        });
    });
    app.directive('onlineClients', function (pusherService, user) {
        return ({
            restrict: 'A',
            scope: {},
            link: function (scope, elem, attrs) {
                scope.stats = {
                    users: 0,
                    connections: 0
                };
                let lin = pusherService.channel('lin');
                lin.bind('online.stats', function (e) {
                    user.init();
                    scope.stats = e;
                });
            },
            template: `
            <div id="on-stats" class="text-center">
                <p class="small">Online<br> {{stats.connections}}<br> 
                Users<br> {{stats.users}}</p>
            </div>`
        });


    });
    app.run(function ($transitions, navToggleService, pageService, titleService, $timeout, $log, user, $state, $window, httpService) {
        titleService.setHooks(titleService.getTitle);
        $transitions.onBefore({}, function ($state, $transition$) {
            navToggleService.unsetVisible();
            let toState = $transition$.to();
            // $log.info(toState);
            let redTo = (toState.redTo) ? toState.redTo : 'login';
            let admin = (toState.admin) ? toState.admin : false;
            let isSuper = (toState.isSuper) ? toState.isSuper : false;
            let auth = (toState.auth) ? toState.auth : false;
            let isAuth = (toState.isAuth) ? toState.isAuth : false;
            let hasSms = (toState.hasSms) ? toState.hasSms : false;
            if (user.first_load) {
                return true;
            }
            if (!user.isLoggedIn()) {
                if (auth) {
                    return $state.target(redTo);
                }
            } else {
                if (!user.hasSMS()) {
                    if (hasSms || (redTo === 'send' || redTo === 'sent')) {
                        redTo = 'buy';
                        return $state.target(redTo);
                    }
                }

                if (isAuth) {
                    return $state.target(redTo);
                }
                if (!user.isAdmin()) {
                    if (admin) {
                        return $state.target('account.profile');
                    }
                } else {
                    if (!user.isSuper()) {
                        if (isSuper) {
                            return $state.target('admin.home');
                        }
                    }
                }
            }
        });
        $transitions.onError({}, function ($state, $transition$) {});
        $transitions.onSuccess({}, function ($state, $transition$) {
            let title = ($transition$.to().title) ? $transition$.to().title : 'Home';
            let page_desc = ($transition$.to().description) ? $transition$.to().description : undefined;
            if (title) {
                $timeout(function () {
                    titleService.setTitle(title, page_desc);
                }, 0);
            }
            pageService.scroll();
            pageService.disRedirect();
            redCheck();
            $timeout(function () {
                user.init();
                let toState = $transition$.to();
                let crawlable = (toState.craw_me || false);
                if (crawlable) {
                    let data = 'page_url=' + $window.location.pathname;
                    data += '&crawler_priority=' + toState.craw_priority + '&page_freq=' + toState.craw_ref;
                    // $log.info(data);
                    httpService.postData('/api/page_stats', data).then(r => {}, e => {});
                }
            }, 300);

        });

        function redCheck() {
            let curState = $state.current;
            let auth = (curState.auth) ? curState.auth : false;
            let isAuth = (curState.isAuth) ? curState.isAuth : false;
            let redTo = (curState.redTo) ? curState.redTo : 'login';
            let clrAuth = (curState.clrAuth) ? curState.clrAuth : false;
            let admin = (curState.admin) ? curState.admin : false;
            let isSuper = (curState.isSuper) ? curState.isSuper : false;
            let hasSms = (curState.hasSms) ? curState.hasSms : false;

            if (!user.isLoggedIn()) {
                if (auth) {
                    pageService.enRedirect();
                    return $state.go(redTo);
                }
            } else {
                if (!user.hasSMS()) {
                    if (hasSms || (redTo === 'send' || redTo === 'sent')) {
                        redTo = 'buy';
                        return $state.go(redTo);
                    }
                }
                if (isAuth) {
                    pageService.enRedirect();
                    $state.go(redTo);
                }
                if (!user.isAdmin()) {
                    if (admin) {
                        pageService.enRedirect();
                        return $state.go('dash.home');
                    }
                } else {
                    if (!user.isSuper()) {
                        if (isSuper) {
                            return $state.go('admin.home');
                        }
                    }
                }
            }
        }
        user.setHook('transitions', redCheck);
        redCheck();

    });
    app.run(function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });
    app.init = function () {
        angular.bootstrap(document, ['smsApp']);
    };
    return app;
});
