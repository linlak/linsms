define(['app'], function (app) {
    app.controller("tutorialDetCtrl", function ($scope, tutorial, devService) {
        $scope.tutorial = {};

        function applyData(r) {
            if (r.tutorial) {
                $scope.tutorial = r.tutorial;
            }
        }
        applyData(tutorial);
    });
});
