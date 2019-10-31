//
define(['app'], function (app) {
    app.controller('smsBuyCtrl', ['$scope', '$state', 'smsService', 'result', function ($scope, $state, smsService, result) {
        $scope.pricepreview = 0;
        $scope.smsValues = {};
        $scope.pay = {
            sms_count: '',
            pay_now: false,
            p_phone: ''
        };
        $scope.errs = {};
        applyData(result);

        function applyData(r) {
            if (r.values) {
                $scope.smsValues = r.values;
            }
        }
        $scope.getSmsValues = function () {
            smsService.getData('buy').then(function (r) {
                if (r.values) {
                    $scope.smsValues = r.values;
                }
            });
        };
        $scope.calPreview = function (d) {
            $scope.errs = {};
            $scope.pricepreview = 0;
            var isSubmit = (d) ? d : false;
            if (!$scope.pay.sms_count || isNaN($scope.pay.sms_count)) {
                $scope.pricepreview = 0;
                if (isSubmit && !$scope.pay.sms_count) {
                    $scope.errs.sms_count = ["Fields cannot be blank"];
                }
                if (isNaN($scope.pay.sms_count) && $scope.pay.sms_count) {
                    $scope.pay.sms_count = '';
                    $scope.errs.sms_count = ['Only numeric characters are allowed'];
                }
                $scope.pay.sms_count = '';
                return;
            }
            var smscount = Number($scope.pay.sms_count);
            // $scope.pricepreview=;
            if (isSubmit && smscount < $scope.smsValues.minv) {
                $scope.errs.sms_count = ['Minimum amount should be ' + $scope.smsValues.minp * $scope.smsValues.minv];
                return;
            }
            if (smscount <= 1000000) {
                //
                if (smscount <= ($scope.smsValues.minv1 - 1)) {
                    $scope.pricepreview = smscount * $scope.smsValues.minp;
                } else {
                    if (smscount <= ($scope.smsValues.minv2 - 1)) {
                        $scope.pricepreview = smscount * $scope.smsValues.minp1;
                    } else {
                        if (smscount <= $scope.smsValues.minv3 - 1) {
                            $scope.pricepreview = smscount * $scope.smsValues.minp2;
                        } else {

                            if (smscount >= $scope.smsValues.minv3) {
                                $scope.pricepreview = smscount * $scope.smsValues.minp3;
                            }
                        }

                    }

                }
            } else {
                $scope.errs.sms_count = ['You have reached our SMS limit'];
                return;
            }
            return true;
        };
        $scope.buynow = function () {
            if (!$scope.calPreview(1)) {
                return;
            }
            var data = "buy=" + (new Date).getTime() +
                "&sms_count=" + $scope.pay.sms_count +
                "&pay_now=" + $scope.pay.pay_now +
                "&p_phone=" + $scope.pay.p_phone;
            smsService.valSms('buy', data).then(applyBuy, e => {
                $scope.isSubmiting = false;
            });
        };

        function applyBuy(r) {
            if (r.success_flag === 1) {
                $scope.pay.sms_count = '';
                $state.go('pay');
            } else {
                if (r.errs) {
                    $scope.errs = r.errs;
                }
            }
        }
    }]);
});
