define(['app'],function(app){
	app.controller('socialCtrl',function($scope,pageService,sService,$timeout,$state,tkdata){
		$scope.errs={};
		$scope.level=1;
		$scope.accNew={};
		$scope.user={};
		$scope.acc={};
		$scope.isSubmiting=false;

		$scope.accLevel=(level,crl=false)=>{
			if ($scope.level===level) {
				return;
			}
			if (crl) {
				if (1===level) {$scope.accNew={};$scope.acc={};}
				if (2===level) {$scope.accNew={};$scope.acc={pass:'',email:''};}
				if (3===level) {$scope.accNew={pass:'',pass1:''};$scope.acc={};}
			}			
			$scope.level=level;
			pageService.scroll();
		};
		let applyData=(r)=>{
			$scope.isSubmiting=false;
			if (r.to_level) {
				$scope.accLevel(r.to_level.level,r.to_level.crl);
			}
			if (r.user) {
				$scope.user=r.user;
			}
		};
		let applySubimit=(r)=>{
			$scope.isSubmiting=false;
			if (angular.isDefined(r.success_flag)) {
				if (r.success_flag===1) {}else{
					if (r.errs) {
						$scope.errs=r.errs;						
					}
					if ($scope.level===3) {
						$scope.accNew={pass:'',pass1:''};
					}
					if ($scope.level===2) {
						$scope.acc.pass='';
					}
				}
			}
		};
		$scope.accLink=()=>{
			$scope.accLevel(2,true);
		};
		$scope.newAcc=()=>{
			$scope.accLevel(3,true);
		};
		$scope.loadTemp=()=>{
			if ($scope.level===1) {
				return 'opt-form';
			}else if ($scope.level===2) {
				return 'acc-link';
			}else if ($scope.level===3) {
				return 'acc-create';
			}
			return 'opt-form';
		};
		$scope.submitAcc=()=>{
			$scope.isSubmiting=true;
			let data = 'submit='+(new Date()).getTime()+'&action=new-account&pass='+$scope.accNew.pass+'&pass1='+$scope.accNew.pass1;
			sService.getEdit(data).then(applySubimit,applySubimit);
		};
		$scope.accSubmit=()=>{
			$scope.isSubmiting=true;
			let data = 'submit='+(new Date()).getTime()+'&action=link-account&pass='+$scope.acc.pass+'&email='+$scope.acc.email;
			sService.getEdit(data).then(applySubimit,applySubimit);
		};
		let loadUser=()=>{	
			$scope.isSubmiting=true;
			if (!sService.isSocial()&&!user.isLoggedIn()) {
				$timeout(function() {
					$state('login');
				}, 100);
				return;
			}
			let data="submit="+(new Date()).getTime()+'&action=fetch';		
			sService.getEdit(data).then(applyData,applyData);
		};
		applyData(tkdata);
		sService.setHook('socialCtrl',loadUser);
		$scope.$on('$destroy',function(){sService.unsetHook('socialCtrl')});
	});
});