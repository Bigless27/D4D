(function() {
    angular.module('DforD')
    .factory('AuthenticationService', function($http) {
	    
	   return{
	   		Authenticate: function(token) {
	   			$http.post('auth/authenticate',  {
					headers: {
						"Authorization": `Bearer ${token}`
					} 
				})
				.success(function(data) {
					return true;
				})
				.error(function(err){
					return false;
				})
	   		}

	   }
	})
}());