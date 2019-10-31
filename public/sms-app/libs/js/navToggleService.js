define(['app'],function(app){
	app.service('navToggleService',['$log','storage','hookRunner',function($log,storage,hookRunner){
		var self=this;
		self.visibleNav='';
		self.navHooks=[];
		self.openHook=[];
		return({
			setHook:setHook,
			isVisibleNav:isVisibleNav,
			unsetVisible:unsetVisible,
			setVisible:setVisible,
			toggleVisible:toggleVisible,
			opening:opening
		});
		function setHook(navHook){
			self.navHooks.push(navHook);
		};
		function isVisibleNav(navId){
			return  (!!(navId)&&self.visibleNav===navId);
		};
		function unsetVisible(){
			self.visibleNav='';
			applyHooks();
		};
		function setVisible(navId){
			self.visibleNav=(!!navId)?navId:'';
			applyopenHooks();
			applyHooks();
		};
		function toggleVisible(navId){
			if (isVisibleNav(navId)) {
				unsetVisible();
			}else{
				setVisible(navId);
			}
		};
		function opening(hook){
			self.openHook.push(hook);
		};
		function applyopenHooks(){
			hookRunner.exec(self.openHook);
		}
		function applyHooks(){
			hookRunner.exec(self.navHooks);
		}
		window.addEventListener("keyup",function(e){
			var which=e.which;
			if (which===27) {
				self.visibleNav='';
				applyHooks();
			}					
		});
	}]);
});