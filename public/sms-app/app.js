define(['angular', 'angular-ui-router'], function (angular) {
    let app = angular.module('smsApp', ['ui.router', 'ngAnimate', 'socialLogin', 'ngSanitize', 'ngTouch', 'ui.bootstrap', /*'ngMaps',*/ 'chieffancypants.loadingBar', 'toaster', 'ngServices', 'ui.bootstrap.datetimepicker', 'bootstrapLightbox', 'wiz.markdown', 'ngQuill']);
    app.constant('NG_QUILL_CONFIG', {
        /*
         * @NOTE: this config/output is not localizable.
         */
        modules: {
            imageResize: {},
            imageDrop: true,
            toolbar: [

                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                ['blockquote', 'code-block'],

                [{
                    'header': 1
                }, {
                    'header': 2
                }], // custom button values
                [{
                    'list': 'ordered'
                }, {
                    'list': 'bullet'
                }],
                [{
                    'script': 'sub'
                }, {
                    'script': 'super'
                }], // superscript/subscript
                [{
                    'indent': '-1'
                }, {
                    'indent': '+1'
                }], // outdent/indent
                [{
                    'direction': 'rtl'
                }], // text direction

                [{
                    'size': ['small', false, 'large', 'huge']
                }], // custom dropdown
                [{
                    'header': [1, 2, 3, 4, 5, 6, false]
                }],

                [{
                    'color': []
                }, {
                    'background': []
                }], // dropdown with defaults from theme
                [{
                    'font': []
                }],
                [{
                    'align': []
                }],

                ['clean'], // remove formatting button

                ['link', 'image', 'video'] // link and image, video
            ]
        },
        theme: 'snow', //  bubble snow core
        debug: 'warn',
        placeholder: '',
        readOnly: false,
        bounds: document.body,
        scrollContainer: null
    });
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
    app.config([
        'ngQuillConfigProvider',
        'NG_QUILL_CONFIG',
        function (ngQuillConfigProvider, NG_QUILL_CONFIG) {
            ngQuillConfigProvider.set(NG_QUILL_CONFIG);
        }
    ]);
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
        $linstoreProvider.setDbVer(2);
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
            <div id="on-stats" class="text-center bg-dark text-white">
                <p class="small">Online<br> {{stats.connections}}<br> 
                Users<br> {{stats.users}}</p>
            </div>`
        });


    });
    app.run(function ($transitions, navToggleService, pageService, titleService, $timeout, $log, user, $state, $window) {
        titleService.setHooks(titleService.getTitle);
        $transitions.onBefore({}, function ($state, $transition$) {
            navToggleService.unsetVisible();
            let toState = $transition$.to();
            let redTo = (toState.redTo) ? toState.redTo : 'login';
            let admin = (toState.admin) ? toState.admin : false;
            let isSuper = (toState.isSuper) ? toState.isSuper : false;
            let auth = (toState.auth) ? toState.auth : false;
            let isAuth = (toState.isAuth) ? toState.isAuth : false;
            let hasSms = (toState.hasSms) ? toState.hasSms : false;
            if (user.firstLoad()) {
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
                    if (!user.hasSMS()) {
                        if (hasSms || (redTo === 'send' || redTo === 'sent')) {
                            redTo = 'buy';
                        }
                    }
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
        // $transitions.onStart({}, function ($state, $transition$) {
        //     $log.info('onstart');
        //     return true;
        // });
        // $transitions.onEnter({}, function ($state, $transition$) {
        //     $log.info('onEnter');
        //     return true;
        // });
        // $transitions.onRetain({}, function ($state, $transition$) {
        //     $log.info('onRetain');
        //     return true;
        // });
        // $transitions.onExit({}, function ($state, $transition$) {
        //     $log.info('onExit');
        // });
        $transitions.onFinish({}, function ($state, $transition$) {
            pageService.scroll();
            pageService.disRedirect();
            if ($transition$.isActive()) {
                let title = ($transition$.to().title) ? $transition$.to().title : 'Home';
                let page_desc = ($transition$.to().description) ? $transition$.to().description : undefined;
                if (title) {
                    $timeout(function () {
                        titleService.setTitle(title, page_desc);
                    }, 0);
                }
            }
        });
        $transitions.onSuccess({}, function ($state, $transition$) {
            $timeout(function () {
                user.init();
                let toState = $transition$.to();
                let crawlable = (toState.craw_me || false);
                if (crawlable) {
                    let data = {
                        page_url: $window.location.pathname,
                        crawler_priority: toState.craw_priority || 0.9,
                        page_freq: toState.craw_ref || 'weekly'
                    };
                    pageService.sendCrawrable(data);

                }
            }, 300);
        });
        $transitions.onError({}, function ($state, $transition$) {
            $log.info('onError', $transition$);
            return true;
        });


        user.setHook('transitions', user.redCheck);
        user.redCheck();
    });
    app.run(function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });

    app.directive('linwizMarkdownEditor', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                scope: {
                    'content': '='
                },
                replace: true,
                transclude: true,
                template: '<div class="markdown-editor">' +
                    '<div class="markdown-toolbar bg-light" ng-if="!toolbarBottom" ng-transclude></div>' +
                    '<textarea class="markdown-input form-control auto-expand-input" ng-model="content"></textarea>' +
                    '<div class="markdown-toolbar" ng-if="toolbarBottom" ng-transclude></div>' +
                    '</div>',
                controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {}],
                link: function (scope, elem, attrs, ctrl) {
                    var editor = new MarkdownDeepEditor.Editor(elem.find('textarea')[0], null);
                    editor.onPostUpdateDom = function (editor) {
                        $timeout(function () {
                            scope.content = elem.find('textarea').val();
                        });
                    };
                    scope.toolbarBottom = attrs.toolbar === 'bottom';
                    // Exposes editor to other directives
                    ctrl.editor = editor;
                }
            };
        }])

        .directive('linwizToolbarButton', function () {
            return {
                require: '^linwizMarkdownEditor',
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {},
                template: '<span class="btn btn-sm" ng-click="format()" ng-transclude></span>',
                link: function (scope, elem, attrs, wizMarkdownEditorCtrl) {
                    if (attrs.command) {
                        scope.format = function () {
                            wizMarkdownEditorCtrl.editor.InvokeCommand(attrs.command);
                        };
                    } else {
                        console.error('linwiz-toolbar-button requires a "command" attribute e.g: command="bold" ');
                    }
                }
            };
        })
        .directive('linwizToolbarButtonModel', function ($uibModal, $document, httpService, $q) {
            return {
                require: '^linwizMarkdownEditor',
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    images: '@'
                },
                template: '<span class="btn btn-sm"  ng-click="format()" ng-transclude></span>',
                link: function (scope, elem, attrs, wizMarkdownEditorCtrl) {
                    scope.wizMarkdownEditorCtrl = wizMarkdownEditorCtrl;

                    function openModel() {
                        let d = $q.defer();
                        let modalInstance = $uibModal.open({
                            animation: true,
                            ariaLabelledBy: "modal-title",
                            ariaDescribedBy: "modal-body",
                            templateUrl: "pick-images.html",
                            controller: "pickImagesCtrl",
                            controllerAs: "$ctrl",
                            resolve: {
                                images: httpService => {
                                    return httpService.getData(scope.images);
                                }
                            },
                            size: "md",
                            appendTo: angular.element(
                                $document[0].querySelector("#mypage")
                            )
                        });
                        modalInstance.result.then(
                            r => {
                                d.resolve(r);
                            },
                            e => {
                                d.reject(e);
                            }
                        );
                        return d.promise;
                    };
                    scope.format = function () {
                        if (!scope.images) {
                            return;
                        }
                        openModel().then(r => {
                            scope.wizMarkdownEditorCtrl.editor.InvokeCommand('image', r);
                        }, e => {});
                    };
                }
            };
        })
        .directive('linEditor', function () {
            return {
                restrict: 'EA',
                scope: {
                    'content': '=',
                    'imagesUrl': '@'
                },
                replace: true,
                transclude: true,
                template: `
                        <div class="row">
                            <div class="col-sm-6">
                             <linwiz-markdown-editor content="content">
                                <linwiz-toolbar-button command="undo"><span class="fa fa-undo"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="redo" title="Redo"><span class="fa fa-redo"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="bold"><span class="fa fa-bold"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="italic"><span class="fa fa-italic"></span></linwiz-toolbar-button>  
                                <linwiz-toolbar-button command="heading"><span class="fa fa-heading"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="code"><span class="fa fa-code"></span></linwiz-toolbar-button>   
                                <linwiz-toolbar-button command="ullist"><span class="fa fa-list-ul"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="ollist"><span class="fa fa-list-ol"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="indent"><span class="fa fa-indent"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="outdent"><span class="fa fa-outdent"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="link"><span class="fa fa-link"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="img"><span class="fa fa-image"></span></linwiz-toolbar-button> 
                                <linwiz-toolbar-button-model images="{{imagesUrl}}" ng-if="imagesUrl"><span class="fa fa-images"></span></linwiz-toolbar-button-model>
                                <linwiz-toolbar-button command="hr"><span class="fa fa-minus"></span></linwiz-toolbar-button>
                                <linwiz-toolbar-button command="h0">h0</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="h1">h1</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="h2">h2</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="h3">h3</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="h4">h4</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="h5">h5</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="h6">h6</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="tab">tab</linwiz-toolbar-button>
                                <linwiz-toolbar-button command="untab"><span class="fa fa-untappd"></span></linwiz-toolbar-button>
                            </linwiz-markdown-editor>
                        </div>
                        <div class="col-sm-6">
                            <div lin-markdown="{{content}}" ></div>
                        </div>
                    </div>`,
            };
        });


    app.init = function () {
        angular.bootstrap(document, ['smsApp']);
    };
    return app;
});
