! function () {
    "use strict";
    let angUrl = "libs/angular-1.7.2/";
    let routeUrls = "src/js/routes/";
    let ctrlUrls = "src/js/controllers/";
    let consolectrlUrls = "src/js/controllers/developer/console/";
    let modelctrlUrls = "src/js/modalctrls/";
    require.config({
        baseUrl: "sms-app",
        urlArgs: "bust=" + new Date().getTime(),
        waitSeconds: 0,
        minify: true,
        paths: {
            //jquery
            jquery: "libs/js/jquery.min",
            bootstrap: "libs/bootstrap-4.3.1/js/bootstrap.min",
            popper: "libs/popper/popper.min",
            "popper.js": "libs/popper/popper.min",
            //angular
            loader: angUrl + "angular-loader.min",
            angular: angUrl + "angular.min",
            animate: angUrl + "angular-animate.min",
            sanitize: angUrl + "angular-sanitize.min",
            ngTouch: angUrl + "angular-touch.min",
            loadbar: "libs/angular-loading-bar/build/loading-bar.min",
            quill: "libs/quill/quill",
            "quill-image-resize": "libs/quill-image-resize-module/image-resize.min",
            "quill-image-drop": "libs/quill-image-drop-module/image-drop.min",
            ngQuill: "libs/ng-quill/src/ng-quill",
            "wiz.markdown": "libs/wizMarkdown/wizMarkdown",
            uib: "libs/js/ui-bootstrap-tpls-3.0.5.min",
            "datetime-picker": "libs/bootstrap-ui-datetime-picker/dist/datetime-picker.min",
            "angular-ui-router": "libs/js/angular-ui-router.min",
            social: "libs/js/angularjs-social-login",
            toaster: "libs/angular-toaster/toaster.min",
            ngPaypal: "libs/js/ngPaypal",
            ngEncrypt: "libs/js/ngEncrypt",
            ngMaps: "libs/js/ngMaps",
            ngServices: "libs/js/ngServices",
            idb: "libs/js/idb",
            "pusher-angular": "libs/pusher-angular/lib/pusher-angular.min",
            pusher: "libs/pusher/web/pusher.min",
            //lightbox
            bootstrapLightbox: "libs/lightbox/angular-bootstrap-lightbox.min",
            //routes
            pageRoutes: routeUrls + "pageRoutes",
            //services
            services: "src/js/services/services",
            user: "src/js/services/user",
            //modalctrls
            buyMdl: modelctrlUrls + "buyMdl",
            phoneBookMdl: modelctrlUrls + "phoneBookMdl",
            confirmSendMdl: modelctrlUrls + "confirmSendMdl",
            contactsMdl: modelctrlUrls + "contactsMdl",
            rightsMdl: modelctrlUrls + "rightsMdl",
            loginMdl: modelctrlUrls + "loginMdl",
            //controllers
            rootCtrl: ctrlUrls + "rootCtrl",
            smsSendCtrl: ctrlUrls + "sms/smsSendCtrl",
            smsBuyCtrl: ctrlUrls + "sms/smsBuyCtrl",
            smsPayCtrl: ctrlUrls + "sms/smsPayCtrl",
            smsPriceCtrl: ctrlUrls + "sms/smsPriceCtrl",
            smsPhoneCtrl: ctrlUrls + "sms/smsPhoneCtrl",
            smsSentCtrl: ctrlUrls + "sms/smsSentCtrl",
            phonesingleCtrl: ctrlUrls + "sms/phonesingleCtrl",
            smsMe2UCtrl: ctrlUrls + "sms/smsMe2UCtrl",
            //admin
            adminCtrl: ctrlUrls + "admin/adminCtrl",
            a_usersCtrl: ctrlUrls + "admin/user/a_usersCtrl",
            a_smsListCtrl: ctrlUrls + "admin/sms/a_smsListCtrl",
            allSmsCtrl: ctrlUrls + "admin/sms/allSmsCtrl",
            a_me2uCtrl: ctrlUrls + "admin/sms/a_me2uCtrl",
            adminQuoteCtrl: ctrlUrls + "admin/quotes/adminQuoteCtrl",
            adminQuotesCtrl: ctrlUrls + "admin/quotes/adminQuotesCtrl",
            //news
            newsCtrl: ctrlUrls + "admin/news/newsCtrl",
            //auth
            loginCtrl: ctrlUrls + "auth/loginCtrl",
            registerCtrl: ctrlUrls + "auth/registerCtrl",
            recPassCtrl: ctrlUrls + "auth/recPassCtrl",
            verifictionCtrl: ctrlUrls + "auth/verifictionCtrl",
            //account
            AccHomeCtrl: ctrlUrls + "account/AccHomeCtrl",
            //developer console
            createAppCtrl: consolectrlUrls + "createAppCtrl",
            myappsCtrl: consolectrlUrls + "myappsCtrl",
            myappCtrl: consolectrlUrls + "myappCtrl",
            myDomainsCtrl: consolectrlUrls + "myDomainsCtrl"
        },
        shim: {
            jquery: {
                exports: "$"
            },
            bootstrap: ["jquery"],
            angular: {
                exports: "angular",
                deps: ["jquery", "bootstrap", "bootstrap", "loader"]
            },
            pusher: {
                exports: "Pusher"
            },
            quill: {
                exports: "Quill",
                deps: ["angular"]
            },
            // "quill-image-drop": {
            //     exports: "ImageDrop",
            //     deps: ["quill"]
            // },
            // "quill-image-resize": { exports: "ImageResize", deps: ["quill"] },
            sanitize: ["angular"],
            animate: ["angular"],
            ngTouch: ["angular", "animate"],
            "angular-ui-router": ["angular"],
            uib: ["angular", "sanitize", "animate"],
            "wiz.markdown": ["angular", "sanitize"],
            "datetime-picker": ["angular", "uib"],
            toaster: ["angular", "sanitize"],
            "pusher-angular": ["angular", "pusher"],
            ngMaps: {
                exports: "ngMaps",
                deps: ["angular", "uib"]
            },
            ngQuill: [
                "angular",
                "sanitize",
                "quill",
                // "quill-image-drop",
                // "quill-image-resize"
            ],
            social: ["angular"],
            loadbar: ["angular"],
            bootstrapLightbox: ["angular", "ngTouch"],
            ngServices: {
                exports: "ngServices",
                deps: ["angular", "toaster", "pusher-angular", "pusher", "uib"]
            },
            app: [
                "angular",
                "sanitize",
                "animate",
                "ngServices",
                "ngTouch",
                "uib",
                "angular-ui-router",
                "loadbar",
                "toaster",
                "pusher-angular",
                "datetime-picker",
                "bootstrapLightbox",
                "wiz.markdown",
                'quill',
                "ngQuill",
                // "quill-image-drop",
                // "quill-image-resize"
            ]
        }
    });
    require(["app", "services", "user", "pageRoutes"], app => {

        app.init();
        hideLoading();
    }, e => {
        showReload();
    });
}.call(this);
