(function() {
	angular.module('DforD', ['ui.router', 'ui.bootstrap.showErrors', 'xeditable', 'ui.bootstrap'])
	.config(['$stateProvider', '$urlRouterProvider', 'showErrorsConfigProvider', 
		function($stateProvider, $urlRouterProvider, showErrorsConfigProvider) {

			showErrorsConfigProvider.showSuccess(true)
			// States
			$urlRouterProvider.otherwise('login');
			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: 'app/login/login-partial.html',
					controller: 'LoginController',
					onEnter: ['$state', '$rootScope','AuthenticationService', '$window',
					 function($state, $rootScope, AuthenticationService, $window) {
							if($window.sessionStorage['jwt']){
								$state.go('profile.info')
							}
					}]
				})
				.state('signUp', {
					url: '/signUp', 
					templateUrl: 'app/signup/signup-partial.html',
					controller: 'SignupController'
				})
				.state('profile', {
					url: '/profile',
					templateUrl: 'app/profile/profile-partial.html',
					controller: 'MainController',
		
					abstract: true,
					onEnter: ['$state', '$rootScope', '$stateParams', '$location', '$window','AuthenticationService',
					 function($state, $rootScope, $stateParams, $location, $window, AuthenticationService){
							if($location.search().access_token){
								$rootScope.loggedIn = true
								$window.sessionStorage.jwt = $location.search().access_token
								$location.url($location.path())
							}

							if(!$window.sessionStorage['jwt']){
								$state.go('login')
							}
							else{
								$rootScope.loggedIn = true;
							}
						}]
				})
				.state('profile.info', {
					url: '/info',
					templateUrl: 'app/profile/userinfo/info-partial.html'
				})
				.state('profile.transactions', {
					url: '/transactions',
					templateUrl: 'app/profile/transactions/transaction-partial.html'
				})
				.state('profile.billing', {
					url: '/billing',
					templateUrl: 'app/profile/billing/billing-partial.html'
				})
		}])
	.run(function(editableOptions) {
	  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	})
}());
(function() {
	angular.module('DforD')
	.controller('NavigationController', ['$scope', '$state', '$http', '$window',
		'$rootScope', 'AuthenticationService', function($scope, $state, $http, 
		$window, $rootScope, AuthenticationService){

			$rootScope.loggedIn = AuthenticationService.Authenticate($window.sessionStorage['jwt'])

			$scope.logout = function() {
				$window.sessionStorage.clear()
				$rootScope.loggedIn = AuthenticationService.Authenticate($window.sessionStorage['jwt'])
				$state.go('login')
			}
		}])
}());
(function() {
	angular.module('DforD')
	.controller('LoginController', ['$scope', '$state', '$http', 'AuthenticationService', '$window',
	'$rootScope', function($scope, $state, $http, AuthenticationService, $window, $rootScope) {
		
		$scope.logUserIn = function(user) {
			$scope.$broadcast('show-errors-check-validity');

			if($scope.userForm.$invalid){return;}

			$http.post('auth/signin', user)
					.success(function(data) {
						$window.sessionStorage.jwt = data['token']
						$rootScope.loggedIn = true
						$state.go('profile.info')
					})
					.error(function(error) {
						console.log(error)
			})
		}
	}])
}());
(function() {
	angular.module('DforD')
	.controller('MainController', ['$scope', '$state', '$http', '$window', 'AuthenticationService', '$q',
		function($scope, $state, $http, $window, AuthenticationService, $q) {

			function getProfile() {
				var token = $window.sessionStorage['jwt']
				
				$http.get('api/users/me', {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.success(function(data){
						$scope.user = data
				})
				.error(function(err){
					console.log(err)
				})
			}





			$scope.updateFName = function(data){
				if(data === ''){
					return 'Name is Required'
				}
				if(data.length < 2){
					return 'Name needs to be at least two characters'
				}
				else if(data.length > 20){
					return 'Name is to long'
				}
				return updateUser(data, 'firstName')

			} 


			$scope.updateLName = function(data){
				if(data === ''){
					return 'Name is Required'
				}
				else if(data.length < 2){
					return 'Name needs to be at least two characters'
				}
				else if(data.length > 20){
					return 'Name is to long'
				}
				return updateUser(data, 'lastName')

			} 

			$scope.updateEmail = function(data){
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				if (data === ''){
					return 'Email is Required'
				}
				else if(!data.match(re)){
					return 'Not valid format'
				}
				return updateUser(data, 'email')

			}
			
			//validations
			$scope.updateAddress = function(data) {
				if(data === ''){
					return 'Address is required'
				}
				return updateUser(data, 'address')
			}

			//validations
			$scope.updateCity = function(data) {
				  if (data === ''){
				  	return 'City is required'
				  }
				  return updateUser(data, 'city')
			}

			$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


			$scope.updateState = function(data) {
				if(data === ''){
					return 'State is required'
				}
				return updateUser(data, 'state')
			}

			//validations
			$scope.updateZip = function(data) {

				if(data === ''){
					return 'Zip is required'
				}
				else if(data.length < 2){
					return 'Not Valid'
				}
				else if(data.length > 8){
					return 'Not Valid'
				}
				return updateUser(data, 'zip')
			}

			//need validations
			$scope.updatePhone = function(data) {
				return updateUser(data, 'phone')
			}


			function updateUser(data, field){
				var d = $q.defer();
				var token = $window.sessionStorage['jwt']
				$scope.user[field] = data;

				console.log($scope.user)

				$http.put('/api/users/' + $scope.user._id, $scope.user, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				.success(function(data) {
					$scope.user = data
					d.resolve()
				})
				.error(function(err) {
					d.reject(`${err.message}!`)
				})
				return d.promise
			}


			getProfile()

			

			angular.element(document).ready(function() {
				$('.nav-pills li').first().addClass('active')

				$('.nav-pills li').click(function(e) {
				    $('.nav-pills li.active').removeClass('active');
				    var $this = $(this);
				    if (!$this.hasClass('active')) {
				        $this.addClass('active');
				    }
				    e.preventDefault();
				});
			})
		
	}])
}());
(function() {
    angular.module('DforD')
    .factory('AuthenticationService', function($http) {
	    
	   return{
	   		Authenticate: function(token) {
	   			if (!token) {
	   				return false;
	   			}
	   			else{
		   			$http.get('auth/authenticate',  {
						headers: {
							"Authorization": `Bearer ${token}`
						} 
					})
					.success(function(data) {
						console.log('success')
						return true;
					})
					.error(function(err){
						console.log('fail')
						return false;
					})
	   			}

	   		}

	   }
	})
}());
(function() {
	angular.module('DforD')
	.controller('SignupController', ['$scope', '$state','$http','$window', function($scope, $state, $http, $window) {
		$scope.signUp = function(user) {
			$scope.errorDisplay = false
			$scope.$broadcast('show-errors-check-validity')

			if ($scope.userForm.$invalid){return;}

			$http.post('api/users', user)
				.success(function(data) {
					$state.go('login')
				})
				.error(function(err) {
					$scope.ads = err.split(',')
					$scope.errorDisplay = true
				})
		}
	}])
}());
(function() {
    angular.module('DforD')
    .directive('phoneInput', function($filter, $browser) {
        return {
            require: 'ngModel',
            link: function($scope, $element, $attrs, ngModelCtrl) {
                var listener = function() {
                    var value = $element.val().replace(/[^0-9]/g, '');
                    $element.val($filter('tel')(value, false));
                };

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function(viewValue) {
                    return viewValue.replace(/[^0-9]/g, '').slice(0,10);
                });

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function() {
                    $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
                };

                $element.bind('change', listener);
                $element.bind('keydown', function(event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                        return;
                    }
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function() {
                    $browser.defer(listener);
                });
            }

        };
    })
    .filter('tel', function () {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 1:
                case 2:
                case 3:
                    city = value;
                    break;

                default:
                    city = value.slice(0, 3);
                    number = value.slice(3);
            }

            if(number){
                if(number.length>3){
                    number = number.slice(0, 3) + '-' + number.slice(3,7);
                }
                else{
                    number = number;
                }

                return ("(" + city + ") " + number).trim();
            }
            else{
                return "(" + city;
            }

        };
    });
}());
(function() {
  var showErrorsModule;

  showErrorsModule = angular.module('ui.bootstrap.showErrors', []);

  showErrorsModule.directive('showErrors', [
    '$timeout', 'showErrorsConfig', '$interpolate', function($timeout, showErrorsConfig, $interpolate) {
      var getShowSuccess, getTrigger, linkFn;
      getTrigger = function(options) {
        var trigger;
        trigger = showErrorsConfig.trigger;
        if (options && (options.trigger != null)) {
          trigger = options.trigger;
        }
        return trigger;
      };
      getShowSuccess = function(options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && (options.showSuccess != null)) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };
      linkFn = function(scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses, trigger;
        blurred = false;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        trigger = getTrigger(options);
        inputEl = el[0].querySelector('.form-control[name]');
        inputNgEl = angular.element(inputEl);
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
        if (!inputName) {
          throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class";
        }
        inputNgEl.bind(trigger, function() {
          blurred = true;
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$watch(function() {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, function(invalid) {
          if (!blurred) {
            return;
          }
          return toggleClasses(invalid);
        });
        scope.$on('show-errors-check-validity', function() {
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-reset', function() {
          return $timeout(function() {
            el.removeClass('has-error');
            el.removeClass('has-success');
            return blurred = false;
          }, 0, false);
        });
        return toggleClasses = function(invalid) {
          el.toggleClass('has-error', invalid);
          if (showSuccess) {
            return el.toggleClass('has-success', !invalid);
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function(elem, attrs) {
          if (attrs['showErrors'].indexOf('skipFormGroupCheck') === -1) {
            if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
              throw "show-errors element does not have the 'form-group' or 'input-group' class";
            }
          }
          return linkFn;
        }
      };
    }
  ]);

  showErrorsModule.provider('showErrorsConfig', function() {
    var _showSuccess, _trigger;
    _showSuccess = false;
    _trigger = 'blur';
    this.showSuccess = function(showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.trigger = function(trigger) {
      return _trigger = trigger;
    };
    this.$get = function() {
      return {
        showSuccess: _showSuccess,
        trigger: _trigger
      };
    };
  });

}).call(this);


(function() {
	angular.module('DforD')
	.directive('showErrors', function() {
		return{
			restrict: 'A',
			require: '^form',
			link: function(scope, el, attrs, formCtrl) {
				var inputEl = el[0].querySelector("[name]");
				//find text box element that has the name
				var inputNgEl = angular.element(inputEl);
				var inputName = inputNgEl.attr('name')
				// all that to get the name of input field

				inputNgEl.bind('blur', function() {
					el.toggleClass('has-error', 
						formCtrl[inputName].$invalid)
				})

				scope.$on('show-errors-check-validity', function() {
					el.toggleClass('has-error', formCtrl[inputName].$invalid)
				})
			}
		}
	})
}());