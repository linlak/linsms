	define(['app'],function(app){
		app.factory("lazyLoader",function($rootScope,$q,$log){				
		function loadModule(deps,successCallback,errorCallback){
			var self=this;
			self.d=$q.defer();
			self.promise=null;
			self.dep_files=[];
			if(angular.isDefined(deps)){
				self.dep_files=deps;
			}else{
				//throw exception
				$log.log('no deps set');
			}			
			self.successCallback=(successCallback||angular.noop);
			self.errorCallback=(errorCallback||angular.noop);
			self.promise=self.d.promise;
			self.promise.then(self.successCallback,self.errorCallback);
			require(self.dep_files,function requireSucess(){		
				$rootScope.$apply(function(){
					self.d.resolve();
				});
			},function requireError(error){
				$rootScope.$apply(function(){
					self.d.reject(error);
				});
			});
			return(self.promise);
		}
		return ({loadModule:loadModule});
	});
});