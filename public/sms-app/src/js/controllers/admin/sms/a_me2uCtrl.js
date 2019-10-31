define([
    // 'require',
    'app'
], function (app) {
    'use strict';

    app.controller('a_me2uCtrl', ['$scope', 'me2u', function ($scope, me2u) {
        // console.info('in  ctrl');
        $scope.mu = [];
        applyData(me2u);

        function applyData(r) {
            if (r.me2u) {

                $scope.mu = r.me2u;
            }
        }
    }]);
});
