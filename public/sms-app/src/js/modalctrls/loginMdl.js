define(['app'], function (app) {
    app.controller('loginMdl', ['$uibModalInstance', 'authService', 'user', function ($uibModalInstance, authService, user) {
        var $ctrl = this;
        $ctrl.auth_user = {};
        $ctrl.err = {};
        $ctrl.isSubmiting = false;
        user.setHook('loginMdl', function () {
            if (user.isLoggedIn()) {
                user.unsetHook('loginMdl');
                $uibModalInstance.close(true);
            }
        });
        $ctrl.ok = function () {
            $ctrl.isSubmiting = true;
            $ctrl.err = {};
            authService.login($ctrl.auth_user).then((r) => {
                $ctrl.isSubmiting = false;
                if (r.success_flag === 1) {
                    resetUser();
                } else {
                    if (r.errs) {
                        $ctrl.err = r.errs;
                    }
                    $ctrl.auth_user.password = '';
                }
            }, (e) => {
                $ctrl.isSubmiting = false;
            });
        };
        $ctrl.cancel = function () {
            user.unsetHook('loginMdl');
            $uibModalInstance.dismiss();
        };

        function resetUser() {
            authService.resetUser().then((r) => {
                $ctrl.auth_user = r;
            });
            $ctrl.err = {};
        }
        resetUser();
    }]);

});
