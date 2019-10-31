define(['app'], function (app) {
    app.controller("a_smsListCtrl", function ($scope, smslist) {
        $scope.sub_title = 'Sent';
        $scope.smslist = [];
        $scope.cur_sms = {};

        $scope.showTemp = (sms) => {
            return 'list-item';
        };
        applyData(smslist);

        function applyData(r) {
            if (r === 'error') {
                return;
            }
            $scope.sub_title = r.sub_title;
            $scope.smslist = r.smslist;

        }

    });
});
