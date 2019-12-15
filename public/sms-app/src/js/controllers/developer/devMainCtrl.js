define(['app'], function (app) {
    app.controller("devMainCtrl", function ($scope, navToggleService) {
        $scope.isdev = false;
        $scope.toggleDev = function () {
            navToggleService.toggleVisible('dev');
        };
        navToggleService.setHook(function () {
            $scope.isdev = navToggleService.isVisibleNav(
                "dev"
            );
        });
    });
});
