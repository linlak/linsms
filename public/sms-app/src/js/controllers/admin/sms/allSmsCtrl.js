define(['app'], function (app) {
    app.controller('allSmsCtrl', ['$scope', 'adminService', 'payts', '$timeout', 'adminService', function ($scope, adminService, payts, $timeout, adminService) {
        $scope.sub_title = 'All SMS Payments';
        $scope.payments = [];
        $scope.cur_pay = {};
        $scope.pay_form = {};
        $scope.is_changed = false;
        $scope.detIndex = undefined;
        applyData(payts);

        function applyData(r) {
            if (r === 'error') {
                return;
            }
            $scope.sub_title = r.sub_title;
            $scope.payments = r.payments;
        }
        $scope.showTemp = (pay, index) => {
            if (angular.isDefined($scope.cur_pay.p_id) && $scope.detIndex === index) {
                return 'pay-details';
            }
            return 'list-item';
        };
        $scope.showDet = (pay, index) => {
            if (angular.isDefined($scope.cur_pay.p_id)) {
                return;
            }
            $scope.errs = {};
            $scope.detIndex = index;
            adminService.getData('payment/' + pay.p_id).then(r => {
                if (r.no_data) {
                    $scope.payments.splice(index, 1);
                    return;
                }
                $scope.cur_pay = r.payment;
            }, e => {

            });
        };
        let applySubmit = (r) => {
            $scope.errs = {};
            if (r.success_flag === 1) {
                $scope.is_changed = true;
                switch (r.action) {
                    case 'activate':
                    case 'suspend':
                    case 'reactivate':
                        $scope.is_changed = true;
                        if (r.payment) {
                            $scope.cur_pay = r.payment;
                        }
                        break;
                    case 'del':
                        $scope.cancelDet();
                        break;
                }
            } else {
                if (r.errs) {
                    $scope.errs = r.errs;
                }
                if (r.no_data) {
                    $scope.is_changed = true;
                    $scope.cancelDet();
                }
            }
        };
        $scope.cancelDet = () => {
            $scope.errs = {};
            $scope.pay_form = {};
            $timeout(() => {
                $scope.cur_pay = {};
                $scope.detIndex = undefined;
                if ($scope.is_changed) {
                    $scope.is_changed = false;
                    adminService.getData('payments').then(applyData, e => {});
                }
            }, 100);

        };
        $scope.loadAction = (status) => {
            if (status === '0') {
                return 'activation';
            }

            // if (status==='1'&&!$scope.cur_pay.isCur) {return 'activation';}

            if (status === '1' && $scope.cur_pay.isCur && $scope.cur_pay.isUsable === '0') {
                return 'reactivation';
            }
            if (status === '1' && $scope.cur_pay.isCur && $scope.cur_pay.isUsable === '1') {
                return 'suspend';
            }
            return '';
        };
        $scope.actPay = () => {
            $scope.errs = {};
            if (!angular.isDefined($scope.cur_pay.p_id)) {
                $scope.cancelDet();
                return;
            }

            let data = 'submit=' + (new Date).getTime() +
                '&action=activate&p_id=' + $scope.cur_pay.p_id;
            data += '&p_mtd=' + ($scope.pay_form.p_mtd || '');
            data += '&p_phone=' + ($scope.pay_form.p_phone || '');
            data += '&trans_id=' + ($scope.pay_form.trans_id || '');
            adminService.adminVal('payment', data).then(applySubmit, e => {});
        };
        $scope.actSuspend = () => {
            $scope.errs = {};
            if (!angular.isDefined($scope.cur_pay.p_id)) {
                $scope.cancelDet();
                return;
            }
            let data = 'submit=' + (new Date).getTime() +
                '&action=suspend&p_id=' + $scope.cur_pay.p_id;
            data += '&reason=' + ($scope.pay_form.reason || '');
            adminService.adminVal('payment', data).then(applySubmit, e => {});
        };
        $scope.actDelReact = (action) => {
            $scope.errs = {};
            if (!angular.isDefined($scope.cur_pay.p_id)) {
                $scope.cancelDet();
                return;
            }
            let data = 'submit=' + (new Date).getTime() +
                '&action=' + action + '&p_id=' + $scope.cur_pay.p_id;
            adminService.adminVal('payment', data).then(applySubmit, e => {});
        };
    }]);
});
