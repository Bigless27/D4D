(function() {
	angular.module('DforD')
	.controller('MainController', ['$scope', '$state', '$http', '$window', 
		function($scope, $state, $http, $window) {

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


			$scope.logout = function() {
				$window.sessionStorage.clear()
				$state.go('login')
			}
		
	}])
}());