define(['app'], function (app) {
    app.controller("a_tutsEditCtrl", function ($scope, tutorial, adminService, titleService, $timeout) {
        $scope.tutorial = {};

        function applyData(r) {
            if (r.tutorial) {
                $scope.tutorial = r.tutorial;
                setTitle();
            }
        }
        $scope.editTutorial = function () {
            let data = 'submit=' + (new Date()).getTime() + "&action=edit-body&id=" + $scope.tutorial.id + "&body=" + $scope.tutorial.body;
            adminService.adminVal('tutorial', data).then(r => {
                if (r.success_flag === 1) {
                    applyData(r);
                } else {
                    if (r.errs) {
                        $scope.errs = r.errs;
                    }
                }
            });
        };

        function setTitle() {
            $timeout(function () {
                titleService.setTitle($scope.tutorial.title);
            }, 0);
        }
        applyData(tutorial);
    });
});
