define(["app"], app => {
    "use strict";
    let tempsMain = "/sms-temps/main/";
    let tempsForms = "/sms-temps/forms/";
    app.config([
        "$stateProvider",
        "$urlRouterProvider",
        "$urlMatcherFactoryProvider",
        "$locationProvider",
        function (
            $stateProvider,
            $urlRouterProvider,
            $urlMatcherFactoryProvider,
            $locationProvider
        ) {
            $urlMatcherFactoryProvider.strictMode(false);
            $urlMatcherFactoryProvider.caseInsensitive(true);
            $locationProvider.hashPrefix("!");
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state("root", {
                    url: "/",
                    abstract: true,
                    views: {
                        "@": {
                            templateUrl: tempsMain + "main.html",
                            controller: function (
                                $scope,
                                navToggleService,
                                user,
                                authService,
                                $log,
                                popService,
                                $state
                            ) {
                                $scope.isUser = false;
                                $scope.isAdmin = false;
                                $scope.isSuper = false;
                                $scope.me;
                                $scope.isNavCollapsed = false;
                                $scope.showSide = false;

                                function checkUser() {
                                    $scope.isUser = user.isLoggedIn();
                                    $scope.isAdmin = user.isAdmin();
                                    $scope.isSuper = user.isSuper();
                                    $scope.me = user;
                                }
                                $scope.toggleCollapse = function () {
                                    navToggleService.toggleVisible("myNav");
                                };
                                $scope.toggleSide = function () {
                                    navToggleService.toggleVisible("sidenav");
                                };
                                $scope.logout = function () {
                                    navToggleService.unsetVisible();
                                    authService.logout();
                                };
                                $scope.isActive = (glob) => {
                                    return navToggleService.isActive(glob);
                                };
                                $scope.openAdmin = function () {
                                    popService.rightsForm();
                                };

                                navToggleService.setHook(function () {
                                    $scope.isNavCollapsed = navToggleService.isVisibleNav(
                                        "myNav"
                                    );
                                    $scope.showSide = navToggleService.isVisibleNav(
                                        "sidenav"
                                    );
                                });
                                user.setHook("rootCtr", checkUser);
                                checkUser();
                            }
                        },
                        "nav@root": {
                            templateUrl: tempsMain + "nav.html"
                        },
                        "sidenav@root": {
                            templateUrl: tempsMain + "side-nav.html"
                        },
                        "alertcont@root": {
                            templateUrl: tempsMain + "errcontainer.html",
                            controller: "alertCtrl"
                        }
                    }
                })
                .state("home", {
                    parent: "root",
                    url: "",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/page/home.html"
                        },
                        "coverage@home": {
                            templateUrl: "sms-temps/sms/sms-coverage.html"
                        }
                    },
                    title: "Home",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                })
                .state("about", {
                    parent: "root",
                    url: "about-us.html",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/page/about-us.html",
                            controller: function ($scope, Lightbox) {
                                $scope.images = [{
                                        'id': 1,
                                        'url': '/images/lin.png',
                                        'caption': 'LinSMS Uganda',
                                        'thumbUrl': '/images/lin.png'
                                    },
                                    {
                                        'id': 2,
                                        'url': '/images/lin.png',
                                        'caption': 'LinSMS Uganda 2',
                                        'thumbUrl': '/images/lin.png'
                                    }
                                ];
                                $scope.openLightboxModal = function (index) {
                                    Lightbox.openModal($scope.images, index, {
                                        size: 'md',
                                    });
                                };
                            }
                        }
                    },
                    title: "About Us",
                    description: "know more about linsms, and all the services offered at linsms such as bulksms, money transfer, and our feature rich interfance and integration api, and sms gateway",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                })
                .state("contact", {
                    parent: "root",
                    url: "contact-us.html",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/page/contact-us.html"
                        },
                        "contactform@contact": {
                            templateUrl: "sms-temps/forms/contact-us.html"
                        }
                    },
                    title: "Contact Us",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                })
                .state("terms", {
                    parent: "root",
                    url: "terms-and-conditions.html",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/page/terms.html"
                        }
                    },
                    title: "Terms and Conditions",
                    description: "linsms aims to provide you with the best bulksms services while consindering your safety online, we setup terms and conditions that govern your usage at linsms",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                })
                .state("privacy", {
                    parent: "root",
                    url: "privacy.html",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/page/privacy.html"
                        }
                    },
                    title: "Privacy Policy",
                    description: "linsms a bulksms website in uganda consinder your security a priority, linsms privacy will help you know what tools and security features we use to protect your data while at linsms",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                })
                .state('my_sms', {
                    parent: "root",
                    abstract: true,
                })
                .state('my_pay', {
                    parent: "root",
                    abstract: true,
                })
                .state("send", {
                    parent: "my_sms",
                    url: "send-sms.html",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/sms/sms-form.html",
                            controller: "smsSendCtrl"
                        }
                    },
                    params: {
                        id: {
                            value: [],
                            array: true
                        },
                        action: {
                            value: ""
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["smsSendCtrl"]);
                        },
                        smscal: function (smsService) {
                            return smsService.getData("cal");
                        },
                        smsparams: function ($stateParams, smsService) {
                            return smsService.getParams($stateParams);
                        }
                    },
                    hasSms: true,
                    title: "Send SMS",
                    auth: true,
                    redTo: "home",
                    description: "send bulk sms with linsms a bulksms marketing website helping people to send bulksms using any internet enabled devive to user in uganda"
                })
                .state("prices", {
                    parent: "root",
                    url: "pricing.html",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/sms/sms-prices.html"
                        },
                        "currencyquote@prices": {
                            templateUrl: "sms-temps/sms/sms-curency-quote.html"
                        },
                        "pricelist@prices": {
                            templateUrl: "sms-temps/sms/sms-price-list.html",
                            controller: "smsPriceCtrl"
                        },
                        "coverage@prices": {
                            templateUrl: "sms-temps/sms/sms-coverage.html"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["smsPriceCtrl"]);
                        },
                        prices: function (smsService) {
                            return smsService.getData("prices");
                        }
                    },
                    isAuth: true,
                    redTo: "buy",
                    title: "Pricing",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    description: "linsms uganda offers competetive prices that are managable by users with all pocket sizes, our prices go as low as 25/= (ug shillings)"
                })
                .state("sent", {
                    parent: "my_sms",
                    url: "sent.html",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/sms/sms-sent-list.html",
                            controller: "smsSentCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["smsSentCtrl"]);
                        },
                        recentSms: function (smsService) {
                            return smsService.getData("sent");
                        }
                    },
                    title: "Sent SMS",
                    auth: true,
                    hasSms: true,
                    redTo: "home",
                    description: "linsms helps you to list all sms you sent, we also help you to send to pre saved lists or to resend the sms which helps not to carry lists of contacts"
                })
                .state("pending", {
                    parent: "my_sms",
                    url: "pending-sms.html",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/sms/sms-sent-list.html",
                            controller: "smsSentCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["smsSentCtrl"]);
                        },
                        recentSms: function (smsService) {
                            return smsService.getData("sent");
                        }
                    },
                    title: "Pending SMS",
                    auth: true,
                    hasSms: true,
                    redTo: "home",
                    description: ""
                })
                .state("buy", {
                    parent: "my_pay",
                    url: "buy.html",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/sms/buy-sms.html"
                        },
                        "currencyquote@buy": {
                            templateUrl: "sms-temps/sms/sms-curency-quote.html"
                        },
                        "pricelist@buy": {
                            templateUrl: "sms-temps/sms/sms-price-list.html",
                            controller: "smsPriceCtrl"
                        },
                        "buyform@buy": {
                            templateUrl: "sms-temps/sms/sms-buy-form.html",
                            controller: "smsBuyCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule([
                                "smsBuyCtrl",
                                "smsPriceCtrl"
                            ]);
                        },
                        result: function (smsService) {
                            return smsService.getData("buy");
                        },
                        prices: function (smsService) {
                            return smsService.getData("prices");
                        }
                    },
                    title: "Buy SMS",
                    auth: true,
                    redTo: "prices",
                    description: ""
                })
                .state("mtd", {
                    parent: "root",
                    url: "payment-methods.html",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/sms/payments-methods.html",
                            controller: function ($scope, contacts) {
                                $scope.helplines = contacts.contacts;
                            }
                        }
                    },
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    resolve: {
                        contacts: function (httpService) {
                            return httpService.getData(
                                "/api/main/contacts" /*,true*/
                            );
                        }
                    },
                    title: "Payment Methods",
                    description: "view payment methods that are supported at linsms, our payment methods include mobile money, mtn and airtel and cash, and more will be added"
                })
                .state("pay", {
                    parent: "my_pay",
                    url: "recent-payments.html",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/sms/payments.html",
                            controller: "smsPayCtrl"
                        }
                    },
                    title: "Recent Payments",
                    auth: true,
                    redTo: "home",
                    description: "linsms lets you view your recent payment, this helps to keep track of your payment status and usage",
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["smsPayCtrl"]);
                        },
                        payments: function (smsService) {
                            return smsService.getData("payments");
                        }
                    }
                })
                .state("phonebook", {
                    parent: "root",
                    abstract: true,
                    url: "phone-book"
                })
                .state("phonebook.all", {
                    url: ".html",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/sms/sms-phone-book.html",
                            controller: "smsPhoneCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["smsPhoneCtrl"]);
                        },
                        groups: function (smsService) {
                            return smsService.getData("phonebook");
                        }
                    },
                    title: "Phone book",
                    auth: true,
                    redTo: "home",
                    description: "at linsms you can create phonebook lists that contain phone number and send sms to those lists at any time, our merge feature help you merge multiple phonebook groups and repeated numbers are filtered"
                })
                .state("phonebook.single", {
                    url: "/{id}",
                    title: "Phone book",
                    auth: true,
                    redTo: "home",
                    description: "easily add phone number to your phonebook lists at linsms, you can upload csv or text files containin numbers or type in comma seperated numbers in the text field",
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/sms/phone-book-single.html",
                            controller: "phonesingleCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["phonesingleCtrl"]);
                        },
                        group: function (smsService, $stateParams) {
                            return smsService.getData(
                                "phonebook-single/" + $stateParams.id
                            );
                        }
                    }
                })
                .state("me2u", {
                    parent: "my_pay",
                    url: "me2u.html",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/sms/m2u.html",
                            controller: "smsMe2UCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["smsMe2UCtrl"]);
                        }
                    },
                    title: "Recent Payments",
                    auth: true,
                    redTo: "home",
                    description: "linsms enables our clients to share sms unit when they are out of sms credits and don't have access to our supported payment platforms"
                })
                .state("settings", {
                    parent: "account",
                    url: "settings.html",
                    title: "Settings",
                    auth: true,
                    redTo: "login",
                    description: "change your account preferences and other settings with easy at linsms. at linsms we aim at providing an easy to use web interface with a rich navigation system"
                })
                //auth
                .state("login", {
                    parent: "root",
                    url: "login.html",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    views: {
                        "body@root": {
                            templateUrl: tempsForms + "login.html",
                            controller: "loginCtrl"
                        }
                    },
                    title: "Login",
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["loginCtrl"]);
                        }
                    },
                    isAuth: true,
                    redTo: "send",
                    description: "login to linsms account and start sending bulksms for meetings, seminars, church services, weding meeting and brand release"
                })
                .state("register", {
                    parent: "root",
                    url: "register.html",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    views: {
                        "body@root": {
                            templateUrl: tempsForms + "register.html",
                            controller: "registerCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["registerCtrl"]);
                        }
                    },
                    title: "Register",
                    isAuth: true,
                    redTo: "account.profile",
                    description: "create an account with linsms to starts using our first class services such bulksms, sms gateway integration,money transfer, online payment, phonebook lists"
                })
                .state("passrec", {
                    parent: "root",
                    url: "recover-password.html",
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    views: {
                        "body@root": {
                            templateUrl: tempsForms + "pass-rec.html",
                            controller: "recPassCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["recPassCtrl"]);
                        }
                    },
                    title: "Recover Password",
                    isAuth: true,
                    redTo: "send",
                    description: "at linsms recovering your user password is breaze, easily recover your password in seconds"
                })
                .state("acountverification", {
                    parent: 'root',
                    url: 'verification-code/:code',
                    title: 'Verifiction Form',
                    params: {
                        code: {
                            value: null,
                            squash: true
                        }
                    },
                    views: {
                        'body@root': {
                            templateUrl: tempsForms + 'verification-code.html',
                            controller: 'verifictionCtrl'
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(['verifictionCtrl']);
                        }
                    }
                })
                .state("confirmreg", {
                    parent: "root",
                    url: "confirm-registration/{id}",
                    title: "Account Activation"
                })
                //success messages
                .state("success", {
                    parent: "root",
                    url: "success/",
                    abstract: true
                })
                .state("success.pass", {
                    url: "recover-password",
                    title: "Success",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/success/recover.html"
                        }
                    },
                    isAuth: true,
                    redTo: "account.profile",
                })
                .state("success.register", {
                    url: "register",
                    title: "Success",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/success/register.html"
                        }
                    },
                    isAuth: true,
                    redTo: "account.profile",
                })
                .state("success.activation", {
                    url: "activation",
                    title: "Success",
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/success/register.html"
                        }
                    },
                    isAuth: true,
                    redTo: "account.profile",
                })
                //account
                .state("account", {
                    parent: "root",
                    abstract: true,
                    views: {
                        "body@root": {
                            templateUrl: "sms-temps/account/main.html"
                        }
                    }
                })
                .state("account.profile", {
                    url: "profile.html",
                    views: {
                        "body@account": {
                            templateUrl: "sms-temps/account/profile.html",
                            controller: "AccHomeCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["AccHomeCtrl"]);
                        },
                        accUser: function (accService) {
                            return accService.getData();
                        }
                    },
                    title: "My Profile",
                    auth: true,
                    redTo: "login",
                })
                .state("account.edit", {
                    url: "edit-profile.html",
                    views: {
                        "body@account": {
                            templateUrl: "/sms-temps/account/profile-edit.html",
                            controller: "AccHomeCtrl"
                        }
                    },
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["AccHomeCtrl"]);
                        },
                        accUser: function (accService) {
                            return accService.getData("edit-data");
                        }
                    },
                    title: "Edit Profile",
                    auth: true,
                    redTo: "login",
                })
                .state("admin", {
                    parent: "root",
                    url: "administration",
                    abstract: true,
                    views: {
                        "body@root": {
                            templateUrl: "/sms-temps/admin/main.html",
                            controller: function ($scope, navToggleService) {
                                $scope.showAdminSide = false;
                                $scope.toggleadminSide = () => {
                                    navToggleService.toggleVisible("adminnav");
                                };
                                navToggleService.setNamedHook(
                                    "admin",
                                    function () {
                                        $scope.showAdminSide = navToggleService.isVisibleNav(
                                            "adminnav"
                                        );
                                    }
                                );
                                $scope.$on("$destroy", () => {
                                    navToggleService.unsetHook("admin");
                                });
                            }
                        },
                        "adminhead@admin": {
                            templateUrl: "/sms-temps/admin/admin-head.html"
                        },
                        "adminnav@admin": {
                            templateUrl: "/sms-temps/admin/nav.html"
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
                //users
                .state("a_users", {
                    url: "/users",
                    parent: "admin",
                    abstract: true
                })
                .state("a_users.all", {
                    url: "",
                    auth: true,
                    views: {
                        "admin@admin": {
                            templateUrl: "/sms-temps/admin/users/users-list.html",
                            controller: "a_usersCtrl"
                        }
                    },
                    admin: true,
                    isSuper: true,
                    title: "User Acounts",
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["a_usersCtrl"]);
                        },
                        users: function (adminService) {
                            return adminService.getData("users");
                        }
                    }
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
                })
                .state("a_views.all", {
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
                //developer
                .state("developer", {
                    url: "developer",
                    parent: "root",
                    abstract: true,
                    views: {
                        'body@root': {
                            templateUrl: '/sms-temps/developer/',
                            controller: function ($scope, navToggleService) {
                                $scope.isdev = false;
                                $scope.toggleDev = function () {
                                    navToggleService.toggleVisible('dev');
                                };
                                navToggleService.setHook(function () {
                                    $scope.isdev = navToggleService.isVisibleNav(
                                        "dev"
                                    );
                                });
                            }
                        }
                    }
                })
                .state('dev', {
                    parent: 'developer',
                    title: 'Developer',
                    description: "at linsms we help developers to easily integrate their systems with our open api, our api gives you access to our sms getway, online payment system, funds tranfers and sandbox testing",
                    url: '',
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/home.html',
                            controller: function ($scope, devService) {
                                $scope.openConsole = function () {
                                    devService.gotoConsole();
                                };
                            }
                        },
                        'nav@developer': {
                            templateUrl: ' /sms-temps/developer/nav.html',
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
                            templateUrl: '/sms-temps/developer/console/'
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
                            controller: function ($scope, devService) {
                                $scope.app_id = '';

                                function getId() {
                                    $scope.app_id = devService.getAppId();
                                }
                                getId();
                            }
                        }
                    },
                    resolve: {
                        //     loadit: function (lazyLoader) {
                        //         return lazyLoader.loadModule(['myappCtrl']);
                        //     },
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
                .state('tutorials', {
                    parent: 'developer',
                    title: 'Developer',
                    url: '/docs',
                    abstract: true,
                    views: {
                        'nav@developer': {
                            templateUrl: '/sms-temps/developer/tutorials/nav.html'
                        }
                    }
                })
                .state('tutorials.home', {
                    url: '',
                    title: 'Docs',
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/tutorials/',
                            controller: function ($scope) {
                                $scope.secret = "jkhjhjyrterdfghfghjkhkkjkjijkjkjkjkljklkjljkjkljl";
                                $scope.client_id = "ghjkkhuyttdrefgyghhguuhujhj";
                                $scope.show_client = false;
                                $scope.show_secret = false;
                                $scope.showClient = () => {
                                    $scope.show_client = !$scope.show_client;
                                };

                                $scope.showSecret = () => {
                                    $scope.show_secret = !$scope.show_secret;
                                };
                            }
                        }
                    },
                })
                .state('tutorials.cat', {
                    url: '/{category}',
                    title: 'Docs',
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/tutorials/'
                        }
                    },
                })
                .state('tutorials.page', {
                    url: '/{category}/{tut}',
                    title: 'Docs',
                    craw_me: true,
                    craw_priority: 0.9,
                    craw_ref: 'weekly',
                    views: {
                        'body@developer': {
                            templateUrl: '/sms-temps/developer/tutorials/'
                        }
                    },
                })
                .state('websockets', {
                    parent: 'root',
                    url: 'websockets',
                    title: 'WebSockets Dashboard',
                    views: {
                        'body@root': {
                            templateUrl: '/sms-temps/websockets/'
                        }
                    }
                });
        }
    ]);
});
