(function() {
	angular.module('DforD')
	.controller('SignupController', ['$scope', '$state','$http','$window', function($scope, $state, $http, $window) {
		$scope.signUp = function(user) {
			$scope.$broadcast('show-errors-check-validity')

			if ($scope.userForm.$invalid){return;}

			$http.post('api/users', user)
				.success(function(data) {
					$window.sessionStorage.jwt = data['token']
					$state.go('profile.info', id)
				})
				.error(function(error) {
					console.log(error)
				})
		}
	}])
}());