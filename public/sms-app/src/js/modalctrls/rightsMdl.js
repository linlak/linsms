define(['app'], function (app) {
    app.controller('rightsMdl', ['$uibModalInstance', 'authService', function ($uibModalInstance, authService) {
        var $ctrl = this;

        $ctrl.errs = "";
        $ctrl.token = "";
        $ctrl.ok = function () {
            $ctrl.errs = "";
            authService.requestRights($ctrl.token).then(r => {
                $uibModalInstance.close();
            }, e => {
                $uibModalInstance.dismiss();
            });

        };
        $ctrl.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
});
