(function() {
	angular.module('DforD', ['ui.router', 'ui.bootstrap.showErrors'])
	.config(['$stateProvider', '$urlRouterProvider', 'showErrorsConfigProvider', 
		function($stateProvider, $urlRouterProvider, showErrorsConfigProvider) {

			showErrorsConfigProvider.showSuccess(true)
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
					templateUrl: 'app/signup/signup-partial.html',
					controller: 'SignupController'
				})
				.state('main', {
					url: '/main',
					templateUrl: 'app/main/main-partial.html',
					controller: 'MainController',
					onEnter: ['$state', '$rootScope', '$stateParams', '$location', '$window', function($state, $rootScope, $stateParams, $location, $window){
							if($location.search().access_token){
								$rootScope.loggedIn = true
								$window.sessionStorage.jwt = $location.search().access_token
								$location.url($location.path())
							}
						}]
				})
		}])
}());