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