define(['app'],function(app){
	app.controller("a_smsSentDet",function($scope,sms){
		$scope.sub_title='Sent';
		$scope.sms=[];
		applyData(sms);
		function applyData(r){
			if (r==='error') {
				return;
			}
			$scope.sub_title=r.sub_title;
			if (r.found) {
				$scope.sms=r.sms;
			}
		}
	});
});