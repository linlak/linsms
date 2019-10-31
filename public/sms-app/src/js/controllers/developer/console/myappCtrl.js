define(['app'], function (app) {
    app.controller('myappCtrl', function ($scope, devService, web_app, $timeout, pageService, $state) {
        $scope.myapp = {};
        $scope.show_client = false;
        $scope.show_secret = false;
        $scope.isSubmiting = false;
        $scope.ref_keys = 0;
        $scope.errs = {};
        $scope.editApp = function () {
            $scope.isSubmiting = true;
            $scope.errs = {};
            let = data = 'submit=' + (new Date()).getTime() + '&id=' + $scope.myapp.id + '&app_name=' + $scope.myapp.app_name + '&ref_keys=' + $scope.ref_keys;
            devService.editApp('', data).then(applyEdit, applyEdit);
        };

        $scope.showClient = () => {
            $scope.show_client = !$scope.show_client;
        };
        $scope.editConf = (wht) => {
            $scope.isSubmiting = true;
            let = data = 'submit=' + (new Date()).getTime() + '&id=' + $scope.myapp.id;
            devService.editApp('/' + wht, data).then(applyEdit, applyEdit);
        };
        $scope.showSecret = () => {
            $scope.show_secret = !$scope.show_secret;
        };

        $scope.clipboard = function (item) {
            pageService.copyClipboard(item);
        };
        $scope.refClient = function () {
            $scope.editConf('client-id');
        };
        $scope.refSecret = function () {
            $scope.editConf('secret');
        };

        function applyEdit(r) {
            $scope.isSubmiting = false;

            if (angular.isDefined(r.success_flag)) {
                applyApp(r);
                if (r.success_flag == 1) {
                    $scope.errs = {};
                    if (r.done) {
                        //redirect to main page
                        devService.setAppId($scope.myapp.id);
                        $state.go('appdetail.home', {
                            id: $scope.myapp.id
                        });
                    }
                } else {
                    if (r.errs) {
                        $scope.errs = r.errs;
                    }
                }
            }
        }

        function applyApp(r) {
            if (r.web_app) {
                $scope.myapp = r.web_app;
            }
        }
        applyApp(web_app);
    });
});
