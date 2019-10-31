define(['app'], function (app) {
    app.controller('smsSentCtrl', function ($scope, recentSms, smsService, $timeout, $log) {
        $scope.msgs = [];
        $scope.msge = {};
        $scope.curIndex = undefined;
        $scope.loadMain = (me) => {
            if (me.hasSMS()) {
                if ($scope.msgs.length > 0) {
                    return 'sms-list';
                }
                return 'no-sms';
            }
            return 'no-pay';
        };
        $scope.listTemp = (msg, index) => {
            if (angular.isDefined($scope.msge.id) && $scope.curIndex === index) {
                return 'sms-details';
            }
            return 'sms-list-item';
        };

        function applyData(r) {
            if (r.msgs) {
                $scope.msgs = r.msgs;
            }

        }
        applyData(recentSms);
        $scope.cancelSMS = () => {
            $timeout(function () {
                $scope.curIndex = undefined;
                $scope.msge = {};
            }, 100);
        };
        /*$scope.calRows=()=>{
        	if ($scope.msge.recipients.length>15) {
        		return (Math.floor($scope.msge.recipients.length/6)-5);
        	}
        	return 3;
        };*/
        $scope.loadSMS = (id, index) => {
            //sent-single
            if (angular.isDefined($scope.msge.id)) {
                return;
            }
            $scope.curIndex = index;
            smsService.getData('sent-single/' + id).then(r => {
                if (r.sms) {
                    $scope.msge = r.sms;
                }
            }, e => {
                $scope.curIndex = undefined;
                $scope.msge = {};
            });
        };
    });
});
