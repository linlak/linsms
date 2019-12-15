define(["app", 'pageRoutes'], app => {
    "use strict";
    app.config([
        "$stateProvider",
        function (
            $stateProvider
        ) {
            $stateProvider
                .state("events", {
                    url: "events",
                    parent: "root",
                    abstract: true
                })
                .state("events.all", {
                    url: "",
                    title: 'Events',
                    craw_me: true,
                });
        }
    ]);
});
