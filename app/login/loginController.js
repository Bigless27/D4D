(function() {
	angular.module('DforD')
	.controller('LoginController', ['$scope', '$state', '$http', '$window', function($scope, $state, $http, $window) {
		$scope.logUserIn = function(user) {
			$scope.$broadcast('show-errors-check-validity');

			if($scope.userForm.$invalid){return;}

			$http.post('auth/signin', user)
					.success(function(data) {
						$window.sessionStorage.jwt = data['token']
						$state.go('main')
					})
					.error(function(error) {
						console.log(error)
			})
		}

	}])
}());