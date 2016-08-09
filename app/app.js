'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
 	// Angular modules.
 	'ngRoute',
  // Third party modules,
  'firebase',
  'smart-table',
  // App modules
  'myApp.auth',
  'myApp.center',
  'myApp.location',
  'myApp.supplier',
  'myApp.version'
  ])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider.otherwise({redirectTo: '/center'});
}])
.run(runFunction);


function runFunction($rootScope, $firebaseAuth, $location) {

	// Check user is logged in? If not, redirect to login page
	var firebaseAuthObject = $firebaseAuth();
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		firebaseAuthObject.$onAuthStateChanged(function(firebaseUser) {
			if (!firebaseUser) {
				$location.path('/login');

			}
		});
	});

	// Add orther thing
}