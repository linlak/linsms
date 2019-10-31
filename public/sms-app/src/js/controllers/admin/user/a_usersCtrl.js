define(["app"], function(app) {
    app.controller("a_usersCtrl", [
        "$scope",
        "users",
        "adminService",
        "user",
        "$timeout",
        function($scope, users, adminService, user, $timeout) {
            $scope.users = [];
            $scope.title;
            $scope.cur_user = {};
            $scope.curIndex = undefined;
            $scope.l_user = user;
            applyUsers(users);

            function applyUsers(r) {
                if (r.title) {
                    $scope.title = r.title;
                }

                if (r.users) {
                    $scope.users = r.users;
                }
            }

            $scope.showUser = (user, index) => {
                if (angular.isDefined($scope.cur_user.id)) {
                    return;
                }
                $scope.curIndex = index;
                adminService.getData("user/" + user.id).then(
                    r => {
                        if (r.user) {
                            $scope.cur_user = r.user;
                        }
                    },
                    e => {
                        $scope.cur_user = {};
                        $scope.curIndex = undefined;
                    }
                );
            };

            $scope.cancelDet = () => {
                $timeout(() => {
                    $scope.cur_user = {};
                }, 100);
            };

            $scope.showTemp = (user, index) => {
                if (
                    angular.isDefined($scope.cur_user.id) &&
                    $scope.curIndex === index
                ) {
                    return "user-details";
                }
                return "list";
            };

            $scope.notify = () => {
                editUser("notify");
            };

            $scope.romove = () => {
                editUser("del");
            };

            $scope.suspendUser = () => {
                editUser("suspend");
            };

            $scope.enUser = () => {
                editUser("enable");
            };

            function editUser(action) {
                let data =
                    "submit=" +
                    new Date().getTime() +
                    "&action=" +
                    action +
                    "&id=" +
                    $scope.cur_user.id;
                adminService.adminVal("user", data).then(
                    r => {
                        if (r.success_flag === 1) {
                            $scope.cancelDet();
                            adminService
                                .getData("users")
                                .then(applyUsers, e => {});
                        }
                    },
                    e => {}
                );
            }
        }
    ]);
});
