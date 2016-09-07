(function() {
    angular.module('DforD')
    .factory('AuthenticationService', function($http) {
	    
	   return{
	   		Authenticate: function(token) {
	   			if (!token) {
	   				return false;
	   			}
	   			else{
		   			$http.get('auth/authenticate',  {
						headers: {
							"Authorization": `Bearer ${token}`
						} 
					})
					.success(function(data) {
						console.log('success')
						return true;
					})
					.error(function(err){
						console.log('fail')
						return false;
					})
	   			}

	   		}

	   }
	})
}());