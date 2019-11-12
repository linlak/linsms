define(['app'], function (app) {
    app.controller('adminCtrl', function ($scope, navToggleService, titleService) {
        $scope.sub_header = 'Adminstration Page';
        $scope.showAdminSide = false;
        $scope.toggleadminSide = () => {
            navToggleService.toggleVisible("adminnav");
        };
        navToggleService.setNamedHook(
            "admin",
            function () {
                $scope.showAdminSide = navToggleService.isVisibleNav(
                    "adminnav"
                );
            }
        );
        titleService.setnamedHook('admin_title', function () {
            $scope.sub_header = titleService.getTitle(false);
        });
        $scope.$on("$destroy", () => {
            titleService.deleteHook('admin_title');
            navToggleService.unsetHook("admin");
        });
    });
});
