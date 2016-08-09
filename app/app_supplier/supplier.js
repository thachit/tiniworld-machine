	'use strict';

	var center = angular.module('myApp.supplier', ['ngRoute']);

	// DEFINE ROUTE CONFIG
	center.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/supplier', {
			templateUrl: 'app_supplier/supplier.html',
			controller: 'SupplierCtrl'
		});

		$routeProvider.when('/supplier/new', {
			templateUrl: 'app_supplier/supplier_form.html',
			controller: 'SupplierCtrl'
		});

		$routeProvider.when('/supplier/edit/:id', {
			templateUrl: 'app_supplier/supplier_form.html',
			controller: 'SupplierCtrl'
		});

	}]);

	center.controller('SupplierCtrl', function($scope, $firebaseArray, $location, $routeParams) {
		var ref = firebase.database().ref('suppliers');
		$scope.SupplierCollection = $firebaseArray(ref);

		// Load a specify Center with $id
		$scope.LoadSupplierToEdit = function() {

			var id = $routeParams.id;

			if (id)
			{	
				// USE $loaded to wait data has been downloaded from the database
				// Refer: https://github.com/thachit/angularfire/blob/master/docs/reference.md#loaded-1
				$scope.SupplierCollection.$loaded().then(function(x) {
				    $scope.newSupplier = x.$getRecord(id);

				}).catch(function(error) {
				    console.log("Error:", error);
				});
			}
			
		};

		$scope.AddNewSupplier = function(){

			// New data form
			var supplier_id = $scope.newSupplier.$id;
			var newSupplier = $scope.newSupplier;

			if (supplier_id) // Update Center
			{
				$scope.SupplierCollection.$save($scope.newSupplier).then(function(ref) {
					  // Do something.
					});

			}
			else  // Create new Center
			{
				
				$scope.SupplierCollection.$add(newSupplier);
			}

			$location.path('/supplier');
		};

		// Remove a center
		$scope.RemoveSupplier = function(supplier) {
			
			$scope.SupplierCollection.$remove(supplier);

		};

	});