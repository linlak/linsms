(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular', 'idb'], factory);
    } else if (typeof exports === 'object') {
        factory(require('angular', 'idb'));
        module.exports = 'ngServices';
    } else {
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';
    angular = (angular && angular.module) ? angular : window.angular;
    return angular.module('ngServices', ['toaster', 'pusher-angular'])
        .provider('$linstore', function () {
            var storageKey = "lin_store";
            var web_title = '';
            var idbVersion = 1;
            return ({
                setStorageKey: function (key) {
                    storageKey = key;
                },
                setTitileExt: function (title) {
                    web_title = title;
                },
                setDbVer: function (dbversion) {
                    idbVersion = dbversion;
                },
                $get: function ($q, $window) {
                    return ({
                        storageKey: storageKey,
                        web_title: web_title,
                        idbVersion: idbVersion
                    })
                }
            });
        })

        .service('hookRunner', ['$exceptionHandler', '$rootScope', function ($exceptionHandler, $rootScope) {
            this.exec = (hooks) => {
                angular.forEach(hooks, function (hook) {
                    try {
                        hook();
                        // $rootScope.$$apply();
                    } catch (hookRunnerErr) {
                        $exceptionHandler(hookRunnerErr);
                    }

                });
            };
        }])
        .factory('fileReader', function ($q, $log) {
            let onLoad = (reader, deferred, scope) => {
                return () => {
                    scope.$apply(() => {
                        deferred.resolve(reader.result);
                    });
                };
            };
            let onError = (reader, deferred, scope) => {
                return () => {
                    scope.$apply(() => {
                        deferred.reject(reader.result);
                    });
                };
            };
            let onProgress = (reader, scope) => {
                return (event) => {
                    scope.$broadcast('fileProgress', {
                        total: event.total,
                        loaded: event.loaded
                    });
                };
            };
            let getReader = (deferred, scope) => {
                let reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, scope);
                return reader;
            };
            let readAsDataURL = (file, scope) => {
                let deferred = $q.defer();
                let reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };
            return {
                readAsDataURL: readAsDataURL
            };
        }).service('tokenService', function ($q, hookRunner, idbService, $log, alertService) {
            let self = this;
            self.tokenKey = 'accessTocken';
            self.tokenHooks = {};
            let getAcessToken = () => {
                let d = $q.defer();
                idbService.store.objStore('curuser', 'readonly').then(st => {
                    st.get(self.tokenKey).then(r => {
                        if (angular.isDefined(r.accessTocken) && !!r.accessTocken) {
                            d.resolve(r.accessTocken);
                        } else {
                            d.resolve(false);
                        }
                        st.complete;
                    }).catch(e => {
                        d.resolve(false);
                    });
                })
                return d.promise;
            };
            let setTokenHook = (tagName, hook) => {
                self.tokenHooks[tagName] = angular.copy(hook);
            };
            let unsetTokenHook = (tagName) => {
                delete(self.tokenHooks[tagName]);
            };
            let setaccessToken = (accessTocken) => {
                idbService.store.objStore('curuser', 'readwrite').then(st => {
                    st.put({
                        id: self.tokenKey,
                        accessTocken: accessTocken
                    }).then(() => {
                        // syncService.notifyupdate('login_change');
                    });
                    st.complete;
                });
                hookRunner.exec(self.tokenHooks);
            };
            let unsetAccessToken = () => {
                idbService.store.objStore('curuser', 'readwrite').then(st => {
                    st.clear().then(r => {
                        hookRunner.exec(self.tokenHooks);
                    });
                    st.complete;
                });
            };
            return ({
                getAcessToken: getAcessToken,
                setTokenHook: setTokenHook,
                unsetTokenHook: unsetTokenHook,
                setaccessToken: setaccessToken,
                unsetAccessToken: unsetAccessToken
            });
        }).factory('idbService', function ($log, $linstore) {
            let store = {
                db: null,
                exists: function (Db, objectStore) {
                    return Db.objectStoreNames.contains(objectStore);
                },
                ifNotExists: function (Db, objectStore, options) {
                    if (!store.exists(Db, objectStore)) {
                        Db.createObjectStore(objectStore, options);
                    }
                },
                init: function () {
                    if (store.db) {
                        return Promise.resolve(store.db);
                    }
                    return idb.open($linstore.storageKey, $linstore.idbVersion, function (upgradeDb) {
                        store.ifNotExists(upgradeDb, 'cart', {
                            keyPath: 'id'
                        });
                        store.ifNotExists(upgradeDb, 'payments', {
                            keyPath: 'id'
                        });
                        store.ifNotExists(upgradeDb, 'favorites', {
                            keyPath: 'id'
                        });
                        store.ifNotExists(upgradeDb, 'curuser', {
                            keyPath: 'id'
                        });
                    }).then(function (db) {
                        return store.db = db;
                    });
                },

                objStore: function (storeName, mode) {
                    return store.init().then(function (db) {
                        return db.transaction(storeName, mode).objectStore(storeName);
                    })
                }
            };
            return ({
                store: store
            });
        })
        .service('httpService', ['$http', '$q', '$log', 'alertService', function ($http, $q, $log, alertService) {

            let postData = (url, data) => {
                let defer = $q.defer();
                $http({
                    url: url,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: data
                }).then((r) => {
                    if (r.data) {
                        defer.resolve(r.data);
                    } else {
                        defer.reject('error');
                    }

                }, (error) => {
                    alertService.setToast({
                        status: 'error',
                        msg: 'Network Error'
                    });
                    defer.reject('error');
                });
                return defer.promise;
            };
            let getData = (url, cachedata) => {
                let defer = $q.defer();
                cachedata = (!!cachedata) ? cachedata : false;
                $http({
                    url: url,
                    method: 'GET',
                    cache: cachedata
                }).then((r) => {
                    if (r.data) {
                        defer.resolve(r.data);
                    } else {
                        defer.reject('error');
                    }

                }, (data, status, headers, config) => {
                    defer.reject('error');
                });
                return defer.promise;
            };
            let uploadData = (url, data) => {
                let defer = $q.defer();
                $http({
                    url: url,
                    method: 'POST',
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Process-Data': false
                    },
                    data: data
                }).then((r, status) => {
                    if (r.data) {
                        defer.resolve(r.data);
                    } else {
                        defer.reject('error');
                    }

                }, (error, status, config, headers) => {
                    alertService.setToast({
                        status: 'error',
                        msg: 'Network Error'
                    });
                    defer.reject('error');
                });
                return defer.promise;
            };
            return ({
                postData: postData,
                getData: getData,
                uploadData: uploadData
            });
        }])
        .service('pusherService', ['$pusher', '$log', function ($pusher, $log) {
            let self = this;
            self.client;
            self.pusherKey = '';
            let token = document.head.querySelector('meta[name="csrf-token"]');

            self.options = {
                authOptions: {
                    headers: {
                        'X-CSRF-Token': token.content
                    },
                }
            };
            let setKey = (key) => {
                self.pusherKey = key;
            };
            let setOptions = (key, value) => {
                self.options[key] = angular.copy(value);
            };
            let get = (init = false) => {
                if (!init) {
                    if (angular.isDefined(self.client)) {
                        return $pusher(self.client);
                    }
                }

                self.client = new Pusher(self.pusherKey, self.options);
                return $pusher(self.client);
            };
            let refClient = () => {
                return get(true);
            };
            let privateChannel = (channelName, leave = false) => {
                if (!!leave) {
                    return get().unsubscribe('private-' + channelName);
                }
                return get().subscribe('private-' + channelName);
            };
            let presenceChannel = (channelName, leave = false) => {
                if (!!leave) {
                    return get().unsubscribe('presence-' + channelName);
                }
                return get().subscribe('presence-' + channelName);
            };
            let channel = (channelName, leave = false) => {
                if (!!leave) {
                    return get().unsubscribe(channelName);
                }
                return get().subscribe(channelName);
            };
            return {
                setKey: setKey,
                setOptions: setOptions,
                get: get,
                refClient: refClient,
                privateChannel: privateChannel,
                presenceChannel: presenceChannel,
                channel: channel,
            };
        }])
        .service('storage', ['$exceptionHandler', '$window', '$linstore', function ($exceptionHandler, $window, $linstore) {
            var items = loadData();
            var persistHooks = [];
            var persistEnabled = true;
            $window.addEventListener("beforeunload", persistData);
            return ({
                clear: clear,
                disablePersist: disablePersist,
                enablePersist: enablePersist,
                extractItem: extractItem,
                getItem: getItem,
                onBeforePersist: onBeforePersist,
                removeItem: removeItem,
                setItem: setItem
            });

            function clear() {
                items = {};
            }

            function disablePersist() {
                persistEnabled = false;
            }

            function enablePersist() {
                persistEnabled = true;
            }

            function extractItem(key) {
                var value = getItem(key);
                removeItem(key);
                return (value);
            }

            function getItem(key) {
                key = normalizeKey(key);
                return ((key in items) ? angular.copy(items[key]) : null);
            }

            function onBeforePersist(operator) {
                persistHooks.push(operator);
            }

            function removeItem(key) {
                key = normalizeKey(key);
                delete(items[key]);
            }

            function setItem(key, value) {
                key = normalizeKey(key);
                items[key] = angular.copy(value);
            }

            function loadData() {
                try {
                    if ($linstore.storageKey in $window.sessionStorage) {

                        var data = $window.sessionStorage.getItem($linstore.storageKey);
                        $window.sessionStorage.removeItem($linstore.storageKey);
                        return (angular.extend({}, angular.fromJson(data)));

                    }
                } catch (sessionStorageError) {
                    $exceptionHandler(sessionStorageError);
                }
                return ({});
            }

            function normalizeKey(key) {
                return ("storage_" + key);
            }

            function persistData() {
                for (var i = 0, length = persistHooks.length; i < length; i++) {
                    try {
                        persistHooks[i]();
                    } catch (persistHookError) {
                        $exceptionHandler(persistHookError);
                    }
                }
                if (!persistEnabled) {
                    return;
                }
                try {
                    $window.sessionStorage.setItem($linstore.storageKey, angular.toJson(items));
                } catch (sessionStorageError) {
                    $exceptionHandler(sessionStorageError);
                }
            }

        }])
        .directive('shareMe', function (pageService) {
            return ({
                restrict: 'A',
                replace: true,
                transclude: true,
                scope: {
                    shareTitle: '@',
                    shareLink: '@',
                    shareMessage: '@'
                },
                link: function (scope, elem, atrrs) {
                    scope.share = function () {
                        pageService.sharePage(scope.shareTitle, scope.shareMessage, scope.shareLink);
                    };
                },
                template: `<span class="btn btn-sm btn-default share-me" ng-click="share()"><span
			            class="fa fa-share fa-sm"></span> share</span>`
            });
        })
        .service('pageService', function ($window, hookRunner, alertService, $q) {

            let self = this;

            self.redirect = false;

            self.redirectHooks = {};

            let getImg = () => {
                return '/images/holders/no_image.svg';
            };

            let getPic = () => {
                return '/images/holders/no_pic.jpg';
            };

            let getLogo = () => {
                return '/images/holders/no_logo.png';
            };

            let scroll = () => {
                $('html,body').animate({
                    scrollTop: 0
                }, 500);
            };

            let isRedirect = () => {
                return self.redirect;
            };

            let setHook = (key, hook) => {
                self.redirectHooks[key] = angular.copy(hook);
            };

            let unsetHook = (key) => {
                if (key in self.redirectHooks) {
                    delete self.redirectHooks[key];
                }
            };

            let enRedirect = () => {
                self.redirect = true;
                hookRunner.exec(self.redirectHooks);
            };

            let disRedirect = () => {
                self.redirect = false;
                hookRunner.exec(self.redirectHooks);
            };

            let sharePage = (title, text, url) => {
                if (navigator.share) {
                    navigator.share({
                            title: title,
                            text: text,
                            url: url
                        }).then(() => {
                            alertService.setToast({
                                type: 'success',
                                msg: 'Shared successfully'
                            });
                        })
                        .catch(() => {
                            alertService.setToast({
                                type: 'error',
                                msg: 'Error sharing'
                            });
                        });
                } else {
                    alertService.setToast({
                        type: 'danger',
                        msg: 'Share api not supported by your browser'
                    });
                }

            };
            let readClipBoard = function () {
                let d = $q.defer();
                navigator.clipboard.readText().then(clipText => {
                    d.resolve(clipText);
                });
                return d.promise;
            };
            let copyClipboard = function (text) {
                navigator.permissions.query({
                    name: 'clipboard-write'
                }).then(result => {
                    if (result.state == 'granted' || result.state == 'prompt') {
                        navigator.clipboard.writeText(text).then(() => {
                            alertService.setToast({
                                type: 'success',
                                msg: 'Item copied to clipboard'
                            });
                        }, () => {
                            alertService.setToast({
                                type: 'success',
                                msg: 'Error copying to clipboard'
                            });
                        });
                    } else {
                        alertService.setToast({
                            type: 'error',
                            msg: 'You need permission to write to clipboard'
                        });
                    }
                })
            };
            return ({
                readClipBoard: readClipBoard,
                copyClipboard: copyClipboard,
                sharePage: sharePage,
                isRedirect: isRedirect,
                setHook: setHook,
                unsetHook: unsetHook,
                enRedirect: enRedirect,
                disRedirect: disRedirect,
                scroll: scroll,
                getImg: getImg,
                getPic: getPic,
                getLogo: getLogo
            });

        }).factory('httpInterceptor', ['$log', 'alertService', 'tokenService', '$q', 'pusherService', function ($log, alertService, tokenService, $q, pusherService) {

            let request = (config) => {
                config.requestTimeStamp = (new Date()).getTime();
                let socketId = pusherService.get().client.connection.socket_id;
                if (angular.isDefined(socketId)) {
                    config.headers['X-Socket-ID'] = socketId;
                }
                let token = document.head.querySelector('meta[name="csrf-token"]');

                if (token) {
                    config.headers['X-CSRF-TOKEN'] = token.content;
                }
                return tokenService.getAcessToken().then(token => {
                    if (false !== token) {
                        return config.headers['Authorization'] = 'Bearer ' + token;
                    }
                }).then(() => {
                    return config;
                });

                return config;
            }
            let response = (response) => {
                response.config.responseTimeStamp = (new Date()).getTime();
                var headers = response.headers();
                if (angular.isDefined(headers['content-disposition'])) {
                    var contentType = headers['content-types'];
                    var disposition = headers['content-disposition'];
                    var arrStr = disposition.split('=');
                    var filename = arrStr[1];
                    var linkElement = document.createElement('a');
                    // var filename=
                    var data = response.data;
                    try {
                        var blob = new Blob([data], {
                            type: contentType
                        });
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute('download', filename.replace(/"/g, ''));
                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);
                    } catch (error) {
                        alertService.setToast({
                            msg: 'Error parsing download file',
                            type: 'danger'
                        });
                    }

                }
                if (response.data.accessToken) {
                    tokenService.setaccessToken(response.data.accessToken.accessToken);
                    delete(response.data.accessToken);
                }
                if (response.data.accessStatus) {
                    tokenService.unsetAccessToken();
                    delete(response.data.accessStatus);
                }
                if (response.data.msg) {
                    alertService.setAlert(response.data.msg);
                    delete(response.data.msg);
                }
                if (response.data.toast) {
                    alertService.setToast(response.data.toast);
                    delete(response.data.toast);
                }
                return response;
            }
            return ({
                request: request,
                response: response
            });
        }]).controller('alertCtrl', ['$scope', '$rootScope', 'alertService', function ($scope, $rootScope, alertService) {
            $scope.alerts = [];
            $scope.alertTimeOut = 3000;
            alertService.setAlertHooks(() => {
                addAlert(alertService.getAlert());
            });
            $rootScope.$on('_mgs_recieved', (e, type, msg) => {
                addAlert({
                    type: type,
                    msg: msg
                });
            });
            $scope.closeAlert = (index) => {
                $scope.alerts.splice(index, 1);
            };
            let addAlert = (alert) => {
                $scope.alerts.push(alert);
            };

        }])
        .service('alertService', function (hookRunner, $log, toaster) {
            let self = this;
            self.alert = {};
            self.toast = {};
            self.alertHooks = [];

            let fixThings = () => {
                setAlert({
                    type: 'danger',
                    msg: 'Sorry you need to fix a few things..'
                });
            };
            let setAlert = (alertNew) => {
                self.alert = {};
                self.alert.type = alertNew.type;
                self.alert.msg = alertNew.msg;
                hookRunner.exec(self.alertHooks);
            }

            function setAlertHooks(alertHook) {
                if (alertHook) {
                    self.alertHooks.push(alertHook);
                }
            }

            function setToast(toastNew) {
                self.toast = {};
                self.toast.status = (toastNew.type === 'danger') ? 'error' : toastNew.type;
                self.toast.msg = toastNew.msg;
                showToast();
            }

            function showToast() {
                toaster.pop(self.toast.status, "", self.toast.msg, 10000, 'trustedHtml');
            }

            function getAlert() {
                return self.alert;
            }
            return ({
                getAlert: getAlert,
                setAlert: setAlert,
                setAlertHooks: setAlertHooks,
                setToast: setToast,
                fixThings: fixThings
            });
        }).service('titleService', function (hookRunner, $linstore, $log) {
            let self = this;
            self.hooks = [];
            self.scrollTexthooks = {};
            self.pageTitle = 'Home';
            self.page_desc = 'Home';
            self.def_desc = "linsms is an online bulk sms marketing system dedicted to enable indivals, businesses and companies to send sms to their frequent customers and for mass gatherings from their internet enabled devices like pcs and mobile";
            self.scrollText = 'Welcome to LinSms some pages may not work as expected because this website is still under development.';

            let setHooks = (hook) => {
                self.hooks.push(hook);
            };
            let setTitle = (title, description = undefined) => {
                self.pageTitle = title;
                self.page_desc = description;
                hookRunner.exec(self.hooks);
            };
            let getTitle = () => {
                document.title = self.pageTitle + ' ' + $linstore.web_title;
                let page_desc = document.head.querySelector('meta[name="description"]');
                page_desc.content = (!!self.page_desc) ? self.page_desc : self.def_desc;
            };
            let getScrollText = function () {
                return self.scrollText;
            };
            let setScrollText = function (text) {
                self.scrollText = text;
                hookRunner.exec(self.scrollTexthooks);
            };
            let setScrollHook = (name, hook) => {
                self.scrollTexthooks[name] = angular.copy(hook);
            };
            let delScrollHook = (name) => {
                delete(self.scrollTexthooks.name);
            };
            return ({
                getScrollText: getScrollText,
                setScrollText: setScrollText,
                setScrollHook: setScrollHook,
                delScrollHook: delScrollHook,
                setTitle: setTitle,
                setHooks: setHooks,
                getTitle: getTitle
            });
        }).service('navToggleService', ['$log', 'storage', 'hookRunner', '$state', function ($log, storage, hookRunner, $state) {
            let visibleNav = false;
            let navHooks = [];
            let namedNavHooks = {};
            let openHook = [];
            this.setHook = (navHook) => {
                navHooks.push(navHook);
            };
            this.isActive = (glob) => {
                return $state.includes(glob);
            };
            this.setNamedHook = (key, navHook) => {
                namedNavHooks[key] = angular.copy(navHook);
            };
            this.unsetHook = (key) => {
                delete(namedNavHooks[key]);
            };
            this.isVisibleNav = (navId) => {
                return (!!(navId) && visibleNav === navId);
            };
            this.hideShowtoggler = () => {
                return !!visibleNav;
            };
            this.unsetVisible = () => {
                visibleNav = false;
                applyHooks();
            };

            this.setVisible = (navId) => {
                visibleNav = (!!navId) ? navId : '';
                applyopenHooks();
                applyHooks();
            };
            this.toggleVisible = (navId) => {
                if (this.isVisibleNav(navId)) {
                    this.unsetVisible();
                } else {
                    this.setVisible(navId);
                }
            };
            this.opening = (hook) => {
                openHook.push(hook);
            };
            let applyopenHooks = () => {
                hookRunner.exec(openHook);
            }
            let applyHooks = () => {
                hookRunner.exec(navHooks);
                hookRunner.exec(namedNavHooks);
            }
            window.addEventListener("keyup", (e) => {
                let which = e.which;
                if (which === 27) {
                    visibleNav = '';
                    applyHooks();
                }
            });
        }]).service('Exception', function () {
            this.undefinedAttribute = function (message) {
                if (!message) {
                    message = 'Missing attribute please check your documentaion';
                }
                return {
                    name: 'UndefinedAttributeException',
                    message: message
                }
            };
            this.directiveMsg = function (attribute, directive) {
                return ('Missing attribute "' + attribute + '" check documentaion about ' + directive + ' directive');
            };
        })
        .factory("lazyLoader", function ($rootScope, $q, $log) {
            function loadModule(deps, successCallback, errorCallback) {
                var self = this;
                self.d = $q.defer();
                self.promise = null;
                self.dep_files = [];
                if (angular.isDefined(deps)) {
                    self.dep_files = deps;
                } else {
                    //throw exception
                    $log.log('no deps set');
                }
                self.successCallback = (successCallback || angular.noop);
                self.errorCallback = (errorCallback || angular.noop);
                self.promise = self.d.promise;
                self.promise.then(self.successCallback, self.errorCallback);
                require(self.dep_files, function requireSucess() {
                    $rootScope.$apply(function () {
                        self.d.resolve();
                    });
                }, function requireError(error) {
                    $rootScope.$apply(function () {
                        self.d.reject(error);
                    });
                });
                return (self.promise);
            }
            return ({
                loadModule: loadModule
            });
        })
        //directives
        .directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
            // contains
            function contains(arr, item, comparator) {
                if (angular.isArray(arr)) {
                    for (var i = arr.length; i--;) {
                        if (comparator(arr[i], item)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            // add
            function add(arr, item, comparator) {
                arr = angular.isArray(arr) ? arr : [];
                if (!contains(arr, item, comparator)) {
                    arr.push(item);
                }
                return arr;
            }

            // remove
            function remove(arr, item, comparator) {
                if (angular.isArray(arr)) {
                    for (var i = arr.length; i--;) {
                        if (comparator(arr[i], item)) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
                return arr;
            }

            // http://stackoverflow.com/a/19228302/1458162
            function postLinkFn(scope, elem, attrs) {
                // exclude recursion, but still keep the model
                var checklistModel = attrs.checklistModel;
                attrs.$set("checklistModel", null);
                // compile with `ng-model` pointing to `checked`
                $compile(elem)(scope);
                attrs.$set("checklistModel", checklistModel);

                // getter / setter for original model
                var getter = $parse(checklistModel);
                var setter = getter.assign;
                var checklistChange = $parse(attrs.checklistChange);
                var checklistBeforeChange = $parse(attrs.checklistBeforeChange);

                // value added to list
                var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


                var comparator = angular.equals;

                if (attrs.hasOwnProperty('checklistComparator')) {
                    if (attrs.checklistComparator[0] == '.') {
                        var comparatorExpression = attrs.checklistComparator.substring(1);
                        comparator = function (a, b) {
                            return a[comparatorExpression] === b[comparatorExpression];
                        };

                    } else {
                        comparator = $parse(attrs.checklistComparator)(scope.$parent);
                    }
                }

                // watch UI checked change
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                        scope[attrs.ngModel] = contains(getter(scope.$parent), value, comparator);
                        return;
                    }

                    setValueInChecklistModel(value, newValue);

                    if (checklistChange) {
                        checklistChange(scope);
                    }
                });

                function setValueInChecklistModel(value, checked) {
                    var current = getter(scope.$parent);
                    if (angular.isFunction(setter)) {
                        if (checked === true) {
                            setter(scope.$parent, add(current, value, comparator));
                        } else {
                            setter(scope.$parent, remove(current, value, comparator));
                        }
                    }

                }

                // declare one function to be used for both $watch functions
                function setChecked(newArr, oldArr) {
                    if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                        setValueInChecklistModel(value, scope[attrs.ngModel]);
                        return;
                    }
                    scope[attrs.ngModel] = contains(newArr, value, comparator);
                }

                // watch original model change
                // use the faster $watchCollection method if it's available
                if (angular.isFunction(scope.$parent.$watchCollection)) {
                    scope.$parent.$watchCollection(checklistModel, setChecked);
                } else {
                    scope.$parent.$watch(checklistModel, setChecked, true);
                }
            }

            return {
                restrict: 'A',
                priority: 1000,
                terminal: true,
                scope: true,
                compile: function (tElement, tAttrs) {
                    if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') && (tElement[0].tagName !== 'MD-CHECKBOX') && (!tAttrs.btnCheckbox)) {
                        throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
                    }

                    if (!tAttrs.checklistValue && !tAttrs.value) {
                        throw 'You should provide `value` or `checklist-value`.';
                    }

                    // by default ngModel is 'checked', so we set it if not specified
                    if (!tAttrs.ngModel) {
                        // local scope var storing individual checkbox model
                        tAttrs.$set("ngModel", "checked");
                    }

                    return postLinkFn;
                }
            };
        }]).directive('textReader', function ($parse, $log) {
            return {
                restrict: 'A',
                scope: false,
                link: function (scope, elem, attrs) {
                    scope.rqr = ['text/plain', 'application/vnd.ms-excel'];
                    var fn = $parse(attrs.textReader);
                    angular.element(elem).on('change', function (onChangeEvent) {
                        var myfile, vals = false;
                        var reader = new FileReader();
                        reader.onload = function (onLoadEvent) {
                            scope.$apply(function () {
                                fn(scope, {
                                    $fileContent: onLoadEvent.target.result
                                });
                            });
                        };
                        myfile = (onChangeEvent.srcElement || onChangeEvent.target).files[0];
                        // $log.info(myfile.type);
                        angular.forEach(scope.rqr, function (rqr) {
                            if (myfile.type === rqr) {
                                vals = true;
                            }
                        });
                        if (!vals) {
                            $log.error("Only CSV/ TEXT files are allowed");
                            return;
                        }
                        reader.readAsText(myfile);
                    });
                }
            };
        }).directive('inView', function ($parse, $log, $window, $timeout) {
            return ({
                restrict: 'A',
                scope: {
                    isViewed: '&?',
                    notViewed: '&?'
                },
                link: function (scope, elem, attris) {
                    scope.element = angular.element(elem[0]);
                    scope.viewPortTop = 0;
                    scope.elemTop = 0;
                    scope.viewPortBottom = 0;
                    scope.elemBottom = 0;
                    trackVisibility();
                    $(window).on('resize scroll', function () {
                        trackVisibility();
                    });

                    function trackVisibility() {
                        init();
                        var isVisible = isInView();
                        if (!!isVisible) {
                            if (angular.isDefined(scope.isViewed)) {
                                scope.isViewed();
                            }
                        } else {
                            if (angular.isDefined(scope.notViewed)) {
                                scope.notViewed();
                            }
                        }
                    }

                    function init() {
                        scope.elemTop = scope.element.offset().top;
                        scope.elemBottom = scope.elemTop + scope.element.outerHeight();
                        scope.viewPortTop = $(window).scrollTop();
                        scope.viewPortBottom = scope.viewPortTop + $(window).height();
                    }

                    function isInView() {
                        return scope.elemBottom > scope.viewPortTop && scope.elemTop < scope.viewPortBottom;
                    }
                }
            });
        })
        .directive('textSlider', function (titleService, $log, hookRunner) {
            return {
                restrict: 'EA',
                template: '<div class="row bg-secondary fixed-bottom">' +
                    '<div class="col-12">' +
                    // <marquee behavior="scroll" id="adcont" scrollamaount="80" direction="left" ng-bind-html="scrollText" onmouseover="this.stop();" onmouseout="this.start();">           
                    // </marquee>
                    '<p class="marquee w-100" ng-bind-html="scrollText"></p>' +
                    '</div>' +
                    '</div>',
                link: function (scope, elem, atrrs) {
                    scope.scrollText = '';

                    function getText() {
                        scope.scrollText = titleService.getScrollText();

                    }

                    getText();
                    titleService.setScrollHook('textSlider', function () {
                        getText();
                        scope.$apply(function () {
                            // ((((elem[0]).children[0]).children[0]).children[0]).stop();
                            // ((((elem[0]).children[0]).children[0]).children[0]).start();
                        });
                    });
                    scope.$on('$destroy', function () {
                        titleService.delScrollHook('textSlider');
                    });
                }

            }
        })
        .directive('onPaste', function (alertService) {
            return {
                restrict: 'A',

                link: function (scope, elem, attrs) {
                    var el = elem;
                    el.bind('paste', function (e) {
                        e.preventDefault();
                        alertService.setToast({
                            msg: 'Paste has been disabled for this element',
                            type: 'danger'
                        });
                    });
                }
            }
        })
        .directive('limitTo', function ($log) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    attrs.$set('ngTrim', 'false');
                    scope.msgCont = (!!attrs.limitToElem) ? attrs.limitToElem : false;
                    var wlimit = parseInt(attrs.limitTo);

                    function setRem(value = wlimit) {
                        if (scope.msgCont) {
                            angular.element(scope.msgCont).html('<b>Remaing:</b>&nbsp;' + value + '&nbsp;<b>of</b>&nbsp;' + wlimit);
                        }
                    }
                    setRem();
                    scope.$watch(attrs.ngModel, function (newValue) {
                        let isdef = angular.isDefined(ngModel.$viewValue);
                        if (scope.msgCont) {
                            let remaining = (isdef) ? wlimit - ngModel.$viewValue.length : wlimit;
                            if ((remaining) >= 0) {
                                setRem(remaining);
                            }
                        }
                        if (isdef) {
                            let viewValue = ngModel.$viewValue;
                            if (!!viewValue.trim()) {
                                if (viewValue.length > wlimit) {
                                    ngModel.$setViewValue(viewValue.substring(0, wlimit));
                                    ngModel.$render();
                                }
                            } else {
                                ngModel.$setViewValue();
                                ngModel.$render();
                            }
                        }
                    }, true);
                }
            }
        }).directive('smsRecp', function ($log, Exception) {
            return ({
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    attrs.$set('ngTrim', 'false');
                    scope.smsRecp = parseInt(attrs.smsRecp);
                    scope.respCont = angular.element(attrs.respCont);
                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        let viewValue = ngModel.$viewValue;
                        if (angular.isDefined(viewValue)) {
                            if (!!viewValue.trim() && viewValue.length > 0) {
                                //validation

                            } else {
                                scope.smsRecp = 0;
                                scope.respCont.html(scope.smsRecp);
                                ngModel.$setViewValue();
                                ngModel.$render();

                            }
                        }
                    });
                    scope.respCont.html(scope.smsRecp);
                }
            });
        }).directive('msgCounter', function ($log, Exception) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    attrs.$set('ngTrim', 'false');
                    if (!(scope.msgMaxCount = (angular.isDefined(attrs.msgMaxCount)) ? parseInt(attrs.msgMaxCount) : false)) {
                        throw new Exception.undefinedAttribute(Exception.directiveMsg('msgMaxCount', 'msgCounter'));
                    }
                    if (!(scope.msgCountElem = (angular.isDefined(attrs.msgCountElem)) ? angular.element(attrs.msgCountElem) : false)) {
                        throw new Exception.undefinedAttribute(Exception.directiveMsg('msgCountElem', 'msgCounter'));
                    }

                    if (!(scope.msgCountLength = (angular.isDefined(attrs.msgCountLength)) ? parseInt(attrs.msgCountLength) : false)) {
                        throw new Exception.undefinedAttribute(Exception.directiveMsg('msgCountLength', 'msgCounter'));
                    }
                    if (!(scope.msgRemElem = (angular.isDefined(attrs.msgRemElem)) ? angular.element(attrs.msgRemElem) : false)) {
                        throw new Exception.undefinedAttribute(Exception.directiveMsg('msgRemElem', 'msgCounter'));
                    }
                    scope.curCount = 1;
                    scope.curRemOf = scope.cursmsCount = scope.msgCountLength;
                    let minRows = 3;
                    scope.rows = scope.curCount * minRows;
                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        let viewValue = ngModel.$viewValue;
                        if (angular.isDefined(viewValue)) {
                            if (!!viewValue.trim() && viewValue.length > 0) {
                                let viewlen = viewValue.length;
                                if (viewlen <= scope.msgCountLength) {
                                    scope.curCount = 1;
                                    scope.curRemOf = scope.msgCountLength - viewlen;
                                    scope.cursmsCount = scope.msgCountLength;
                                    scope.rows = (scope.curCount * minRows) + 1;
                                } else if (viewlen > scope.msgCountLength && viewlen <= scope.msgCountLength * scope.msgMaxCount) {

                                    scope.cursmsCount = scope.msgMaxCount * scope.msgCountLength;
                                    scope.curRemOf = scope.cursmsCount - viewValue.length;
                                    scope.curCount = scope.msgMaxCount;
                                    scope.rows = scope.curCount * minRows + 1;
                                } else if (viewlen > scope.msgMaxCount * scope.msgCountLength) {
                                    ngModel.$setViewValue(viewValue.substring(0, scope.msgCountLength * scope.msgMaxCount));
                                    ngModel.$render();
                                }
                            } else {
                                ngModel.$setViewValue();
                                ngModel.$render();
                                scope.curRemOf = scope.cursmsCount = scope.msgCountLength;
                                scope.curCount = 1;
                                scope.rows = scope.curCount * minRows;
                            }
                        }
                        scope.msgCountElem.html('<b>Count:</b>&nbsp;&nbsp;' + scope.curCount);
                        scope.msgRemElem.html('<b>Remaing:</b>&nbsp;' + scope.curRemOf + '&nbsp;<b>of</b>&nbsp;' + scope.cursmsCount + '&nbsp;&nbsp;');
                    });
                    scope.msgCountElem.html('<b>Count:</b>&nbsp;&nbsp;' + scope.curCount);
                    scope.msgRemElem.html('<b>Remaing:</b>&nbsp;' + scope.curRemOf + '&nbsp;<b>of</b>&nbsp;' + scope.cursmsCount + '&nbsp;&nbsp;');
                }
            }
        }).directive('fileInputprev', ['$parse', function ($parse) {
            return ({
                restrict: 'A',
                scope: {
                    fileInputprev: '=',
                    filePreview: '='
                },
                link: function (scope, elm, atrrs) {
                    elm.bind("change", function (changeEvent) {
                        scope.fileInputprev = changeEvent.target.files[0];
                        var reader = new FileReader();
                        reader.onload = function (loadEvent) {
                            scope.$apply(function () {
                                scope.filePreview = loadEvent.target.result;
                            });
                        }
                        reader.readAsDataURL(scope.fileInputprev);
                    });
                }
            });
        }]).directive('fileInput', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.on("change", function (event) {
                        var files = event.target.files;
                        $parse(attrs.fileInput).assign($scope, element[0].files);
                        $scope.$apply()
                    });
                }
            }
        }]).directive('isLoading', ['$transitions', function ($transitions) {
            return {
                restrict: 'E',
                trasclude: true,
                replace: true,
                template: `
                        <div id="transloader" class="text-center">
                            <i class="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
                            <span class="d-block d-sm-none clearfix"></span> Loading...
                        </div>
                        `,
                link: function (scope, elem, attrs) {
                    $transitions.onBefore({}, function ($state, $transition$) {
                        $('#transloader').css({
                            'display': 'block',
                            'opacity': 1
                        });
                    });
                    $transitions.onError({}, function ($state, $transition$) {
                        $('#transloader').css({
                            'display': 'none',
                            'opacity': 0
                        });
                    });
                    $transitions.onFinish({}, function ($state, $transition$) {
                        $('#transloader').css({
                            'display': 'none',
                            'opacity': 0
                        });
                    });
                    $transitions.onSuccess({}, function ($state, $transition$) {
                        $('#transloader').css({
                            'display': 'none',
                            'opacity': 0
                        });
                    });
                }

            }
        }])
        .directive('autoExpandInput', function ($log, $window) {
            return ({
                restrict: 'AC',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    let expand = () => {
                        elem[0].style.height = "auto";
                        let sH = elem[0].scrollHeight + 30;
                        // $log.info(sH);
                        elem[0].style.height = sH + "px";
                    }
                    scope.$watch(attrs.ngModel, expand, true);
                    $window.addEventListener('resize', expand);
                }

            });
        })
        .directive('share', function ($log, pageService) {
            return ({
                restrict: 'EA',
                link: function (scope, elem, attrs) {
                    scope.showMe = false;
                    // $log.info(navigator);
                    scope.promptShare = () => {
                        pageService.sharePage("LinSms", 'Check out LinSms for bulk sms', 'https://lin-sms.com');
                    };

                    let checkShare = () => {
                        if (navigator.share) {
                            scope.showMe = true;
                        }
                    };
                    checkShare();
                },
                template: `<span class="share bg-dark" ng-show="showMe" ng-click="promptShare()">
        <span class="fa fa-share"></span>
      </span>`
            });
        })
        .directive('mOverlay', function (navToggleService) {
            return {
                restrict: 'A',
                replace: true,
                tranclude: true,
                link: function (scope, elem, attrs) {
                    scope.clearNav = function () {
                        navToggleService.unsetVisible();
                    };

                    function showOverlay() {
                        angular.element(elem[0]).css({
                            'display': 'block',
                            'opacity': 1
                        });
                    }

                    function hideOverlay() {
                        angular.element(elem[0]).css({
                            'display': 'none',
                            'opacity': 0
                        });
                    }

                    navToggleService.setHook(function () {
                        if (navToggleService.hideShowtoggler()) {
                            showOverlay();
                        } else {
                            hideOverlay();
                        }
                    });

                },
                template: `<div class="m-overlay" ng-click="clearNav()"></div>`
            }
        })
        .directive('scrollUp', function () {
            return {
                restrict: 'E',
                transclude: true,
                replace: true,
                template: '<div id="backtop" ng-click="scrollTOTop()">&#9650;</div>',
                controller: function ($scope) {
                    $scope.scrollTOTop = function () {
                        $('html,body').animate({
                            scrollTop: 0
                        }, 900);
                    }
                },
                link: function (scope, element, attrs) {
                    $(window).scroll(function () {
                        if ($(this).scrollTop() > 200) {
                            $('#backtop').css({
                                'display': 'block',
                                'opacity': 1
                            });
                        } else {
                            $('#backtop').css({
                                'display': 'none',
                                'opacity': 0
                            });
                        }
                    });
                }
            };
        })
        //filters
        .filter("stringObscure", function () {
            return function (input, startAt, endAt, show) {
                if (!!show) {
                    return input;
                }
                var len = input.length,
                    rp = "x";
                if (len < startAt) {
                    return input;
                }
                if (len < endAt) {
                    endAt = 0;
                } else if (len - endAt <= startAt) {
                    endAt = 0;
                }
                var trim_txt = input.substring(startAt, len - endAt);
                var rep_txt = rp.repeat(trim_txt.length);
                var newInput = input.replace(trim_txt, rep_txt);
                return newInput;
            };
        })
        .filter('customCurrency', function () {
            return function (input, symbol, place) {
                if (isNaN(input)) {
                    return input;
                } else {

                    var newinput = input.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    var symbol = symbol || '$';
                    var place = place === undefined ? true : place;

                    // Perform the operation to set the symbol in the right location
                    if (place === true) {
                        return symbol + ' ' + newinput;
                    } else {
                        return newinput + ' ' + symbol;
                    }

                }
            }

        });
}));
