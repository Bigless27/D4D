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