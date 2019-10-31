define(["app"], function (app) {
    app.service("popService", [
        "$uibModal",
        "$document",
        "$q",
        "lazyLoader",
        "smsService",
        function ($uibModal, $document, $q, lazyLoader, smsService) {
            let modalTemps = "/sms-temps/modals/";
            let mymodel = (template, ctrl, size = "md") => {
                let d = $q.defer();
                let modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: "modal-title",
                    ariaDescribedBy: "modal-body",
                    templateUrl: modalTemps + template,
                    controller: ctrl[0],
                    controllerAs: "$ctrl",
                    resolve: {
                        loadit: lazyLoader => {
                            return lazyLoader.loadModule(ctrl);
                        }
                    },
                    size: size,
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
            let buyMore = () => {
                let d = $q.defer();
                let modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: "modal-title",
                    ariaDescribedBy: "modal-body",
                    templateUrl: modalTemps + "buy-modal.html",
                    controller: "buyMdl",
                    controllerAs: "$ctrl",
                    resolve: {
                        loadit: lazyLoader => {
                            return lazyLoader.loadModule(["buyMdl"]);
                        },
                        result: smsService => {
                            return smsService.getData("buy");
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
            let openPhone = () => {
                let d = $q.defer();
                let modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: "modal-title",
                    ariaDescribedBy: "modal-body",
                    templateUrl: modalTemps + "phone-book.html",
                    controller: "phoneBookMdl",
                    controllerAs: "$ctrl",
                    resolve: {
                        loadit: lazyLoader => {
                            return lazyLoader.loadModule(["phoneBookMdl"]);
                        },
                        groups: smsService => {
                            return smsService.getData("phonebook");
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
            let openSent = () => {
                let d = $q.defer();
                let modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: "modal-title",
                    ariaDescribedBy: "modal-body",
                    templateUrl: modalTemps + "phone-book.html",
                    controller: "phoneBookMdl",
                    controllerAs: "$ctrl",
                    resolve: {
                        loadit: lazyLoader => {
                            return lazyLoader.loadModule(["phoneBookMdl"]);
                        },
                        groups: () => {
                            return {
                                groups: []
                            };
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
            let openUpload = () => {
                let d = $q.defer();
                mymodel("contacts-upload.html", ["contactsMdl"]).then(
                    r => {
                        d.resolve(r);
                    },
                    e => {
                        d.reject(e);
                    }
                );

                return d.promise;
            };
            let confirmSend = (msg, cal) => {
                let d = $q.defer();
                let modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: "modal-title",
                    ariaDescribedBy: "modal-body",
                    templateUrl: modalTemps + "confirm-send.html",
                    controller: "confirmSendMdl",
                    controllerAs: "$ctrl",
                    resolve: {
                        loadit: lazyLoader => {
                            return lazyLoader.loadModule(["confirmSendMdl"]);
                        },
                        msg: msg,
                        cal: cal,
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
            let rightsForm = () => {
                mymodel("rights-form.html", ["rightsMdl"]).then(
                    r => {},
                    e => {}
                );
            };
            return {
                confirmSend: confirmSend,
                openPhone: openPhone,
                openSent: openSent,
                openUpload: openUpload,
                rightsForm: rightsForm,
                buyMore: buyMore,
                mymodel: mymodel
            };
        }
    ]);
    app.service("smsService", function ($q, user, httpService, $log) {
        let smsUrl = "/api/sms/";

        function getData(link, data = false) {
            let d = $q.defer();
            let promise;
            if (!!data) {
                promise = httpService.postData(smsUrl + link, data);
            } else {
                promise = httpService.getData(smsUrl + link);
            }
            promise.then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        }

        function valSms(link, data) {
            let d = $q.defer();
            getData("val/" + link, data).then(
                r => {
                    d.resolve(r);
                },
                e => {
                    e.reject(e);
                }
            );
            return d.promise;
        }

        function getParams(params) {
            let d = $q.defer();
            if (params.id.length) {
                let data =
                    "submit=" +
                    new Date().getTime() +
                    "&action=" +
                    params.action;
                angular.forEach(params.id, function (id, index) {
                    data += "&id[" + index + "]=" + id;
                });
                valSms("calc", data).then(
                    r => {
                        d.resolve(r);
                    },
                    e => {
                        d.reject(e);
                    }
                );
            } else {
                d.resolve({});
            }

            return d.promise;
        }
        return {
            getData: getData,
            valSms: valSms,
            getParams: getParams
        };
    });
    app.service("authService", function ($q, user, httpService) {
        let self = this;
        self.api_uri = "/api/";
        let resetUser = () => {
            return $q.when({
                username: "",
                password: ""
            });
        };
        let resetregUser = () => {
            return $q.when({
                fullname: "",
                email: "",
                phone: "",
                username: "",
                gender: "",
                password: "",
                password1: "",
                terms: 0
            });
        };
        let login = auth_user => {
            let d = $q.defer();
            let data =
                "submit=" +
                new Date().getTime() +
                "&username=" +
                auth_user.username +
                "&password=" +
                auth_user.password;
            httpService.postData(self.api_uri + "login", data).then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        let logout = () => {
            httpService
                .postData(
                    self.api_uri + "logout",
                    "submit=" + new Date().getTime()
                )
                .then(
                    r => {
                        if (r.success_flag === 1) {
                            user.resetAuth();
                        }
                    },
                    e => {}
                );
        };
        let register = reg_user => {
            let d = $q.defer();
            let data =
                "submit=" +
                new Date().getTime() +
                "&fullname=" +
                reg_user.fullname +
                "&email=" +
                reg_user.email +
                "&phone=" +
                reg_user.phone +
                "&username=" +
                reg_user.username +
                "&gender=" +
                reg_user.gender +
                "&terms=" +
                reg_user.terms +
                "&password=" +
                reg_user.password +
                "&password_confirmation=" +
                reg_user.password1;
            httpService.postData(self.api_uri + "register", data).then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        let recover = pass_user => {
            let d = $q.defer();
            let data =
                "submit=" +
                new Date().getTime() +
                "&username=" +
                pass_user.username;
            httpService.postData(self.api_uri + "password/email", data).then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        let requestRights = token => {
            let d = $q.defer();
            let data = "submit=" + new Date().getTime() + "&token=" + token;
            httpService.postData(self.api_uri + "rights", data).then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        return {
            requestRights: requestRights,
            resetUser: resetUser,
            resetregUser: resetregUser,
            login: login,
            register: register,
            recover: recover,
            logout: logout
        };
    });
    app.service("sessionChecker", function (
        user,
        $log,
        $timeout,
        $interval,
        tokenService,
        httpService
    ) {
        var self = this;
        self.source = null;
        self.link = "/api/sesscheck";
        self.timer;
        let checkToken = () => {};
        let startTimer = () => {
            tokenService.getAcessToken().then(
                token => {
                    if (!token) {
                        if (angular.isDefined(self.timer)) {
                            $interval.cancel(self.timer);
                            self.timer = undefined;
                        }
                        return;
                    }
                },
                () => {
                    if (angular.isDefined(self.timer)) {
                        $interval.cancel(self.timer);
                        self.timer = undefined;
                    }
                    return;
                }
            );
            self.timer = $interval(function () {
                tokenService.getAcessToken().then(
                    token => {
                        if (!token) {
                            if (angular.isDefined(self.timer)) {
                                $interval.cancel(self.timer);
                                self.timer = undefined;
                            }
                            return;
                        }
                        httpService
                            .getData("/api/checklogin")
                            .then(
                                r => {
                                    if (r.user) {
                                        user.setUser(r.user);
                                    } else {
                                        $interval.cancel(self.timer);
                                        self.timer = undefined;
                                    }
                                },
                                e => {
                                    tokenService.getAcessToken().then(
                                        token => {
                                            if (!token) {
                                                if (
                                                    angular.isDefined(
                                                        self.timer
                                                    )
                                                ) {
                                                    $interval.cancel(
                                                        self.timer
                                                    );
                                                    self.timer = undefined;
                                                }
                                            }
                                        },
                                        e => {
                                            if (angular.isDefined(self.timer)) {
                                                $interval.cancel(self.timer);
                                                self.timer = undefined;
                                            }
                                            return;
                                        }
                                    );
                                }
                            )
                            .catch(e => {
                                if (angular.isDefined(self.timer)) {
                                    $interval.cancel(self.timer);
                                    self.timer = undefined;
                                }
                                return;
                            });
                    },
                    e => {
                        if (angular.isDefined(self.timer)) {
                            $interval.cancel(self.timer);
                            self.timer = undefined;
                        }
                        return;
                    }
                );
            }, 1500 * 10);
        };
        let init = () => {
            close();
            let sLink = self.link;
            tokenService.getAcessToken().then(token => {
                if (!token) {
                    return;
                }
                sLink += "?token=" + token;
                self.source = new EventSource(sLink);
                self.source.addEventListener("message", e => {
                    let data = JSON.parse(e.data);
                    if (data.isUser) {
                        user.setUser(data);
                    }
                });
                self.source.addEventListener("open", e => {
                    // $log.info("SeverMessage open", e);
                });
                self.source.addEventListener(
                    "loggedon",
                    e => {
                        user.setUser(JSON.parse(e.data));
                    },
                    false
                );
                self.source.addEventListener(
                    "tokenstatus",
                    e => {
                        let data = JSON.parse(e.data);
                        if (data.accessStatus) {
                            user.resetAuth();
                        }
                        if (data.accessToken) {
                            tokenService.setaccessToken(data.accessToken);
                        }
                    },
                    false
                );
                self.source.addEventListener("error", e => {
                    e = e || event;
                    switch (e.target.readyState) {
                        case EventSource.CONNECTING:
                            // reconnecting(e);
                            break;
                        case EventSource.CLOSED:
                            // onclose(e);
                            break;
                    }
                });
            });
        };

        let close = e => {
            if (null === self.source) {
                return;
            }
            self.source.close();
            self.source = null;
        };
        let checkSource = () => {};
        tokenService.setTokenHook("sessionChecker", init);
        $timeout(init, 400);
        return {
            init: init,
            startTimer: startTimer
        };
    });
    app.service("devService", function ($state, user, popService, alertService, httpService, $q) {
        let self = this;
        self.appId = '';
        self.api_uri = "/developers/";
        let gotoConsole = function () {
            if (user.isLoggedIn()) {
                $state.go("console.home");
            } else {
                popService.mymodel("login-modal.html", ["loginMdl"]).then(
                    r => {
                        $state.go("console.home");
                    },
                    e => {
                        alertService.setAlert({
                            type: "danger",
                            msg: "Login required"
                        });
                    }
                );
            }
        };
        let getData = (link, data = false) => {
            let d = $q.defer();
            let promise;
            if (!!data) {
                promise = httpService.postData(self.api_uri + link, data);
            } else {
                promise = httpService.getData(self.api_uri + link);
            }
            promise.then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        let getConsole = (link, data = false) => {
            let d = $q.defer();
            getData('console/' + link, data).then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        let getApp = (link = "", data) => {
            let d = $q.defer();
            getConsole('my-app/' + self.appId + link, data).then(r => {
                d.resolve(r);
            }, e => {
                d.reject(e);
            });
            return d.promise;
        };
        let editApp = (link = "", data) => {
            let d = $q.defer();
            getConsole('edit-app' + link, data).then(r => {
                d.resolve(r);
            }, e => {
                d.reject(e);
            });
            return d.promise;
        };
        let setAppId = (id) => {
            self.appId = id;
            return id;
        };
        let getAppId = () => {
            return self.appId;
        };
        return {
            editApp: editApp,
            setAppId: setAppId,
            gotoConsole: gotoConsole,
            getData: getData,
            getConsole: getConsole,
            getApp: getApp,
            getAppId: getAppId
        };
    });
    app.service("adminService", function (
        user,
        httpService,
        alertService,
        $log,
        $q
    ) {
        let self = this;
        self.api_uri = "/api/administration/";
        let getData = (link, data = false) => {
            let d = $q.defer();
            let promise;
            if (!!data) {
                promise = httpService.postData(self.api_uri + link, data);
            } else {
                promise = httpService.getData(self.api_uri + link);
            }
            promise.then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        let adminVal = (link, data) => {
            let d = $q.defer();
            getData("val/" + link, data).then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        return {
            getData: getData,
            adminVal: adminVal
        };
    });
    app.service("accService", function ($q, httpService) {
        let self = this;
        self.baseUrl = "/api/profile";
        let getData = (link = "", data = false) => {
            let d = $q.defer();
            if (link != "") {
                link = "/" + link;
            }
            let promise;
            if (!!data) {
                promise = httpService.postData(self.baseUrl + link, data);
            } else {
                promise = httpService.getData(self.baseUrl + link);
            }
            promise.then(
                r => {
                    d.resolve(r);
                },
                e => {
                    d.reject(e);
                }
            );
            return d.promise;
        };
        return {
            getData: getData
        };
    });
    // app;
});
