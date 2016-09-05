(function() {
	angular.module('DforD')
	.controller('LoginController', ['$scope', '$state', function($scope, $state) {
		$scope.logUserIn = function() {
			$scope.$broadcast('show-errors-check-validity');

			if($scope.userForm.$invalid){return;}
		}

	}])
}());