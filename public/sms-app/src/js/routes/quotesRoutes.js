define(["app", "pageRoutes"], app => {
    "use strict";
    app.config([
        "$stateProvider",
        function (
            $stateProvider
        ) {
            $stateProvider
                .state("inspire", {
                    parent: "root",
                    url: "inspiration",
                    abstract: true,
                })
                .state("inspire.home", {
                    url: "",
                })
                .state("quotes", {
                    url: "/quotes",
                    parent: "inspire",
                    abstract: true
                })
                .state("quotes.all", {
                    url: "",
                    title: 'Quotes',
                    craw_me: true,
                });
        }
    ]);
});
