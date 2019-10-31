define(['app'], (app) => {
    'use strict';
    app.service('httpService', ['$http', '$q', '$log', 'alertService', function ($http, $q, $log, alertService) {

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
            cachedata = (cachedata) ? cachedata : false;
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
                $log.info(data, status);
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
    }]);
    // return app;
})
