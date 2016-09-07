(function() {
	angular.module('DforD')
	.controller('NavigationController', ['$scope', '$state', '$http', '$window',
		'$rootScope', 'AuthenticationService', function($scope, $state, $http, 
		$window, $rootScope, AuthenticationService){

			$rootScope.loggedIn = function() {
				return AuthenticationService.Authenticate($window.sessionStorage['jwt'])
			}

			$scope.logout = function() {
				$window.sessionStorage.clear()
				$rootScope.loggedIn = false
				$state.go('login')
			}
		}])
}());