define(['app'],function(app){
	app.controller('phonesingleCtrl',['$scope','group','popService','smsService','$state',function($scope,group,popService,smsService,$state){
		$scope.group={};
		$scope.errs={};
		$scope.allcontacts='';
		$scope.newcontact='';
		$scope.isSubmiting=false;
		applyData(group);
		function applyData(r){
			$scope.group=r.group;
		}
		$scope.removeNo=removeNo;
		$scope.savedata=savedata;
		$scope.openUploader=function(parentSelector){
	        popService.openUpload(parentSelector).then(function(r){
	          uploadIt(r,'upload');
	        },function(e){
	          console.log('Err:',e);
	        });
		};
		
		function removeNo(index){
			$scope.group.contacts.splice(index,1);
		}
		
		function applyRecp(r){      
           $scope.group.contacts=r;
    	}
    	function applyParams(r){  
    		$scope.isSubmiting=false;    
	      if(r.success_flag===1){
	        switch(r.action){	          
	          case 'upload':	          
	          case 'count':
	          applyRecp(r.recipients);
	          break;	          
	        }
	      }else{
	        if (r.errs) {
	          $scope.errs=r.errs;
	        }
	      }
	    }
	    $scope.testResp=function(){
	    	$scope.isSubmiting=true;
	    	$scope.errs={};
	      uploadIt('','count');
	    }
	    function savedata(){
	    	$scope.isSubmiting=true;
	    	$scope.errs={};
	    	if ($scope.group.contacts.length===0) {
	    		$scope.isSubmiting=false;
	    		return;
	    	}
	    	var data="submit="+(new Date).getTime()+"&action=add&id="+$scope.group.id+"&contacts=";
	    	var isFist=true;
	    	angular.forEach($scope.group.contacts,function(contact, index){
	    		if (!isFist) {
	    			data+=",";
	    		}
	    		data+=contact;
	    		isFist=false;
	    	});
	    	smsService.valSms('phonebook',data).then(function(r){
	    		$scope.isSubmiting=false;
	    		if (r.success_flag===1) {
	    			$state.go('phonebook.all');
	    		}else{
	    			if (r.errs) {
			          $scope.errs=r.errs;
			        }
	    		}
	    		
	    	},function(e){
	    		$scope.isSubmiting=false;
	    	});
	    }
	    $scope.emptyResp=()=>{
	    	$scope.group.contacts=[];
	    };
    	function uploadIt(r,action){
    		$scope.isSubmiting=true;
    		let data='submit='+(new Date).getTime()+'&action='+action;
		      if (!!$scope.group.contacts&&$scope.group.contacts.length) {
		        angular.forEach($scope.group.contacts,function(recipient){
		          r+=','+recipient;
		        });
		      }
		      data+='&contacts='+r;
	      smsService.valSms('calc',data).then(applyParams);
	    }
	}]);
});