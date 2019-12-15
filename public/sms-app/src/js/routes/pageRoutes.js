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
                            controller: 'rootCtrl'
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
                    },
                    resolve: {
                        loadit: lazyLoader => {
                            return lazyLoader.loadModule(['rootCtrl']);
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
                .state('services', {
                    parent: 'root',
                    url: 'services.html',
                    title: 'Our Services',
                    craw_me: true,
                    views: {
                        'body@root': {
                            templateUrl: '/sms-temps/page/services.html'
                        }
                    }
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
