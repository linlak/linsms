define(['app'],function(app){
	app.controller("a_tryitCtrl",function($scope,tryit){
		$scope.sub_title='Trials';
		$scope.try=[];
		applyData(tryit);
		function applyData(r){
			if (r==='error') {
				return;
			}
			$scope.sub_title=r.sub_title;
			if (r.found) {
				$scope.try=r.try;
			}
		}
	});
});