define(['app'], function (app) {
    app.controller('smsSendCtrl', ['$scope', '$stateParams', 'user', 'smsService', 'popService', '$log', 'smscal', 'smsparams', '$state', 'uibDateParser', function ($scope, $stateParams, user, smsService, popService, $log, smscal, smsparams, $state, uibDateParser) {

        $scope.cal = {};
        $scope.errs = {};
        $scope.isSubmiting = false;
        $scope.msg = {
            sender_id: '',
            recipients: [],
            message: '',
            shouldQueue: false,
            hours: 0,
            minutes: 0
        };
        $scope.picker = {};
        $scope.openCalendar = function (e, picker) {
            $scope.picker.open = true;
        };
        // $scope.sender=user;
        applysmscal(smscal);
        applyParams(smsparams);
        $scope.buyMore = function () {
            popService.buyMore().then(r => {}, e => {});
        };
        $scope.showTemp = function (me) {
            if (!me.hasSMS()) {
                return 'no-pay';
            }
            if (!me.getUsable()) {
                return 'suspend';
            }
            if (!me.getSMS() > 0) {
                return 'no-sms';
            }
            return 'send-form';
        };
        $scope.openUploader = function (parentSelector) {
            popService.openUpload(parentSelector).then(function (r) {
                uploadIt(r, 'upload');
            }, function (e) {
                // $log.warn('Err:', e);
            });
        };
        $scope.onPhone = function (parentSelector) {
            popService.openPhone(parentSelector).then(function (r) {
                let data = 'submit=' + (new Date()).getTime() + '&action=usephonebook';
                angular.forEach(r, function (id, index) {
                    data += '&id[' + index + ']=' + id;
                });
                smsService.valSms('calc', data).then(applyParams, applyParams);
            }, function (e) {
                // $log.warn('Err:', e);
            });
        };

        /* $scope.$on('$destroy',function(){
         smsService.cancelCheck();
         });*/
        $scope.testResp = function () {
            uploadIt('', 'count');
        };
        $scope.sendSms = function () {
            $scope.errs = {};
            $scope.isSubmiting = true;
            //show model
            popService.confirmSend($scope.msg, $scope.cal).then(r => {
                let data = "submit=" + (new Date()).getTime();
                data += "&message=" + ($scope.msg.message || '');
                data += "&sender_id=" + ($scope.msg.sender_id || '');
                data += "&recipients=" + $scope.msg.recipients;

                if ($scope.msg.shouldQueue) {
                    data += "&shouldQueue=" + $scope.msg.shouldQueue;
                    data += "&hours=" + $scope.msg.hours;
                    data += "&minutes=" + $scope.msg.minutes;
                }

                smsService.valSms('send', data).then(applyParams, applyParams);
            }, e => {
                $scope.isSubmiting = false;
            });


        };
        // smsService.chechUpdate(checkBalance);
        function checkBalance() {
            smsService.checkbalance().then(applysmscal);
        }

        function uploadIt(r, action) {
            let data = 'submit=' + (new Date()).getTime() + '&action=' + action;
            if (!!$scope.msg.recipients && $scope.msg.recipients.length) {
                angular.forEach($scope.msg.recipients, function (recipient) {
                    r += ',' + recipient;
                });
            }
            data += '&contacts=' + r;
            smsService.valSms('calc', data).then(applyParams, applyParams);
        }

        function applysmscal(r) {
            $scope.isSubmiting = false;
            if (r.cal) {
                $scope.cal = r.cal;
            }
        }

        function applyParams(r) {
            $scope.isSubmiting = false;
            if (!angular.isDefined(r.success_flag)) {
                return;
            }
            if (r.success_flag === 1) {
                switch (r.action) {
                    case 'resend':
                        // $scope.msg = r.sms;
                        angular.extend($scope.msg, r.sms);
                        break;
                    case 'reuse':
                    case 'usephonebook':
                    case 'upload':
                        applyRecp(r.recipients);
                        break;
                    case 'count':
                        applyRecp(r.recipients);
                        break;
                    case 'send':
                        applySend(r);
                        break;
                }
            } else {
                if (r.errs) {
                    $scope.errs = r.errs;
                }
            }
        }

        function applySend(r) {
            $scope.isSubmiting = false;
            if (r.queued) {
                $state.go('pending');
            } else {
                $state.go('sent');
            }
        }

        function applyRecp(r, clear) {
            $scope.isSubmiting = false;
            $scope.msg.recipients = r;
        }
    }]);

});
