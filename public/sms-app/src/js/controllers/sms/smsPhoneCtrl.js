define(['app'], function (app) {
    app.controller('smsPhoneCtrl', ['$scope', 'smsService', 'user', 'groups', '$state', 'pageService', function ($scope, smsService, user, groups, $state, pageService) {
        $scope.phn = {};
        $scope.groups = [];
        $scope.el = {
            selection: []
        };
        $scope.errs = {};
        $scope.check_all = 0;
        $scope.isSubmiting = false;
        emptyForm();
        applyGroups(groups);

        function emptyForm() {
            $scope.isSubmiting = false;
            $scope.errs = {};
            $scope.phn = {
                group: '',
                action: 'Create'
            };
        }
        $scope.useGroups = function () {
            $state.go('send', {
                id: $scope.el.selection,
                action: 'usephonebook'
            });
        };
        $scope.editItem = function (item) {
            emptyForm();
            $scope.phn = {
                id: item.id,
                group: item.title,
                action: 'Edit'
            };
            pageService.scroll();
        };
        $scope.check_change = function () {
            if ($scope.el.selection.length == $scope.groups.length) {
                $scope.check_all = 1;
            } else {
                $scope.check_all = 0;
            }

        };
        $scope.exportGroup = (grp) => {
            $scope.isSubmiting = true;
            smsService.getData('export',
                "id=" + grp.id
            ).then(r => {
                $scope.isSubmiting = false;
            }, e => {
                $scope.isSubmiting = false;
            });
        };
        $scope.addSelection = function () {
            var grps = [];
            if ($scope.check_all === 0) {
                $scope.el.selection = grps;
            } else if ($scope.check_all === 1) {
                angular.forEach($scope.groups, function (group) {
                    grps.push(group.id);
                });
                $scope.el.selection = grps;
            }
        };
        $scope.deleteItems = function (index) {
            $scope.isSubmiting = true;
            emptyForm();
            var item = $scope.groups[index];
            var data = "submit=" + (new Date()).getTime() + "&action=delete";
            data += "&id=" + item.id;
            smsService.valSms('phonebook', data).then(applySuccess, function (e) {
                $scope.isSubmiting = false;
            });
        };
        $scope.deleteSelection = function () {
            $scope.isSubmiting = true;
            if ($scope.el.selection.length === 0) {
                $scope.isSubmiting = false;
                return;
            }

            var data = "submit=" + (new Date()).getTime() + "&action=delete";
            angular.forEach($scope.el.selection, function (item, index) {
                data += "&id[" + index + "]=" + item;
            });

            smsService.valSms('phonebook', data).then(applySuccess, function (e) {
                $scope.isSubmiting = false;
            });
        }
        $scope.saveItem = function () {
            $scope.isSubmiting = true;
            // validation here
            var data = "submit=" + (new Date).getTime();
            if ($scope.phn.action == 'Create') {
                data += "&action=create";
            } else {
                data += "&action=edit";
                data += "&id=" + $scope.phn.id;
            }
            data += "&title=" + $scope.phn.group;
            smsService.valSms('phonebook', data).then(applySuccess, function (e) {
                $scope.isSubmiting = false;
            });
        };

        function applySuccess(r) {
            $scope.isSubmiting = false;
            if (r.success_flag === 1) {
                refresh();
            } else {
                if (r.errs) {
                    $scope.errs = r.errs;
                }
            }
        }

        function refresh() {
            $scope.isSubmiting = true;
            smsService.getData('phonebook').then(applyGroups, function (e) {
                $scope.isSubmiting = false;
            });
        }

        function updateItem(r) {
            if (!angular.isObject(r)) {
                return;
            }
            angular.forEach($scope.groups, function (group) {
                if (group.id == r.id) {
                    group.title = r.title;
                }
            });
            return true;
        }

        function addItem(r) {
            if (!angular.isObject(r)) {
                return;
            }
            $scope.groups.unshift({
                id: r.id,
                title: r.title
            });
            return true;
        }

        function applyGroups(r) {
            $scope.el.selection = [];
            $scope.check_all = 0;
            if (r.groups) {
                $scope.groups = r.groups;
            }
            emptyForm();
        }
    }]);
});
