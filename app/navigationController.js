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