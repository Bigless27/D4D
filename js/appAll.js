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
					templateUrl: 'app/signup/signup.html',
					controller: 'SignupController'
				})
		}])
}());
(function() {
	angular.module('DforD')
	.directive('showErrors', function() {
		return{
			restrict: 'A',
			require: '^form',
			link: function(scope, el, attrs, formCtrl) {
				var inputEl = el[0].querySelector("[name]");
				//find text box element that has the name
				var inputNgEl = angular.element(inputEl);
				var inputName = inputNgEl.attr('name')
				// all that to get the name of input field

				inputNgEl.bind('blur', function() {
					el.toggleClass('has-error', 
						formCtrl[inputName].$invalid)
				})

				scope.$on('show-errors-check-validity', function() {
					el.toggleClass('has-error', formCtrl[inputName].$invalid)
				})
			}
		}
	})
}());
(function() {
	angular.module('DforD')
	.controller('LoginController', ['$scope', '$state', function($scope, $state) {
		$scope.logUserIn = function() {
			$scope.$broadcast('show-errors-check-validity');

			if($scope.userForm.$invalid){return;}

			
		}

	}])
}());
(function() {
	angular.module('DforD')
	.controller('SignupController', ['$scope', '$state', function($scope, $state) {

	}])
}());