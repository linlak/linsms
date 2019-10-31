define(['app'],function(app){
	app.controller('contactsMdl',['$uibModalInstance',function ($uibModalInstance) {
      var $ctrl = this;
      $ctrl.nos='';
      $ctrl.err="";
      $ctrl.getContent=function($fileContent){
        $ctrl.nos=$fileContent;
      };
      $ctrl.ok = function () {
      	$ctrl.err="";
      	var vals=false;
      	if (!$ctrl.nos.length) {
      		$ctrl.err="File is required";
      		return;
      	}
        $uibModalInstance.close($ctrl.nos);
      };
      $ctrl.cancel = function () {
        $uibModalInstance.dismiss();
      };
}]);
});