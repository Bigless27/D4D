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
					controller: 'LoginController',
					onEnter: ['$state', '$rootScope','AuthenticationService', '$window',
					 function($state, $rootScope, AuthenticationService, $window) {
							if($window.sessionStorage['jwt']){
								$state.go('profile.info')
							}
					}]
				})
				.state('signUp', {
					url: '/signUp', 
					templateUrl: 'app/signup/signup-partial.html',
					controller: 'SignupController'
				})
				.state('profile', {
					url: '/profile',
					templateUrl: 'app/profile/profile-partial.html',
					controller: 'MainController',
					abstract: true,
					onEnter: ['$state', '$rootScope', '$stateParams', '$location', '$window','AuthenticationService',
					 function($state, $rootScope, $stateParams, $location, $window, AuthenticationService){
							if($location.search().access_token){
								$rootScope.loggedIn = true
								$window.sessionStorage.jwt = $location.search().access_token
								$location.url($location.path())
							}

							if(!$window.sessionStorage['jwt']){
								$state.go('login')
							}
							else{
								$rootScope.loggedIn = true;
							}
						}]
				})
				.state('profile.info', {
					url: '/info',
					templateUrl: 'app/profile/userinfo/info-partial.html'
				})
				.state('profile.transactions', {
					url: '/transactions',
					templateUrl: 'app/profile/transactions/transaction-partial.html'
				})
				.state('profile.billing', {
					url: '/billing',
					templateUrl: 'app/profile/billing/billing-partial.html'
				})
		}])
}());