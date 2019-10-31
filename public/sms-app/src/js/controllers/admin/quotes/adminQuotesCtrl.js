define(['app'], function (app) {
    app.controller('adminQuotesCtrl', function ($scope, $timeout, quotes, adminService) {
        $scope.isUpdating = false;
        $scope.isSubmitting = false;
        $scope.quote = {
            body: ''
        };
        $scope.quotes = [];
        $scope.enDis = (updating = false, clr = true) => {
            if (!!$scope.isSubmitting) {
                return;
            }
            $scope.isUpdating = updating;
            if (!!clr) {
                $scope.quote = {
                    body: ''
                };
            }
        };

        function quoteVal(data) {
            adminService.adminVal('quote', data).then(r => {
                $scope.isSubmitting = false;
                if (r.success_flag == 1) {
                    switch (r.action) {
                        case 'create':
                            //add quote at top
                            $scope.quotes.unshift(r.quote);
                            $scope.enDis();
                            break;
                        case 'edit':
                            //update quotes
                            $scope.enDis();
                            break;
                    }

                }
            }, e => {
                $scope.isSubmitting = false;
            });
        }
        $scope.saveQuote = () => {
            $scope.isSubmitting = true;
            let data = 'submit=' + (new Date()).getTime() + '&body=' + $scope.quote.body;
            if (angular.isDefined($scope.quote.id)) {
                data += '&action=edit&id=' + $scope.quote.id;
            } else {
                data += '&action=create';
            }
            quoteVal(data);

        };

        $scope.deleteQuote = (quote) => {
            $scope.isSubmitting = true;
        };
        $scope.editQuote = (quote) => {
            $scope.isSubmitting = true;
        };

        function applyData(r) {
            $scope.isSubmitting = false;
            if (r.quotes) {
                $scope.quotes = r.quotes;
            }
        }
        applyData(quotes);
    });
});
