(function() {
	angular.module('DforD', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {



		// States
		$urlRouterProvider.otherwise('login');
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'app/login/login-partial.html',
				controller: 'LoginController'
			})
			.state('signUp', {
				url: '/signUp', 
				templateUrl: 'app/signup/signup.html',
				controller: 'SignupController'
			})
	})
}());
(function() {
	angular.module('DforD')
	.controller('LoginController', ['$scope', '$state', function($scope, $state) {

	}])
}());
(function() {
	angular.module('DforD')
	.controller('SignupController', ['$scope', '$state', function($scope, $state) {

	}])
}());