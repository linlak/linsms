define(['app'], function (app) {
    app.controller('tutorialsCtrl', function ($scope, tutorials) {
        $scope.tutorials = [];

        function applyData(r) {
            if (r.tutorials) {
                $scope.tutorials = r.tutorials;
            }
        }
        applyData(tutorials);
    });
});
