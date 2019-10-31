define(['app'], (app) => {
    'use strict';
    app.factory('httpInterceptor', ['$log', 'alertService', 'user', '$q', function ($log, alertService, user, $q) {

        let request = (config) => {
            config.requestTimeStamp = (new Date()).getTime();
            return user.getAcessTokendb().then(token => {
                if (false !== token) {
                    return config.headers['Authorization'] = 'Bearer ' + token;
                }
            }).then(() => {
                return config;
            });

        }
        let response = (response) => {
            response.config.responseTimeStamp = (new Date()).getTime();

            if (response.data.accessToken) {
                user.setToken(response.data.accessToken);
                delete(response.data.accessToken);
            }
            if (response.data.accessStatus) {
                user.clearToken();
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
    }]);
    app.config(['$httpProvider', ($httpProvider) => {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);
});
