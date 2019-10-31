define(['app'], function (app) {
    app.controller('buyMdl', ['$uibModalInstance', 'smsService', 'result', function ($uibModalInstance, smsService, result) {
        var $ctrl = this;
        $ctrl.pricepreview = 0;
        $ctrl.smsValues = {};
        $ctrl.pay = {
            sms_count: '',
            pay_now: false,
            p_phone: ''
        };
        $ctrl.errs = {};
        applyData(result);

        function applyData(r) {
            if (r.values) {
                $ctrl.smsValues = r.values;
            }
        }
        $ctrl.getSmsValues = function () {
            smsService.getData('buy').then(function (r) {
                if (r.values) {
                    $ctrl.smsValues = r.values;
                }
            });
        };
        $ctrl.calPreview = function (d) {
            $ctrl.errs = {};
            $ctrl.pricepreview = 0;
            var isSubmit = (d) ? d : false;
            if (!$ctrl.pay.sms_count || isNaN($ctrl.pay.sms_count)) {
                $ctrl.pricepreview = 0;
                if (isSubmit && !$ctrl.pay.sms_count) {
                    $ctrl.errs.sms_count = ["Field cannot be blank"];
                }
                if (isNaN($ctrl.pay.sms_count) && $ctrl.pay.sms_count) {
                    $ctrl.pay.sms_count = '';
                    $ctrl.errs.sms_count = ['Only numeric characters are allowed'];
                }
                $ctrl.pay.sms_count = '';
                return;
            }
            var smscount = Number($ctrl.pay.sms_count);
            // $ctrl.pricepreview=;
            if (isSubmit && smscount < $ctrl.smsValues.minv) {
                $ctrl.errs.sms_count = ['Minimum amount should be ' + $ctrl.smsValues.minp * $ctrl.smsValues.minv];
                return;
            }
            if (smscount <= 1000000) {
                //
                if (smscount <= ($ctrl.smsValues.minv1 - 1)) {
                    $ctrl.pricepreview = smscount * $ctrl.smsValues.minp;
                } else {
                    if (smscount <= ($ctrl.smsValues.minv2 - 1)) {
                        $ctrl.pricepreview = smscount * $ctrl.smsValues.minp1;
                    } else {
                        if (smscount <= $ctrl.smsValues.minv3 - 1) {
                            $ctrl.pricepreview = smscount * $ctrl.smsValues.minp2;
                        } else {

                            if (smscount >= $ctrl.smsValues.minv3) {
                                $ctrl.pricepreview = smscount * $ctrl.smsValues.minp3;
                            }
                        }

                    }

                }
            } else {
                $ctrl.errs.sms_count = ['You have reached our SMS limit'];
                return;
            }
            return true;
        };
        $ctrl.ok = function () {
            $ctrl.errs = "";
            if (!$ctrl.calPreview(1)) {
                return;
            }
            var data = "buy=" + (new Date()).getTime() +
                "&sms_count=" + $ctrl.pay.sms_count +
                "&pay_now=" + true +
                "&p_phone=" + $ctrl.pay.p_phone;
            smsService.valSms('buy', data).then(applyBuy, e => {});

        };
        $ctrl.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function applyBuy(r) {
            if (r.success_flag === 1) {
                $ctrl.pay.sms_count = '';
                $uibModalInstance.close(true);
            } else {
                if (r.errs) {
                    $ctrl.errs = r.errs;
                }
            }
        }
    }]);
});
