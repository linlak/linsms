define(['app'], function (app) {
    app.controller('myappStatsCtrl', function ($scope, devService, web_app, $timeout, pageService, $state, pusherService) {
        $scope.myapp = {};
        $scope.isSubmiting = false;
        $scope.channel = null;
        $scope.del_item = (id) => {
            $scope.isSubmiting = true;
            let = data = 'submit=' + (new Date()).getTime() + '&app_id=' + $scope.myapp.id + '&id=' + id;
            devService.editApp('/stats', data).then(r => {
                $scope.isSubmiting = false;
            }, e => {
                $scope.isSubmiting = false;
            });
        };

        function removeStats(id) {
            angular.forEach($scope.myapp.stats, function (stat, index) {
                if (stat.id === id) {
                    $scope.myapp.stats.splice(index, 1);
                    return;
                }
            });
        }

        function subscribe() {
            $scope.channel = pusherService.privateChannel('WebApp.Stats.' + $scope.myapp.ws_id);

            if ($scope.channel) {
                $scope.channel.bind("webapp.stat_created", function (e) {
                    $scope.myapp.stats.unshift(e);
                    pageService.scroll();
                });
                $scope.channel.bind("webapp.stat_deleted", function (e) {
                    removeStats(e.id);
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
            pusherService.privateChannel('WebApp.Stats.' + $scope.myapp.ws_id, true);

            $scope.channel = null;
        }
        applyApp(web_app);
        $scope.$on("$destroy", unsubscribe);
    });
});
