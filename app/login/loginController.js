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