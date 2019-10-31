define(['app'], function (app) {
    app.controller('confirmSendMdl', ['$uibModalInstance', 'msg', 'user', 'cal', function ($uibModalInstance, msg, user, cal) {
        let $ctrl = this;
        $ctrl.msg = {};
        $ctrl.cal = {};
        $ctrl.me = user;
        $ctrl.ok = function () {
            $uibModalInstance.close(true);
        };
        $ctrl.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function applyData(r) {
            $ctrl.msg = r;
        }
        applyData(msg);

        function applyCal(r) {
            $ctrl.cal = r;
        }
        applyCal(cal);

    }]);
});
