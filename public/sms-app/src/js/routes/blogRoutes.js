define(["app", "pageRoutes"], app => {
    "use strict";
    app.config([
        "$stateProvider",
        function (
            $stateProvider
        ) {
            $stateProvider
                //blogs
                .state("blog", {
                    url: "blog",
                    parent: "root",
                    abstract: true
                })
                .state("blog.all", {
                    url: "",
                    title: 'Blog',
                    craw_me: true,
                })
                .state("blog.cats", {
                    url: "{cat_link}",
                    title: 'Blog',
                    craw_me: true,
                })
                .state("blog.single", {
                    url: "/{id}/{slug}",
                    title: 'Blog',
                    craw_me: true,
                });
        }
    ]);
});
