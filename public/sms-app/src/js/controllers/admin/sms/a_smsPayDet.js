define(['app'],function(app){
	app.controller("a_smsPayDet",function($scope,pay,adminService){
		$scope.sub_title='Payment';
		$scope.pay={};
		$scope.errs={};
		$scope.susPay={};
		$scope.verPay={};
		applyData(pay);
		resetVer();
		$scope.reActivate=function(){
			if (!$scope.pay.p_id) {return;}
			data='submit=1&action=reactivate&p_id='+$scope.pay.p_id;
			adminService.smsPayActions(data).then(applySubmit);
		};
		$scope.verifyPay=function(){
			$scope.errs={};
			if (!$scope.pay.p_id) {return;}
			var data="submit=1&action=activate&p_id="+$scope.pay.p_id+"&p_ref="+$scope.pay.p_ref;
			data+="&ntwk="+$scope.verPay.ntwk+"&p_phone="+$scope.verPay.p_phone+"&trans_id="+$scope.verPay.trans_id;
			adminService.smsPayActions(data).then(applySubmit);
		};
		function resetVer(){
			$scope.errs={};
			$scope.verPay={
				ntwk:'',
				p_phone:'',
				trans_id:''
			};
		}
		$scope.suspendPay=function(){
			if (!$scope.pay.p_id) {return;}
			$scope.errs={};
			var data="submit=1";
			data+='&p_id='+$scope.pay.p_id;
			data+="&action=suspend";
			if (!!$scope.susPay.reason) {
				data+="&reason="+($scope.susPay.reason||'');
			}else{
				$scope.errs.reason="Field is required";
				return;
			}
			
			adminService.smsPayActions(data).then(applySubmit);
		};
		function applyData(r){
			if (r==='error') {
				return;
			}
			$scope.sub_title=r.sub_title;
			if (r.found) {
				$scope.pay=r.pay;
			}
		}
		function applySubmit(r){
			console.log(r);
			if (r.successflag===1) {
				adminService.getPayDetails({page:$scope.pay.p_ref}).then(applyData);
			}
			if (r.errs) {
				$scope.errs=r.errs;
			}
		}
	});
});