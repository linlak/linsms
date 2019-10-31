define(['app'], function (app) {
    app.controller('createAppCtrl', function ($scope, devService, $state) {
        $scope.myapp = {
            app_name: ''
        };
        $scope.isSubmiting = false;
        $scope.errs = {};
        $scope.createApp = function () {
            $scope.isSubmiting = true;
            $scope.errs = {};
            var data = "submit=" + (new Date()).getTime() + "&app_name=" + $scope.myapp.app_name;
            devService.getConsole('create-app', data).then(r => {
                $scope.isSubmiting = false;
                if (r.success_flag === 1) {
                    $state.go('console.apps');
                } else {
                    if (r.errs) {
                        $scope.errs = r.errs;
                    }
                }
            }, e => {
                $scope.isSubmiting = false;
            });
        };
    });
});
