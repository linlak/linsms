define(['app'], function (app) {
    app.controller("appDetCtrl", function ($scope, devService) {
        $scope.app_id = '';

        function getId() {
            $scope.app_id = devService.getAppId();
        }
        getId();
    });
})
