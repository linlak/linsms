define(['app'], function (app) {
    app.controller("a_tutsAddCtrl", function ($scope, adminService, $state) {
        $scope.tutorial = {
            title: ''
        };
        $scope.errs = {};
        $scope.isSubmiting = false;
        $scope.addTopic = () => {
            if (!!$scope.isSubmiting) {
                return;
            }
            $scope.isSubmiting = true;
            $scope.errs = {};
            let data = 'submit=' + (new Date()).getTime() + '&action=create&title=' + $scope.tutorial.title;
            adminService.adminVal('tutorial', data).then(r => {
                $scope.isSubmiting = false;
                if (r.success_flag == 1) {
                    $state.go('a_tuts.edit', {
                        id: r.tutorial
                    });
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
})
