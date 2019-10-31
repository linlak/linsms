(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    factory(require('angular'));
    module.exports = 'ngPaypal';
  } else {
    factory(root.angular);
  }
}(this,function(angular)
{
	'use strict';
	angular = (angular && angular.module ) ? angular : window.angular;
	return angular.module('ngPaypal',[])
	.provider('$paypal',function(){
		var marchantId='';
		var clientIdLive='';
		var clientIdSand='';
		var environment='sandbox';
		return({
			setMarchantId:function(value){
				marchantId = value;
			},
			setClientIdLive:function(value){
				clientIdLive = value;
			},
			setClientIdSand:function(value){
				clientIdSand = value;
			},
			isLive:function(){
				environment='production';
			},
			$get:function($q,$window,$timeout){
				return({
					getMarchantId:function(){
						return marchantId;
					},
					getClientIdSand:function(){
						return clientIdSand;
					},
					getClientIdLive:function(){
						return clientIdLive;
					},
					getEnv:function(){
						return environment;
					},
					init:function(){}
				})
			}
		});
	})
	.directive('paypalCheckout', function($http, $q, $timeout,$paypal,$log){
		return({
			restrict:'A',
			replace:true,
			transclude:true,
			scope: {
				serverUrl:'@',
				fetchData:'&'
			},
			template:`
				<div>
				  <style>.paypal-button-widget { display: none !important; }</style>
				  <div id="t1">
				    
				  </div>
				</div>
			`,
			/*<a href ng-click="initPaypal()"
				      ng-style="{ opacity: showButton ? '1' : '0.5' }">
				      <img src="https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif" alt="PayPal">
				    </a>*/
			link:function(scope,elem,attrs){
				scope.req = {};
		        scope.showButton = false
		  		function getReq(){
		  			scope.req = {
			          method: 'POST',
			          url: scope.serverUrl||'',          // YOUR SERVER HERE (or import with scope)
			          data: scope.fetchData()            // YOUR DATA HERE (or import with scope)
			        }
		  		}
		        function sendRequest(data) {
		          var deferred = $q.defer()
		          $http(data)
		            .success(function(data, status) {
		              return deferred.resolve(data)
		            }).error(function(data, status) {
		              if (status === 0) { data = 'Connection error' }
		              return deferred.reject(data)
		            })
		          return deferred.promise
		        }
				function showButton() {
		          scope.showButton = true
		          scope.$apply()
		        }
		        function delayAndShowButton() {
		          $timeout(showButton, 1000)
		        }
		  		function btnRender(){
		  			paypal.Button.render({

			        // Set your environment

			        env: $paypal.getEnv(), // sandbox | production
			        //locale
			        locale: 'en_US',
			        // Specify the style of the button

			        style: {
			            layout: 'vertical',  // horizontal | vertical
			            size:   'medium',    // medium | large | responsive
			            shape:  'pill',      // pill | rect
			            color:  'gold'       // gold | blue | silver | black
			        },

			        // Specify allowed and disallowed funding sources
			        //
			        // Options:
			        // - paypal.FUNDING.CARD
			        // - paypal.FUNDING.CREDIT
			        // - paypal.FUNDING.ELV

			        funding: {
			            allowed: [ paypal.FUNDING.CARD, paypal.FUNDING.CREDIT ],
			            disallowed: [ ]
			        },
			        client: {
			            sandbox: $paypal.getClientIdSand(),
			            production: $paypal.getClientIdLive()
			        },
	                payment: function(data, actions) {
						  return actions.payment.create({
						    transactions: [{
						      amount: {
						        total: '30.11',
						        currency: 'USD',
						        details: {
						          subtotal: '30.00',
						          tax: '0.07',
						          shipping: '0.03',
						          handling_fee: '1.00',
						          shipping_discount: '-1.00',
						          insurance: '0.01'
						        }
						      },
						      description: 'The payment transaction description.',
						      custom: '90048630024435',
						      //invoice_number: '12345', Insert a unique invoice number
						      payment_options: {
						        allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
						      },
						      soft_descriptor: 'ECHI5786786',
						      item_list: {
						        items: [
						        {
						          name: 'hat',
						          description: 'Brown hat.',
						          quantity: '5',
						          price: '3',
						          tax: '0.01',
						          sku: '1',
						          currency: 'USD'
						        },
						        {
						          name: 'handbag',
						          description: 'Black handbag.',
						          quantity: '1',
						          price: '15',
						          tax: '0.02',
						          sku: 'product34',
						          currency: 'USD'
						        }],
						        shipping_address: {
						          recipient_name: 'Brian Robinson',
						          line1: '4th Floor',
						          line2: 'Unit #34',
						          city: 'San Jose',
						          country_code: 'US',
						          postal_code: '95131',
						          phone: '011862212345678',
						          state: 'CA'
						        }
						      }
						    }],
						    note_to_payer: 'Contact us for any questions on your order.'
						  });
					},
			        onAuthorize: function(data, actions) {
			        	$log.info('onAuthorize',data,actions);
			            return actions.payment.execute().then(function() {
			                window.alert('Payment Complete!');
			            });
			        }

			    }, '#t1');
		  		}
		        function loadPaypalButton() {
		        /*	$log.info('marchantId',$paypal.getMarchantId(),'environment',$paypal.getEnv());
		          paypal.checkout.setup($paypal.getMarchantId(), {
		            environment: $paypal.getEnv(),
		            buttons: [
							  {
							    container: 't1',
							    type: 'checkout',
							    color: 'gold',
							    size: 'small',
							    shape: 'pill'
							  }
							]
		            // buttons: [{ container: 't1', shape: 'rect', size: 'medium' }]
		          })*/
		          btnRender();
		          delayAndShowButton()
		        }
		        scope.initPaypal = function() {
		          if (scope.showButton == false) { return }
		          paypal.checkout.initXO();
		      	  getReq();
		          return sendRequest(scope.req)
		            .then(function(res) {
		              return paypal.checkout.startFlow(res.token);
		            })
		            .catch(function(err) {
		              console.log('Problem with checkout flow', err)
		              return paypal.checkout.closeFlow();
		            })
		        }
		        if (window.paypalCheckoutReady != null) {
		          scope.showButton = true
		        } else {
		          var s = document.createElement('script')
		          s.src = '//www.paypalobjects.com/api/checkout.js'
		          document.body.appendChild(s)
		          window.paypalCheckoutReady = function() {
		            return loadPaypalButton()
		          }
		        }
			}
		});
	});
}));