(function() {
	angular.module('DforD', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {


		// States
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('main', {
				url: '/',
				templateUrl: 'app/main/main.html',
				controller: 'MainController'
			})
	})
}());
(function() {
	angular.module('DforD')
	.controller('MainController', ['$scope', '$state', function($scope, $state) {

	}])
}());