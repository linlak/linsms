define(['app'], function (app) {
    app.controller('a_tutsCtrl', function ($scope, tutorials) {
        $scope.tutorials = [];

        function applyData(r) {
            if (r.tutorials) {
                $scope.tutorials = r.tutorials;
            }
        }
        applyData(tutorials);
    });
});
