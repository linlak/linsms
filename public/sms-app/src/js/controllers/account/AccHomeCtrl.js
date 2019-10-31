define(['app'], function (app) {
    app.controller('AccHomeCtrl', function ($scope, accUser, accService, $state) {
        $scope.accUser = {};
        $scope.isSubmitting = false;
        $scope.errs = {};

        function applyData(r) {
            if (r.user) {
                $scope.accUser = r.user;
            }
        }
        applyData(accUser);
        $scope.saveChanges = () => {
            $scope.isSubmitting = true;
            let data = 'submit=' + (new Date).getTime() + '&fullname=' + $scope.accUser.fullname + '&gender=' + $scope.accUser.gender +
                '&country=' + $scope.accUser.country;
            accService.getData('edit-profile', data).then(r => {
                $scope.isSubmitting = false;
                if (r.success_flag === 1) {
                    $state.go('account.profile');
                    return;
                }
                if (r.errs) {
                    $scope.errs = r.errs;
                }
            }, e => {
                $scope.isSubmitting = false;
            });
        };
    });
});
