	'use strict';

	var auth = angular.module('myApp.auth', ['ngRoute']);

	// DEFINE ROUTE CONFIG
	auth.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'app_auth/login.html',
			controller: 'LoginCtrl'
		});

		$routeProvider.when('/logout', {
			controller: 'LogoutCtrl'
		});

		$routeProvider.when('/CurrentUser', {
			controller: 'CurrentUserCtrl'
		});

	}]);

	// LOGIN
	auth.controller('LoginCtrl', function($scope, $firebaseAuth, $location) {
		$scope.authObj = $firebaseAuth();

		$scope.SignIn = function(event) {
			event.preventDefault();	// To prevent form refresh
			var email = $scope.user.email;
			var password = $scope.user.password;		

			var currentUser = firebase.auth().currentUser;
			if (currentUser){
				$scope.authObj.$signOut();
			}

			$scope.authObj.$signInWithEmailAndPassword(email, password)
			.then(function(firebaseUser){
				// console.log(firebaseUser);
				$location.path('/');
			})
			.catch(function(error){
	          // var errorCode = error.code;
	          $scope.message = error.message;

	      });
		}

	});

	// LOAD USER LOGGED IN
	auth.controller('CurrentUserCtrl', function($scope, $location, $firebaseAuth) {
		$scope.authObj = $firebaseAuth();

		// Load User Logged In
		$scope.authObj.$onAuthStateChanged(function(firebaseUser) {
			$scope.firebaseUser = firebaseUser;

		});

		// Add Function Sign Out
		$scope.SignOut = function() {
			$scope.authObj.$signOut();
			$location.path('/login');
		}

	});