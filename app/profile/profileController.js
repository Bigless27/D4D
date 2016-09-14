(function() {
	angular.module('DforD')
	.controller('MainController', ['$scope', '$state', '$http', '$window', 'AuthenticationService',
		function($scope, $state, $http, $window, AuthenticationService) {

			function getProfile() {
				var token = $window.sessionStorage['jwt']
				
				$http.get('api/users/me', {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.success(function(data){
						console.log(data)
						$scope.user = data
				})
				.error(function(err){
					console.log(err)
				})
			}

			getProfile()

			

			angular.element(document).ready(function() {
				$('.nav-pills li').first().addClass('active')

				$('.nav-pills li').click(function(e) {
				    $('.nav-pills li.active').removeClass('active');
				    var $this = $(this);
				    if (!$this.hasClass('active')) {
				        $this.addClass('active');
				    }
				    e.preventDefault();
				});
			})
		
	}])
}());