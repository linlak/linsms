define(['app'], function (app) {
    app.controller('myappsCtrl', function ($scope, devService, apps) {
        $scope.myapps = [];

        function applyApps(r) {
            if (r.web_apps) {
                $scope.myapps = r.web_apps;
            }
        }
        applyApps(apps);
    });
});
