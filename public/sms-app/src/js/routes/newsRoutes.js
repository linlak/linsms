define(["app", "pageRoutes"], app => {
    "use strict";
    app.config([
        "$stateProvider",
        function (
            $stateProvider
        ) {
            $stateProvider
                .state("news", {
                    url: "news",
                    parent: "root",
                    abstract: true
                })
                .state("news.all", {
                    url: "",
                    title: 'News',
                    craw_me: true,
                })
                .state("jobs", {
                    url: "jobs",
                    parent: "root",
                    abstract: true
                })
                .state("jobs.all", {
                    url: "",
                    title: 'Jobs',
                    craw_me: true,
                });
        }
    ]);
});
