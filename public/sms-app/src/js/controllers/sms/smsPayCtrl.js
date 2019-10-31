define(['app'], function (app) {
    app.controller('smsPayCtrl', ['$scope', 'payments', '$timeout', 'smsService', function ($scope, payments, $timeout, smsService) {
        $scope.payments = [];
        $scope.cur_pay = {};
        $scope.walletpay = undefined;
        $scope.curIndex = undefined;
        $scope.curIndexCb = undefined;
        $scope.pNow = {
            p_phone: '',
            p_type: ''
        };
        applyData(payments);

        function applyData(r) {
            $scope.payments = r.payments;
        }

        function applyPayNow(r) {
            $scope.isSubmiting = false;
            if (r.success_flag == 1) {
                if (r.payment) {
                    $scope.cur_pay = r.payment;
                }
            } else {
                if (r.errs) {
                    $scope.errs = r.errs;
                }
            }
        }

        function fetchPay(id) {
            smsService.getData('payment/' + id).then(function (r) {
                if (r.payment) {
                    if ($scope.curIndexCb != undefined) {
                        $scope.curIndex = angular.copy($scope.curIndexCb);
                        $scope.curIndexCb = undefined;
                    }
                    $scope.cur_pay = r.payment;
                    if (($scope.cur_pay.status == 0) && ($scope.cur_pay.sms_price > 0)) {
                        $scope.walletpay = Math.floor((($scope.cur_pay.sms_price) * 3 / 100) + $scope.cur_pay.sms_price);
                    }
                }
            }, function () {
                $scope.curIndex = undefined;
                $scope.curIndexCb = undefined;
                $scope.walletpay = undefined;
                $scope.cur_pay = {};
                $scope.pNow = {
                    p_phone: '',
                    p_type: ''
                };
                $scope.errs = {};
            });
        }
        $scope.showTemp = (pay, index) => {
            if (angular.isDefined($scope.cur_pay.p_id) && $scope.curIndex === index) {
                return 'pay-details';
            }
            return 'list';
        };
        $scope.payNow = () => {
            if (angular.isDefined($scope.cur_pay.p_id)) {
                $scope.errs = {};
                $scope.isSubmiting = true;
                let data = 'submit=' + (new Date()).getTime() +
                    '&id=' + $scope.cur_pay.p_id +
                    '&p_phone=' + $scope.pNow.p_phone +
                    '&p_type=' + $scope.pNow.p_type;
                smsService.valSms('paynow', data).then(applyPayNow, (e) => {
                    $scope.isSubmiting = false;
                });
            }
        };
        $scope.showPayCB = (id, index) => {
            if (angular.isDefined($scope.cur_pay.p_id)) {
                if ($scope.curIndex === index) {
                    return;
                }
            }
            $scope.curIndexCb = index;
            fetchPay(id);
        }
        $scope.showPay = (pay, index) => {
            if (angular.isDefined($scope.cur_pay.p_id)) {
                if ($scope.curIndex == index) {
                    return;
                }
                $scope.curIndexCb = index;
            } else {
                $scope.curIndex = index;
            }

            fetchPay(pay.p_id);
        };
        $scope.cancelDet = () => {
            $timeout(() => {
                $scope.curIndex = undefined;
                $scope.curIndexCb = undefined;
                $scope.cur_pay = {};
                $scope.pNow = {
                    p_phone: '',
                    p_type: ''
                };
                $scope.errs = {};
            }, 100);
        };
        $scope.showPayStatus = () => {
            if (angular.isDefined($scope.cur_pay.status)) {
                if ($scope.cur_pay.status === 0) {
                    return "pay-form";
                } else {
                    return "pay-extras";
                }
            }
            return '';
        };
    }]);
})
