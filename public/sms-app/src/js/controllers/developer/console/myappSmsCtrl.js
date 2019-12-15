define(['app'], function (app) {
    app.controller('myappSmsCtrl', function ($scope, devService, web_app, $timeout, pageService, $state, pusherService) {
        $scope.myapp = {};
        $scope.isSubmiting = false;
        $scope.channel = null;
        // $scope.del_item = (id) => {
        //     $scope.isSubmiting = true;
        //     let = data = 'submit=' + (new Date()).getTime() + '&app_id=' + $scope.myapp.id + '&id=' + id;
        //     devService.editApp('/stats', data).then(r => {
        //         $scope.isSubmiting = false;
        //     }, e => {
        //         $scope.isSubmiting = false;
        //     });
        // };

        function removeSms(id) {
            angular.forEach($scope.myapp.sms, function (sms, index) {
                if (sms.id === id) {
                    $scope.myapp.sms.splice(index, 1);
                    return;
                }
            });
        }

        function subscribe() {
            $scope.channel = pusherService.privateChannel('WebApp.Sms.' + $scope.myapp.ws_id);

            if ($scope.channel) {
                $scope.channel.bind("webapp.sms_created", function (e) {
                    $scope.myapp.sms.unshift(e);
                    pageService.scroll();
                });
                $scope.channel.bind("webapp.sms_deleted", function (e) {
                    removeSms(e.id);
                });
            }
        }

        function applyApp(r) {
            if (r.web_app) {
                $scope.myapp = r.web_app;
                $timeout(subscribe, 0);
            }
        }

        function unsubscribe() {
            pusherService.privateChannel('WebApp.Sms.' + $scope.myapp.ws_id, true);

            $scope.channel = null;
        }
        applyApp(web_app);
        $scope.$on("$destroy", unsubscribe);
    });
});
