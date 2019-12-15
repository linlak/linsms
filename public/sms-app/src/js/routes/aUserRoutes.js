define(["app", 'pageRoutes'], app => {
    "use strict";
    app.config([
        "$stateProvider",
        function (
            $stateProvider
        ) {
            $stateProvider
                //users
                .state("a_users", {
                    url: "/users",
                    parent: "admin",
                    abstract: true
                })
                .state("a_users.all", {
                    url: "",
                    auth: true,
                    views: {
                        "admin@admin": {
                            templateUrl: "/sms-temps/admin/users/users-list.html",
                            controller: "a_usersCtrl"
                        }
                    },
                    admin: true,
                    isSuper: true,
                    title: "User Acounts",
                    resolve: {
                        loadit: function (lazyLoader) {
                            return lazyLoader.loadModule(["a_usersCtrl"]);
                        },
                        users: function (adminService) {
                            return adminService.getData("users");
                        }
                    }
                });
        }
    ]);
});
