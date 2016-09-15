(function() {
	angular.module('DforD')
	.controller('MainController', ['$scope', '$state', '$http', '$window', 'AuthenticationService', '$q',
		function($scope, $state, $http, $window, AuthenticationService, $q) {

			function getProfile() {
				var token = $window.sessionStorage['jwt']
				
				$http.get('api/users/me', {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.success(function(data){
						$scope.user = data
				})
				.error(function(err){
					console.log(err)
				})
			}





			$scope.updateFName = function(data){
				if(data === ''){
					return 'Name is Required'
				}
				if(data.length < 2){
					return 'Name needs to be at least two characters'
				}
				else if(data.length > 20){
					return 'Name is to long'
				}
				return updateUser(data, 'firstName')

			} 


			$scope.updateLName = function(data){
				if(data === ''){
					return 'Name is Required'
				}
				else if(data.length < 2){
					return 'Name needs to be at least two characters'
				}
				else if(data.length > 20){
					return 'Name is to long'
				}
				return updateUser(data, 'lastName')

			} 

			$scope.updateEmail = function(data){
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				if (data === ''){
					return 'Email is Required'
				}
				else if(!data.match(re)){
					return 'Not valid format'
				}
				return updateUser(data, 'email')

			}
			
			//validations
			$scope.updateAddress = function(data) {
				if(data === ''){
					return 'Address is required'
				}
				return updateUser(data, 'address')
			}

			//validations
			$scope.updateCity = function(data) {
				  if (data === ''){
				  	return 'City is required'
				  }
				  return updateUser(data, 'city')
			}

			$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


			$scope.updateState = function(data) {
				if(data === ''){
					return 'State is required'
				}
				return updateUser(data, 'state')
			}

			//validations
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
				return updateUser(data, 'zip')
			}

			//need validations
			$scope.updatePhone = function(data) {
				return updateUser(data, 'phone')
			}


			function updateUser(data, field){
				var d = $q.defer();
				var token = $window.sessionStorage['jwt']
				$scope.user[field] = data;

				console.log($scope.user)

				$http.put('/api/users/' + $scope.user._id, $scope.user, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				.success(function(data) {
					$scope.user = data
					d.resolve()
				})
				.error(function(err) {
					d.reject(`${err.message}!`)
				})
				return d.promise
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