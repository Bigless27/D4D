(function() {
	angular.module('DforDIndex', [])
	.controller('IndexController', ['$scope', '$http','$window', 
		function($scope, $http, $window) {
			
			function getProducts(){
				$http.get('api/products')
					.success(function(data){
						$scope.products = data
					})
					.error(function(err){
						console.log(err)
					})
			}

			getProducts()
	}])
}());