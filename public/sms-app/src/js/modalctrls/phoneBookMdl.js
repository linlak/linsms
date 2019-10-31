define(['app'],function(app){
	app.controller('phoneBookMdl',['$scope','$uibModalInstance','groups',function($scope,$uibModalInstance,groups){
		let $ctrl=this;
		$ctrl.check_all=0;
		 $ctrl.error=false; 
		$ctrl.selection=[];
		$ctrl.groups=[];
		$ctrl.retry=()=>{};
		$ctrl.check_change=()=>{
			if ($ctrl.selection.length===$ctrl.groups.length) {
	          $ctrl.check_all=1;
	        }else{
	          $ctrl.check_all=0;
	        }
		};
		$ctrl.check_selected=()=>{
			var groups=[];
	        if (0==$ctrl.check_all) {
	          $ctrl.selection=groups;
	        }else{
	          angular.forEach($ctrl.groups,function(group){
	            groups.push(group.id);
	          });
	          $ctrl.selection=groups;
	        }
		};
		
		$ctrl.ok=function(){
			$ctrl.err="";
      	var vals=false;
      	if (!$ctrl.selection.length) {      		
      		return;
      	}
        $uibModalInstance.close($ctrl.selection);
		};
		$ctrl.cancel=function(){
			$uibModalInstance.dismiss();
		};
		function applyData(r){
        if (r==='error') {
          $ctrl.error=true;
        }
        if (r.groups) {
          $ctrl.groups=r.groups;
          $ctrl.error=false;
        }
      }
      applyData(groups);
	}]);
});