define(['app'],function(app){
	app.service('titleService',function(hookRunner,storage){
		var self=this;
		self.hooks=[];
		self.pageTitle='Home';
		return({
			setTitle:setTitle,
			getTitle:getTitle,
			setHooks:setHooks
		});
		function setHooks(hook){
		self.hooks.push(hook);
		};
		function setTitle(title){
			self.pageTitle=title;
			hookRunner.exec(self.hooks);
		};
		function getTitle(){
			document.title=	self.pageTitle+' | Churchgram';
		};
	});
});