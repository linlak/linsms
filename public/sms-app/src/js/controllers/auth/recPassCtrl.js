define(['app'],function(app){
	app.controller('recPassCtrl',function($scope,$state,$timeout,authService){
		$scope.pass={username:''};
		$scope.errs={};
		$scope.isSubmiting=false;
		let enSub=()=>{
			$scope.isSubmiting=true;
		};
		let disSub=()=>{
			$scope.isSubmiting=false;
		};
		let goto_success=()=>{
			$state.go('success.pass');
		};
		let applySub=(r)=>{
			$scope.errs={};
			disSub();
			if (angular.isDefined(r.success_flag)) {
				if (r.success_flag===1) {
					goto_success();
				}else{
					if (r.errs) {
						$scope.errs=r.errs;
					}
				}
			}
		};
		$scope.send=()=>{
			
			enSub();
			authService.recover($scope.pass).then(applySub,applySub);			
		};
	});

});