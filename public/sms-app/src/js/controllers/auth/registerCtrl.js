define(['app'], (app) => {
    'use strict';
    app.controller('registerCtrl', function ($scope, authService, $state /*,sService*/ ) {
        $scope.reg_user = {};
        $scope.isSubmiting = false;
        $scope.errs = {};
        let checkSocial = (crl = false) => {
            if (crl) {
                sService.removeToken();
                return;
            }
            if (sService.isSocial()) {
                $state.go('social');
            }
        };
        // sService.setHook('registerCtrl',checkSocial);
        // checkSocial(true);
        $scope.register = () => {
            $scope.errs = {};
            $scope.isSubmiting = true;
            authService.register($scope.reg_user).then((r) => {
                $scope.isSubmiting = false;
                if (r.success_flag === 1) {
                    let user = $scope.reg_user.email;
                    resetUser();
                    $state.go('success.register');
                } else {
                    if (r.errs) {
                        $scope.errs = r.errs;
                    }
                    $scope.reg_user.password = '';
                    $scope.reg_user.password1 = '';
                    $scope.reg_user.terms = 0;
                }
            });
        };
        let resetUser = () => {
            authService.resetregUser().then((r) => {
                $scope.reg_user = r;
            });
        };
        resetUser();
        // $scope.$on('$destroy',function(){sService.unsetHook('registerCtrl')});
    });
})
