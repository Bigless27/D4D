(function() {
	angular.module('DforD', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {



		// States
		$urlRouterProvider.otherwise('login');
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'app/login/login-partial.html',
				controller: 'LoginController',
				css: 'css/login.css'
			})
			.state('signUp', {
				url: '/signUp', 
				templateUrl: 'app/signup/signup.html',
				controller: 'SignupController'
			})
	})
}());