define(['app'], function (app) {
    app.controller('newsCtrl', function ($scope, adminService, news = null) {
        $scope.news = {
            id: 1,
            title: 'the title',
            short_desc: 'this is my short description',
            images: 0,

        };
        $scope.imageBackend = '/api/gallery';
        $scope.addImages = () => {};
        $scope.saveNews = () => {};

        function applyData(r) {
            if (null !== r && r.news) {
                $scope.news = r.news;
            }
        }
        applyData(news);
    });
});
