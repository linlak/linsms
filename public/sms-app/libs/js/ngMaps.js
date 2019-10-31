(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    factory(require('angular'));
    module.exports = 'ngMaps';
  } else {
    factory(root.angular);
  }
}(this,function(angular){
	'use strict';
	angular = (angular && angular.module ) ? angular : window.angular;
	return angular.module('ngMaps',['ui.bootstrap'])
	.provider('$gmaps',function(){
		var apiKey;
		return({
			setApiKey:function(value){
				apiKey=value;
			},
			$get:function($q,$window,$timeout){
				return({
					apiKey:apiKey,
					renderMap:function(){
					var deferred=$q.defer();
					if (angular.isUndefined($window.google) ||
		            angular.isUndefined($window.google.maps) ||
		            angular.isUndefined($window.google.maps.places) ||
		            angular.isUndefined($window.google.maps.places.Autocomplete)) {
							var s = document.createElement('script')  
				        	s.src = "//maps.googleapis.com/maps/api/js?key="+apiKey+"&libraries=geometry,places&language=en&callback=initMap"; 
				        	document.body.appendChild(s); 
						}else{
							initMap();
						}
						$window.initMap=function(){
							deferred.resolve();
						}
					    return deferred.promise
					}
				});
			}
		});
	})
	.service('Map',['$q','$gmaps','$log','myLocation',function($q,$gmaps,$log,myLocation){
		var self=this;
		self.map;
		self.places;
		self.marker;
		return({
			init:init,
			search:search,
			addMarker:addMarker
		});
		
		function init(){
			var center={};
			myLocation.getLoc().then(function(r){center=r});
			$gmaps.renderMap().then(function(){
				
				var options={
					center:new google.maps.LatLng(center),
					zoom:13,
					disableDefaultUI:true
				};
				self.map=new google.maps.Map(document.getElementById('map'),options);
				self.places=new google.maps.places.PlaceService(self.map);
			});
		}
				
		function search(str){
			var d=$q.defer();
			if (self.places)
			self.places.textSearch({query:str},
				function(results,status){
					if (status=='OK') {
						$log.info('Map search',status,results);
						d.resolve(results[0]);
					}else d.reject(status);
				});
				else
					d.reject('none');
			return d.promise;
		}
		function addMarker(res){
			if (self.marker) 
				self.marker.setMap(null);			
			self.marker=new google.maps.Marker({
				map:self.map,
				position:res.geometry.location,
				animation:google.maps.Animation.DROP
			});
			self.map.setCenter(res.geometry.location);
		}
	}])	
	.directive('mapContainer',['$log',function($log){
		return({
			restrict:'A',
			scope:{
				param:'=',
				getcode:'&'
			},
			controller:function($scope,$element,$attrs,$gmaps,$compile,$rootScope,myLocation,$q,$log)
			{
				$scope.markers=[];
				$scope.renderCallBack=false;
				$scope.onMapClicked=false;
				var method=function(){
					var initAtrribute=function(){
						if (!angular.isDefined($scope.param)) {
							$log.info('param not defined');
							$scope.param={};
						}
						if (!angular.isDefined($scope.param.height)) {
							$scope.param.height='100%';
						}
						if (!angular.isDefined($scope.param.width)) {
							$scope.param.width='100%';
						}
						if (!angular.isDefined($scope.param.autoZoom)) {
							$scope.param.autoZoom=true;
						}
						if (!angular.isDefined($scope.param.allowMultipleMark)) {
							$scope.param.allowMultipleMark=true;
						}
						if (!angular.isDefined($scope.param.eneblePlaces)) {
							$scope.param.eneblePlaces=false;
						}
						if (angular.isDefined($scope.param.onMapClicked)) {
							if (angular.isFunction($scope.param.onMapClicked)) {
								$scope.onMapClicked=$scope.param.onMapClicked;
							}
						}
						if (angular.isUndefined($scope.param.zoom)) {
							$scope.param.zoom=12;
						}
						if (angular.isDefined($scope.param.onRender)) {
							if (angular.isFunction($scope.param.onRender)) {
								$scope.renderCallBack=$scope.param.onRender;
							}else{
								$scope.renderCallBack=false;
							}
						}
						if(window.google===undefined){$gmaps.renderMap().then(mapConfig);
						}else
						{
							mapConfig();
						}
					}
					var assignMethod=function(){
						$scope.param.method={
							setMark:function(lat,lon,title,desc,center=false){
								setMarker($scope.map,new google.maps.LatLng(lat,lon),title,desc,center);
							},
							clearMarks:function(){
								setMapOnAll(null);								
								$scope.markers.length=0;
							},
							setCenter:setCenter,
							isMap:function(){
								return angular.isDefined($scope.map);
							},
							getMap:function(){
								if ($scope.map===void 0) {
									return undefined;									
								}
								return $scope.map;	
							},
							search:function (str){
								var d=$q.defer();
								if (angular.isDefined($scope.places)){
								$scope.places.textSearch({query:str},
									function(results,status){
										if (status=='OK') {
											d.resolve(results);
										}else {d.reject(status);}
									});}
									else{
										d.reject('none');
									}
								return d.promise;
							},
							searchAuto:function(str){
								var d=$q.defer();
								if (angular.isDefined($scope.autocompleteService)) {

									var service = new google.maps.places.PlacesService($scope.map);
								$scope.autocompleteService.getPlacePredictions(
						              {
						                input: str,
						                offset: str.length
						              },
						              function listentoresult(list, status) {
						              	
						                if(list == null || list.length == 0) {
						                	d.reject(status);
						                }else{
						                	d.resolve(list);		                	
						                	
						                }
						            });
							}else{
								d.reject('none');
							}
								return d.promise;
							},
							getDetails:function(place){
								var d=$q.defer();
								if (place.place_id) {
									$scope.places.getDetails({
										placeId:place.place_id,
										types:["country","city","street_address"]
									},function(results,status){
										if(status === google.maps.places.PlacesServiceStatus.OK){
											d.resolve(results);
										}else{
											d.reject(status);
										}
									});
								}else{
									d.reject('none');
								}
								return d.promise;
							}
						}
					}
					var mapConfig=function(){
							$rootScope.infoWindow=new google.maps.InfoWindow({
								content:''
							});
							$scope.center={lat:0.31628,lng:32.58219};
							myLocation.getLoc().then(function(r){
								$scope.center=r;
							});
							$scope.markers=[];
							$scope.geocoder = new google.maps.Geocoder();
							$scope.trafficLayer = new google.maps.TrafficLayer();
	 						$scope.transitLayer =new google.maps.TransitLayer();
							$scope.mapOptions={
								center:new google.maps.LatLng($scope.center),
								zoom:$scope.param.zoom,
								mapTypeId:google.maps.MapTypeId.ROADMAP,
								scrollwheel:$scope.param.autoZoom
							};
							initMap();
					}
					var initMap=function(){
						if ($scope.map===void 0) {
							$scope.map=new google.maps.Map($element[0],$scope.mapOptions);
							$scope.trafficLayer.setMap($scope.map);
							$scope.transitLayer.setMap($scope.map);
							if (false!==$scope.renderCallBack) {
								google.maps.event.addListenerOnce($scope.map,'tilesloaded',function(e){
									$scope.$apply(function(){
										$scope.renderCallBack();
									});
								});
							}
							if (false!==$scope.onMapClicked) {
								google.maps.event.addListener($scope.map,'click',function(e){
									$scope.$apply(function(){
										var geocoder = new google.maps.Geocoder();
										geocoder.geocode({
											latLng:e.latLng
										},function(results,status){
											if (status===google.maps.GeocoderStatus.OK) {
												$scope.onMapClicked(results[0]);
											}
										});
										
									});									
								});
							}
							if (true===$scope.param.eneblePlaces) {
								$scope.places=new google.maps.places.PlacesService($scope.map);
								$scope.autocompleteService = new google.maps.places.AutocompleteService();
							}
						}
					}
					var setMarker=function(map,position,title,content,center=false,scope=false){
						var marker;
						var markerIcon = {
	 		 				url: '//maps.google.com/mapfiles/ms/icons/green-dot.png',
							scaledSize: new google.maps.Size(40, 40),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(22,65),
							labelOrigin: new google.maps.Point(20,45)
						};
						var markerOptions={
							position:position,
							map:map,
							draggable: false,          					
							label:{
							    text: title,
							    color: "#4682B4",
							    fontSize: "14px",
							    fontWeight: "bold",
						    },
						    visible:true,
							icon:markerIcon
						};
						marker=new google.maps.Marker(markerOptions);
						if (true===center) { 
							setCenter(marker.getPosition());
						}
						if (false===$scope.allowMultipleMark) {
							setMapOnAll(null);						
						}
						$scope.markers.push(marker);						
						google.maps.event.addListener(marker,'click',(function(marker,content,infoWindow,scope){
							return function(){
								var el=angular.element('<div>');
								el.append(content);
								var compiledContent=$compile(el)(scope);
								infoWindow.setContent(compiledContent[0]);
								infoWindow.open($scope.map,marker);
								$scope.map.setCenter(marker.getPosition());
							}							
						})(marker,content,$rootScope.infoWindow,(scope||$scope)));
					}
					var setCenter=function(pos){
						$scope.map.setCenter(pos);
					}
					var setMapOnAll=function setMapOnAll(map) {
							angular.forEach($scope.markers,function(marker,$index){
								marker.setMap(null);
							});
							$scope.markers=[];
					        
      			}
					return({
						initAtrribute:initAtrribute,
						mapConfig:mapConfig,
						assignMethod:assignMethod
					});
				}();
				var init=function(){
					method.initAtrribute();
					method.assignMethod();
				}();
			},
			template:'<div>'
						+'</div>',
			replace:true,
			transclude:true
		});
	}])
	.directive('ngAutocomplete', ['$parse','$log',
        function ($parse,$log) {
          
            function convertPlaceToFriendlyObject(place) {
                var result = undefined;
                if (place) {
                    result = {};
                    $log.info('convertPlaceToFriendlyObject-place',place);

                    for (var i = 0, l = place.address_components.length; i < l; i++)
                     {
                        if (i == 0) {
                            result.searchedBy = place.address_components[i].types[0];
                        }
                        result[place.address_components[i].types[0]] = place.address_components[i].long_name;
                    }
                    result.formattedAddress = place.formatted_address;
                    result.lat = place.geometry.location.lat();
                    result.lng = place.geometry.location.lng();
                }
                return result;
            }

            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, $ctrl) {
                    
                    if (!angular.isDefined($attrs.details)) {
                        throw '<ng-autocomplete> must have attribute [details] assigned to store full address object';
                    }

                    var getDetails = $parse($attrs.details);
                    var setDetails = getDetails.assign;
                    var getOptions = $parse($attrs.options);

                    //options for autocomplete
                    var opts;

                    //convert options provided to opts
                    var initOpts = function () {
                        opts = {};
                        if (angular.isDefined($attrs.options)) {
                            var options = getOptions($scope);
                            if (options.types) {
                                opts.types = [];
                                opts.types.push(options.types);
                            }
                            if (options.bounds) {
                                opts.bounds = options.bounds;
                            }
                            if (options.country) {
                                opts.componentRestrictions = {
                                    country: options.country
                                };
                            }
                        }
                    };

                    //create new autocomplete
                    //reinitializes on every change of the options provided
                    var newAutocomplete = function () {
                        var gPlace = new google.maps.places.Autocomplete($element[0], opts);
                        google.maps.event.addListener(gPlace, 'place_changed', function () {
                            $log.info('newAutocomplete-place-me',gPlace.getPlace());
                            $scope.$apply(function () {
                                var place = gPlace.getPlace();
                                $log.info('newAutocomplete-place',place);
                                if (place.address_components!=undefined) {
                                var details = convertPlaceToFriendlyObject(place);
                                setDetails($scope, details);
                                $ctrl.$setViewValue(details.formattedAddress);
                                $ctrl.$validate();
                            }else{
                            	getPlace(place);
                            }
                            });
                            if ($ctrl.$valid && angular.isDefined($attrs.validateFn)) {
                                $scope.$apply(function () {
                                    $scope.$eval($attrs.validateFn);
                                });
                            }
                        });
                    };
                    newAutocomplete();
                    //function to get retrieve the autocompletes first result using the AutocompleteService 
	        var getPlace = function(result) {
	          var autocompleteService = new google.maps.places.AutocompleteService();
	          if (result.name.length > 0){
	            autocompleteService.getPlacePredictions(
	              {
	                input: result.name,
	                offset: result.name.length
	              },
	              function listentoresult(list, status) {
	                if(list == null || list.length == 0) {
	                  $scope.$apply(function() {
	                    setDetails($scope,{});
	                  });

	                } else {
	                  var placesService = new google.maps.places.PlacesService($element[0]);
	                  placesService.getDetails(
	                    {'reference': list[0].reference},
	                    function detailsresult(detailsResult, placesServiceStatus) {

	                      if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
	                        $scope.$apply(function() {

	                          $ctrl.$setViewValue(detailsResult.formatted_address);
	                          $element.val(detailsResult.formatted_address);

	                          setDetails($scope,detailsResult);

	                          //on focusout the value reverts, need to set it again.
	                          var watchFocusOut = $element.on('focusout', function(event) {
	                            $element.val(detailsResult.formatted_address);
	                            $element.unbind('focusout')
	                          })

	                        });
	                      }
	                    }
	                  );
	                }
	              });
	          }
	        }
                    $ctrl.$validators.parse = function (value) {
                        var details = getDetails($scope);
                        var valid = ($attrs.required == true && details != undefined && details.lat != undefined) ||
                            (!$attrs.required && (details == undefined || details.lat == undefined) && $element.val() != '');
                        return valid;
                    };

                    $element.on('keypress', function (e) {
                    	$log.info('ngAutocomplete keypress');
                        // prevent form submission on pressing Enter as there could be more inputs to fill out
                        if (e.which == 13) {
                            e.preventDefault();
                        }
                    });

                    //watch options provided to directive
                    if (angular.isDefined($attrs.options)) {
                        $scope.$watch($attrs.options, function() {
                            initOpts();
                            newAutocomplete();
                        });
                    }

                    // user typed something in the input - means an intention to change address, which is why
                    // we need to null out all fields for fresh validation
                    $element.on('keyup', function (e) {
                    	$log.info('ngAutocomplete keyup');
                        //          chars 0-9, a-z                        numpad 0-9                   backspace         delete           space
                        if ((e.which >= 48 && e.which <= 90) || (e.which >= 96 && e.which <= 105) || e.which == 8 || e.which == 46 || e.which == 32) {
                            var details = getDetails($scope);
                            if (details != undefined) {
                                for (var property in details) {
                                    if (details.hasOwnProperty(property) && property != 'formattedAddress') {
                                        delete details[property];
                                    }
                                }
                                setDetails($scope, details);
                            }
                            if ($ctrl.$valid) {
                                $scope.$apply(function () {
                                    $ctrl.$setValidity('parse', false);
                                });
                            }
                        }
                    });
                }
            };
        }
    ])
	/*.directive('ngAutocomplete', function($parse) {
	    return {
	      require: 'ngModel',
	      scope: {
	        ngModel: '=',
	        details: '=?'
	      },

	      link: function(scope, element, attrs, controller) {

	        //options for autocomplete
	        var opts;
	        var watchEnter = false
	        var getOptions=$parse(attrs.options);
	        //convert options provided to opts
	        var initOpts = function() {	        
	          opts = {}
	          if (angular.isDefined(attrs.options)) {
	          	scope.options = getOptions(scope);
	            if (scope.options.watchEnter !== true) {
	              watchEnter = false
	            } else {
	              watchEnter = true
	            }

	            if (scope.options.types) {
	              opts.types = []
	              opts.types.push(scope.options.types)
	              scope.gPlace.setTypes(opts.types)
	            } else {
	              scope.gPlace.setTypes([])
	            }

	            if (scope.options.bounds) {
	              opts.bounds = scope.options.bounds
	              scope.gPlace.setBounds(opts.bounds)
	            } else {
	              scope.gPlace.setBounds(null)
	            }

	            if (scope.options.country) {
	              opts.componentRestrictions = {
	                country: scope.options.country
	              }
	              scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
	            } else {
	              scope.gPlace.setComponentRestrictions(null)
	            }
	          }
	        }

	        if (scope.gPlace == undefined) {
	          scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
	        }
	        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
	          var result = scope.gPlace.getPlace();
	          if (result !== undefined) {
	            if (result.address_components !== undefined) {

	              scope.$apply(function() {

	                scope.details = result;

	                controller.$setViewValue(element.val());
	              });
	            }
	            else {
	              if (watchEnter) {
	                getPlace(result)
	              }
	            }
	          }
	        })

	        //function to get retrieve the autocompletes first result using the AutocompleteService 
	        var getPlace = function(result) {
	          var autocompleteService = new google.maps.places.AutocompleteService();
	          if (result.name.length > 0){
	            autocompleteService.getPlacePredictions(
	              {
	                input: result.name,
	                offset: result.name.length
	              },
	              function listentoresult(list, status) {
	                if(list == null || list.length == 0) {

	                  scope.$apply(function() {
	                    scope.details = null;
	                  });

	                } else {
	                  var placesService = new google.maps.places.PlacesService(element[0]);
	                  placesService.getDetails(
	                    {'reference': list[0].reference},
	                    function detailsresult(detailsResult, placesServiceStatus) {

	                      if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
	                        scope.$apply(function() {

	                          controller.$setViewValue(detailsResult.formatted_address);
	                          element.val(detailsResult.formatted_address);

	                          scope.details = detailsResult;

	                          //on focusout the value reverts, need to set it again.
	                          var watchFocusOut = element.on('focusout', function(event) {
	                            element.val(detailsResult.formatted_address);
	                            element.unbind('focusout')
	                          })

	                        });
	                      }
	                    }
	                  );
	                }
	              });
	          }
	        }

	        controller.$render = function () {
	          var location = controller.$viewValue;
	          element.val(location);
	        };

	        //watch options provided to directive
	        scope.watchOptions = function () {
	          return scope.options
	        };
	        scope.$watch(scope.watchOptions, function () {
	          initOpts()
	        }, true);

	      }
	    };
  	})*/
	.service('myLocation',function($q,$http,$log){
		var self=this;
		self.defaultLoc={
			lat: 0.31628,
		    lng: 32.58219
		};
		self.curLoc;
		return({
			getLoc:getLoc
		});
		function getLoc(){
			var d=$q.defer();
			if (self.curLoc) {
				d.resolve(self.curLoc);
			}
			else if (navigator.geolocation) 
			{
		          navigator.geolocation.getCurrentPosition(function(position) {
		          	
		            var pos = {
		              lat: position.coords.latitude,
		              lng: position.coords.longitude
		            };		            
		            d.resolve(pos);
		          }, function() {
		          	getIpLoc().then(function(r){
		          		d.resolve(r);
		          	},function(e){
		          		d.resolve(self.defaultLoc);
		          	});
		          });
		        }else{
		        	getIpLoc().then(function(r){
		          		d.resolve(r);
		          	},function(e){
		          		d.resolve(self.defaultLoc);
		          	});
		        }
		        return d.promise;
	    }
	    function getIpLoc(){
	    	var d=$q.defer();
	    	d.resolve(self.defaultLoc);
	    	return d.promise;
	    }
	})
	.service('findLocation',function($q,$gmaps,$uibModal,$document){
		var self=this;
		return({
			openPop:openPop
		});
		function openPop(){
			var d=$q.defer();
				var modalInstance = $uibModal.open({
						animation:true,
			      		ariaLabelledBy: 'modal-title',
			      		ariaDescribedBy: 'modal-body',
			      		controller:'locationModalCtrl',
			      		controllerAs:'$ctrl',
			      		size:'sm',
					    appendTo: angular.element($document[0].querySelector('#bodymain')),// ng-autocomplete  details="$ctrl.details" options="$ctrl.options" ng-model="$ctrl.details.formattedAddress"
			      		template: '<div class="modal-header">'+
			      						'<h3 class="modal-title text-center" id="modal-title">Find Location</h3>'+
			      				  '</div>'+
			      				  '<div class="modal-body" id="modal-body">'+
			      				  // '<p>{{$ctrl.details|json}}</p>'+ng-model-options="$ctrl.modelOptions"
			      				  	'<form class="form" autocomplete="off" role="form">'+
			      				  		'<div class="form-group"><div class="input-group">'+
			      				  			'<input type="text"  typeahead-min-length="5" typeahead-on-select="$ctrl.setResult($item, $model, $label)" typeahead-loading="loadingLocations" typeahead-no-results="noResults" uib-typeahead="res.description for res in $ctrl.search($viewValue)" ng-model="$ctrl.location" class="form-control"  placeholder="Search Location" />'+
			      				  		'<span class="input-group-addon"><i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i><i ng-show="!loadingLocations" class="glyphicon glyphicon-search"></i></span></div></div>'+
			      				  		'<div ng-show="noResults">'+
									      '<span ng-show="!$ctrl.apiError"><i  class="glyphicon glyphicon-remove"></i> No Results Found</span>'+
									      '<span ng-show="$ctrl.apiError"><span class="text-warning"><i class="glyphicon glyphicon-warning-sign"></i></span> System Error</span>'+
									    '</div>'+
			      				  		'<div class="row"><div param="$ctrl.googleMapArgs" id="map" map-container></div></div>'+
			      				  	'</form>'+
			      				  '</div>'+
			      				  '<div class="modal-footer">'+
			      				  	'<button class="btn btn-warning btn-sm" type="button" ng-click="$ctrl.cancel(\'cancel\')">Cancel</button>'+
			      				  	'<button class="btn btn-success btn-sm" type="button" ng-show="$ctrl.result.found" ng-click="$ctrl.ok()">Done</button>'+			      				  	
			      				  '</div>'
				});
				modalInstance.result.then(function(r)				{
							d.resolve(r);
						},function(e){
							d.reject(e);
				});			
			return d.promise;
		}
	})	
	.controller('locationModalCtrl',function($uibModalInstance,$gmaps,$log,$q){
		var $ctrl=this;
		$ctrl.location='';
		$ctrl.setLoc=false;
		$ctrl.googleMapArgs = {
			allowMultipleMark:false,
			eneblePlaces:true,
			zoom:30,
			onMapClicked:getPlace
		};
		$ctrl.options={
			types: 'geocode'
		};
		$ctrl.modelOptions = {
		    debounce: {
		      default: 500,
		      blur: 250
		    },
		    getterSetter: true
		  };
		$ctrl.apiStatus='';
		$ctrl.apiError=false;
		$ctrl.result={};
		$ctrl.err=''
		$ctrl.ok=function(){
			$ctrl.err='';
			if ($ctrl.result.found) {
				$uibModalInstance.close($ctrl.result);
			}else if($ctrl.apiError){
				$ctrl.err=$ctrl.apiStatus;
			}
			
		};
		$ctrl.cancel=function(wht){
			$ctrl.err='';
			$uibModalInstance.dismiss(wht);
		};
		$ctrl.search=function(wht){
			$log.info('search called');
			var promise;
			var d=$q.defer();		
			promise=$ctrl.googleMapArgs.method.searchAuto(wht);			
			if (promise!==undefined)			
			promise.then(function(res){
				//(lat,lon,title,desc)				
				d.resolve(res);
				// return res;
			},function(status){
				$ctrl.apiError=true;
				$ctrl.apiStatus=status;
				$log.info('locationModalCtrl',status);
				d.reject();
			});
			else
				d.reject();
			return d.promise;
		};
		$ctrl.setResult=function($item, $model, $label){
			getPlace($item);									
		};
		function getPlace(place){
			$ctrl.googleMapArgs.method.getDetails(place).then($ctrl.applyResult,function(e){});
		}
		$ctrl.applyResult=function(res){
			$log.info('res',res);
			$ctrl.result.found=true;
			$ctrl.location=res.name;
			$ctrl.result.name=res.name;
			angular.forEach(res.address_components,function(address,index){
				if (address.types.indexOf("country")!==undefined) {
					$ctrl.result.country=res.address_components[index].long_name;

				}
				
			});
			$ctrl.result.lat=res.geometry.location.lat();
			$ctrl.result.lng=res.geometry.location.lng();
			$ctrl.googleMapArgs.method.clearMarks();
			$ctrl.googleMapArgs.method.setMark($ctrl.result.lat,$ctrl.result.lng,res.name,res.name);
			$ctrl.googleMapArgs.method.setCenter(res.geometry.location);
		}
	});
}));