define(['app'], function (app) {
    app.controller('smsMe2UCtrl', ['$scope', 'smsService', 'alertService', function ($scope, smsService, alertService) {
        $scope.smsCode = {};
        $scope.user = {};
        $scope.errs = {};
        $scope.curTab = 0;
        $scope.received = [];
        $scope.shared = [];
        $scope.isSubmiting = false;
        reset();
        $scope.reset = reset;
        $scope.removeCode = removeCode;
        $scope.loadSms = function () {
            $scope.isSubmiting = true;
            $scope.errs = {};
            if (!valCode()) {
                $scope.isSubmiting = false;
                return;
            }
            $scope.user = {
                name: '',
                sms: ''
            };
            var data = "submit=1";
            data += "&code=" + $scope.smsCode.voucher_code;
            data += "&action=activate";
            //valSms
            smsService.valSms('m2u', data).then(applyResult, function (e) {
                $scope.isSubmiting = false;
            });
        };
        $scope.setCurTab = setCurTab;
        $scope.loadShare = function (toMe = 0) {
            let wht = "shared";
            if (toMe === 0) {
                wht = "tome";
            }
            smsService.getData("me2u/" + wht).then(applyResult, function (e) {
                $scope.isSubmiting = false;
            });
        };
        $scope.clrShare = function (toMe = false) {
            if (true === toMe) {
                $scope.received = [];
            } else {
                $scope.shared = [];
            }
        };
        $scope.sendSms = function () {
            $scope.isSubmiting = true;
            $scope.errs = {};
            $scope.smsCode.voucher_code = '';
            if (!valSend()) {
                $scope.isSubmiting = false;
                return;
            }
            var data = "submit=1";
            data += "&name=" + $scope.user.name;
            data += "&sms=" + $scope.user.sms;
            data += "&action=initiate";
            smsService.valSms("m2u", data).then(applyResult, function (e) {
                $scope.isSubmiting = false;
            });
        };
        $scope.$on('$destroy', reset);

        function setCurTab(index) {
            $scope.curTab = index;
        }

        function applyResult(r) {
            $scope.isSubmiting = false;
            if (angular.isDefined(r.success_flag)) {
                if (r.success_flag === 1) {
                    if (r.result.curTab) {
                        setCurTab(r.result.curTab);
                    }

                } else {
                    if (r.errs) {
                        $scope.errs = r.errs;
                    }
                }
            }

            if (r.shared) {
                $scope.shared = r.shared;
            }
            if (r.received) {
                $scope.received = r.received;
            }


        }

        function reset() {
            $scope.isSubmiting = false;
            $scope.smsCode = {
                voucher_code: ''
            };
            $scope.user = {
                name: '',
                sms: ''
            };
            $scope.errs = {};
        }

        function removeCode(index, id, voucher_code) {
            $scope.isSubmiting = true;
            //valSms
            let data = 'submit=1&id=' + id + '&code=' + voucher_code;
            data += "&action=del";
            smsService.valSms('m2u', data).then(function (r) {
                $scope.isSubmiting = false;
                if (r.success_flag === 1) {
                    $scope.shared.splice(index, 1);
                }
            }, function (e) {
                $scope.isSubmiting = false;
            });
        }

        function valCode() {

            $scope.smsCode.voucher_code = $scope.smsCode.voucher_code.trim();
            $scope.errs.code = ($scope.smsCode.voucher_code.length === 0) ? ['Field cannot be blank'] : '';
            if ($scope.smsCode.voucher_code.length === 0) {
                alertService.fixThings();
                return false;
            }
            return true;
        }

        function valSend() {

            $scope.errs.name = (!$scope.user.name.length) ? ['Field cannot be black'] : '';
            $scope.errs.sms = (!$scope.user.sms.length) ? ['Field cannot be black'] : (isNaN($scope.user.sms)) ? ['Only Numbers are accepted'] : ($scope.user.sms < 10) ? ['You can send at least 10 SMS.'] : '';
            if (!$scope.user.name.length || isNaN($scope.user.sms) || $scope.user.sms < 10) {
                alertService.fixThings();
                return false;
            }
            return true;
        }
    }])
});
