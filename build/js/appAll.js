(function() {
	angular.module('DforD', ['ui.router', 'ui.bootstrap.showErrors'])
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
								$state.go('profile')
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
		}])
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
						$state.go('profile')
					})
					.error(function(error) {
						console.log(error)
			})
		}
	}])
}());
(function() {
	angular.module('DforD')
	.controller('MainController', ['$scope', '$state', '$http', '$window', 'AuthenticationService',
		function($scope, $state, $http, $window, AuthenticationService) {

			$scope.me = function() {

				var token = $window.sessionStorage['jwt']
				
				$http.get('api/users/me', {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.success(function(data){
						console.log(data)
				})
				.error(function(err){
					console.log(err)
				})
			}
		
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
			$scope.$broadcast('show-errors-check-validity')

			if ($scope.userForm.$invalid){return;}

			$http.post('api/users', user)
				.success(function(data) {
					$window.sessionStorage.jwt = data['token']
					$state.go('profile')
				})
				.error(function(error) {
					console.log(error)
				})
		}
	}])
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