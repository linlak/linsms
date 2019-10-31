define(['app'], function (app) {
    'use strict';
    app.service('user', function (hookRunner, $log, tokenService, $q, $rootScope, idbService, $timeout, pusherService) {
        let self = this;
        self.user_det = "user_details";
        self.isUser = false;
        self.user_role = 'public';
        self.myname = '';
        self.sms_count = 0;
        self.unread_notifications = 0;
        self.has_sms = false;
        self.channel = null;
        self.usableSms = '0';
        self.usableReason = '';
        self.user_id = false;
        self.hook_id = false;
        self.prev_id = false;
        self.email = '';
        self.status = 0;
        self.hooks = {};
        self.websocketHooks = {};

        self.first_load = true;
        let webCallback = (eventName, data) => {
            $log.info(eventName, data);
        };

        function subscribe() {
            if (!self.user_id || !self.hook_id) {
                return;
            }
            if (self.hook_id == self.prev_id) {
                return;
            }
            if ((!!self.hook_id && !!self.prev_id) && (self.hook_id != self.prev_id)) {
                unsubscribe();
            }
            self.channel = pusherService.privateChannel('App.User.' + self.hook_id);
            self.prev_id = self.hook_id;
            if (self.channel) {
                self.channel.bind_global(webCallback);
            }

        }

        function unsubscribe() {
            if (!self.user_id || !self.prev_id) {
                return;
            }
            pusherService.privateChannel('App.User.' + self.prev_id, true);
            self.prev_id = false;
            self.channel = null;
        }

        let resetAuth = (keepToken = false) => {
            unsubscribe();
            self.myname = '';
            self.user_role = 'public',
                self.email = '';
            self.status = 0;
            self.unread_notifications = 0;
            self.isUser = false;
            self.user_id = false;
            self.has_sms = false,
                self.sms_count = 0;
            self.usableSms = '0';
            self.usableReason = '';
            if (!keepToken) {
                clearToken();
                applyHooks();
            }

        };
        let setWebHook = (tagName, eventName, callback) => {};
        let unsetWebHook = (tagName, eventName) => {};

        let getDbUser = () => {
            idbService.store.objStore('curuser', 'readonly').then(st => {
                st.get(self.user_det).then(r => {

                    if (angular.isDefined(r)) {
                        let data = r.user;
                        if (!!data.isUser) {
                            self.myname = data.name;
                            self.user_role = data.user_role;
                            self.isUser = true;
                            self.email = data.email;
                            self.unread_notifications = data.notifications;
                            self.user_id = data.id;
                            self.hook_id = data.hook_id;
                            self.has_sms = data.has_sms;
                            self.sms_count = data.sms_count;
                            self.usableSms = data.isUsable;
                            self.usableReason = data.reason;
                            subscribe();
                        } else {
                            resetAuth(true);
                        }
                    } else {
                        resetAuth(true);
                    }
                    self.first_load = false;
                    applyHooks();
                }, e => {
                    self.first_load = false;
                    resetAuth();
                });
            }, e => {
                self.first_load = false;
                applyHooks();
            });
        };
        let init = () => {
            getDbUser();
        };

        let setUser = (data) => {
            // $log.info(data);
            if (data.isUser) {
                idbService.store.objStore('curuser', 'readwrite').then(st => {
                    st.put({
                        id: self.user_det,
                        user: data
                    }).then(() => {
                        getDbUser();
                    });
                    st.complete;
                }, e => {
                    applyHooks();
                });

            } else {
                if (isLoggedIn()) {
                    resetAuth(true);
                }
            }
        };
        let getRole = () => {
            return self.user_role;
        };
        let getEmail = () => {
            return self.email;
        };

        function isSuper() {
            return (self.isUser && self.user_role === 'super');
        }


        function isPending() {
            return (self.isUser && self.status === 0);
        }

        function isActive() {
            return (self.isUser && self.status === 1);
        }

        function setHook(tagName, hook) {
            self.hooks[tagName] = angular.copy(hook);
        }

        function unsetHook(tagName) {
            if (tagName in self.hooks) {
                delete(self.hooks.tagName);
            }

        }

        function isLoggedIn() {
            return self.isUser;
        }
        let isAdmin = () => {
            return ((self.user_role === 'admin' || self.user_role === 'super') && self.isUser);
        };
        let getName = () => {
            return self.myname;
        };

        function clearToken() {
            tokenService.unsetAccessToken();
        }

        function applyHooks() {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
            hookRunner.exec(self.hooks);
        }
        let getUserid = () => {
            return self.user_id;
        };
        let hasSMS = () => {
            return self.has_sms;
        };
        let getSMS = () => {
            return self.sms_count;
        };
        let getUsable = () => {
            return self.usableSms;
        };
        let getReason = () => {
            return self.usableReason;
        };
        let unread_notifications = (notifications = false) => {
            if (!!notifications) {
                self.unread_notifications = notifications;
                applyHooks();
                return;
            }
            return self.unread_notifications;
        }
        $timeout(init(), 100);
        tokenService.setTokenHook('user_service', init);
        return ({
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            getName: getName,
            getSMS: getSMS,
            setHook: setHook,
            getUserid: getUserid,
            unsetHook: unsetHook,
            resetAuth: resetAuth,
            setUser: setUser,
            isSuper: isSuper,
            getEmail: getEmail,
            first_load: self.first_load,
            hasSMS: hasSMS,
            getUsable: getUsable,
            getReason: getReason,
            init: init,
            unread_notifications: unread_notifications,
        });
    });
});
