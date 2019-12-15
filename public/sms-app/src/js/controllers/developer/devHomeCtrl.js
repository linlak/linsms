define(['app'], function (app) {
    app.controller("devHomeCtrl", function ($scope, devService) {
        $scope.openConsole = function () {
            devService.gotoConsole();
        };
    });
});
