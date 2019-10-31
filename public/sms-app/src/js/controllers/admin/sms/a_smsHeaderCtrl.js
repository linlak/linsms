define(['app'],function(app){
	app.controller("a_smsHeaderCtrl",function($scope,navr){
		$scope.sub_header='Administration';
		$scope.nav=[];
		applyData(navr);
		function applyData(r){							
			if (r==='error') {
				return;
			}
			$scope.sub_header=r.sub_header;
			if (r.found) {
				$scope.nav=r.nav;
			}

		}
	});
});