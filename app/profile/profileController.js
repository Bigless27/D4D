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



			$scope.updateName = function(data){
				if(data === ''){
					return 'Name is Required'
				}
				else if(data.length < 2){
					return 'Name needs to be at least two characters'
				}
				else if(data.length > 20){
					return 'Name is to long'
				}

			} 

			$scope.updateEmail = function(data){
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				if (data === ''){
					return 'Email is Required'
				}
				else if(!data.match(re)){
					return 'Not valid format'
				}

			}

			$scope.updateAddress = function(data) {
				if(data === ''){
					return 'Address is required'
				}
			}

			$scope.updateCity = function(data) {
				  if (data === ''){
				  	return 'City is required'
				  }
			}

			 $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

			$scope.updateState = function(data) {
				if(data === ''){
					return 'State is required'
				}
			}

			$scope.updateZip = function(data) {
				if(data === ''){
					return 'Zip is required'
				}
				else if(data.length < 2){
					return 'Not Valid'
				}
				else if(data.length > 8){
					return 'Not Valid'
				}
			}

			$scope.updatePhone = function(data) {
				if(data !== ''){
					if(data.length !== 10)
					 return 'invalid number U.S'
				}

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