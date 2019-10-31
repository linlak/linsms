define(['app'], function (app) {
    app.controller('verifictionCtrl', function ($scope, $stateParams, $state, httpService) {
        $scope.v_code = {
            code: ''
        };
        $scope.isSubmiting = false;
        $scope.send = function () {
            $scope.errs = {};
            if (!!$scope.v_code.code) {
                $scope.isSubmiting = true;
                let data = 'submit=' + (new Date()).getTime() + '&v_code=' + $scope.v_code.code;
                httpService.postData('/api/verification-code', data)
                    .then(r => {
                        $scope.isSubmiting = false;
                        if (r.success_flag == 1) {
                            //redirect
                            redTo(r.toState);
                        } else {
                            if (r.errs) {
                                $scope.errs = r.errs;
                            }
                        }
                    }, e => {
                        $scope.isSubmiting = false;
                    });
            }
        };

        function redTo(toState) {
            $state.go(toState.to, toState.params || {});
        }

        function applyParams(params) {
            if (angular.isDefined(params.code) && params.code != null) {
                $scope.v_code.code = params.code;
            }
        }
        applyParams($stateParams);
    });
});
