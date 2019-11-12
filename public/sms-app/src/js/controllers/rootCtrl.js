define([
    'app'
], function (app) {
    'use strict';
    app.controller('rootCtrl', function (
        $scope,
        navToggleService,
        user,
        authService,
        $log,
        popService,
        $state,
        httpService
    ) {
        $scope.isUser = false;
        $scope.isAdmin = false;
        $scope.isSuper = false;
        $scope.me;
        $scope.isNavCollapsed = false;
        $scope.showSide = false;
        $scope.notfyToggler = false;
        //all unread read
        $scope.notifyShow = 'all';
        $scope.notifications = [];
        $scope.toggleNotify = () => {
            if (!$scope.notfyToggler)
                fetchNotifications();
            navToggleService.toggleVisible("notfyToggler");
        };

        function checkUser() {
            $scope.isUser = user.isLoggedIn();
            $scope.isAdmin = user.isAdmin();
            $scope.isSuper = user.isSuper();
            $scope.me = user;
        }

        function fetchNotifications() {
            let data = 'submit=' + (new Date()).getTime() + '&status=' + $scope.notifyShow;
            httpService.postData('/api/profile/notifications', data).then(r => {
                if (r.notifications) {
                    $scope.notifications = r.notifications;
                }
            }, e => {});
        }
        $scope.toggleCollapse = function () {
            navToggleService.toggleVisible("myNav");
        };
        $scope.toggleSide = function () {
            navToggleService.toggleVisible("sidenav");
        };
        $scope.logout = function () {
            navToggleService.unsetVisible();
            authService.logout();
        };
        $scope.isActive = (glob) => {
            return navToggleService.isActive(glob);
        };
        $scope.openAdmin = function () {
            popService.rightsForm();
        };

        navToggleService.setHook(function () {
            $scope.isNavCollapsed = navToggleService.isVisibleNav(
                "myNav"
            );
            $scope.notfyToggler = navToggleService.isVisibleNav(
                "notfyToggler"
            );
            $scope.showSide = navToggleService.isVisibleNav(
                "sidenav"
            );
        });
        user.setHook("rootCtr", checkUser);
        checkUser();
    });
});
