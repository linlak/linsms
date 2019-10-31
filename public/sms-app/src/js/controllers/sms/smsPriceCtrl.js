// 
define(['app'],function(app){
	app.controller('smsPriceCtrl',['$scope','prices',function($scope,prices){
		$scope.smsPriceList=[];
		getPrices(prices);
		function getPrices(r){
				$scope.smsPriceList=r.priceList;
			
		}
	}]);
});