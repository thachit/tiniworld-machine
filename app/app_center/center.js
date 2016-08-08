	'use strict';

	var center = angular.module('myApp.center', ['ngRoute']);

	// DEFINE ROUTE CONFIG
	center.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/center', {
			templateUrl: 'app_center/center.html',
			controller: 'CenterCtrl'
		});

		$routeProvider.when('/center/new', {
			templateUrl: 'app_center/center_form.html',
			controller: 'CenterCtrl'
		});

		$routeProvider.when('/center/edit/:id', {
			templateUrl: 'app_center/center_form.html',
			controller: 'CenterCtrl'
		});


	}]);

	center.controller('CenterCtrl', function($scope, $firebaseArray, $location, $routeParams) {

		var ref = firebase.database().ref('centers');

		// Bind the CenterCollection to the firebase provider.
		$scope.CenterCollection = $firebaseArray(ref);

		// Add Or Update a Center
		$scope.AddNewCenter = function(){

			// New data form
			var center_id = $scope.newCenter.$id;
			var newCenter = $scope.newCenter;

			if (center_id) // Update Center
			{
				$scope.CenterCollection.$save($scope.newCenter).then(function(ref) {
					  // Do something.
					});

			}
			else  // Create new Center
			{
				
				$scope.CenterCollection.$add(newCenter);
			}

			$location.path('/center');
		};

		// Load a specify Center with $id
		$scope.LoadCenterToEdit = function() {

			var id = $routeParams.id;

			if (id)
			{	
				// USE $loaded to wait data has been downloaded from the database
				// Refer: https://github.com/thachit/angularfire/blob/master/docs/reference.md#loaded-1
				$scope.CenterCollection.$loaded().then(function(x) {
				    $scope.newCenter = x.$getRecord(id);

				}).catch(function(error) {
				    console.log("Error:", error);
				});
			}
			
		};

		// Remove a center
		$scope.RemoveCenter = function(center) {
			
			$scope.CenterCollection.$remove(center);

		};

	});