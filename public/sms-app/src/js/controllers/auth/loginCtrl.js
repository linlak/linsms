define(['app'], (app) => {
    'use strict';
    app.controller('loginCtrl', function ($scope, authService, $stateParams, $log, $state, $timeout) {
        $scope.auth_user = {};
        $scope.errs = {};
        $scope.isSubmiting = false;
        let checkSocial = (crl = false) => {
            if (crl) {
                sService.removeToken();
                return;
            }
            if (sService.isSocial()) {
                $state.go('social');
            }
        };
        // sService.setHook('loginCtrl',checkSocial);
        // checkSocial(true);
        $scope.perform_login = () => {
            $scope.isSubmiting = true;
            $scope.errs = {};
            authService.login($scope.auth_user).then((r) => {
                $scope.isSubmiting = false;
                if (r.success_flag === 1) {
                    resetUser();
                } else {
                    if (r.errs) {
                        $scope.errs = r.errs;
                    }
                    $scope.auth_user.password = '';
                }
            }, (e) => {
                $scope.isSubmiting = false;
            });
        };
        let applyParams = () => {
            $scope.auth_user.email = $stateParams.email;
        };
        let resetUser = () => {
            authService.resetUser().then((r) => {
                $scope.auth_user = r;
            });
            $scope.errs = {};
        }
        resetUser();
        // $timeout(applyParams,5);
        // $scope.$on('$destroy',function(){sService.unsetHook('loginCtrl')});
    });
})
