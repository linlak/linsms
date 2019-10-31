define(['app'], function (app) {
    app.controller('myDomainsCtrl', function ($scope, devService, mydomains) {
        $scope.form_visible = false;
        $scope.isSubmiting = false;
        $scope.mydomains = [];
        $scope.mydomain = {};
        $scope.verTag = '<meta name="linsms-site-verification" content="the verification code goes here" />';
        $scope.errs = {};

        function init() {
            $scope.mydomain = {
                host_scheme: '',
                host_name: ''
            };
            $scope.errs = {};
        }
        $scope.createEdit = () => {
            $scope.errs = {};
            $scope.isSubmiting = true;
            let data = 'submit=' + (new Date()).getTime();
            data += '&host_scheme=' + ($scope.mydomain.host_scheme || '');
            data += '&host_name=' + ($scope.mydomain.host_name || '');
            if (!!$scope.mydomain.id) {
                data += '&id=' + $scope.mydomain.id;
            }
            devService.getConsole('domains/store', data).then(applyResult, applyResult);
        };
        $scope.showForm = (isvisible = false) => {
            if (!isvisible) {
                init();
            }
            $scope.form_visible = isvisible;
        };

        $scope.downloadKey = (mydomain) => {};
        $scope.verifyDomain = (mydomain) => {};
        $scope.deleteDomain = (mydomain) => {
            $scope.isSubmiting = true;
            let data = 'submit=' + (new Date()).getTime();
            data += '&id=' + mydomain.id;
            devService.getConsole('domains/destory', data).then(applyResult, applyResult);
        };

        function refDomains() {
            devService.getConsole('domains').then(applyData, applyData);
        }

        function applyResult(r) {

            $scope.isSubmiting = false;

            if (angular.isDefined(r.success_flag)) {
                if (r.success_flag == 1) {
                    $scope.showForm();
                    refDomains();
                } else {
                    if (r.errs) {
                        $scope.errs = r.errs;
                    }
                }
            }
        }

        function applyData(r) {
            if (r.mydomains) {
                $scope.mydomains = r.mydomains;
            }
        }
        applyData(mydomains);
    });
});
