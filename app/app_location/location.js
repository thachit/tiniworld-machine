	'use strict';

	var center_location = angular.module('myApp.location', ['ngRoute']);

	// DEFINE ROUTE CONFIG
	center_location.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/location', {
			templateUrl: 'app_location/location.html',
			controller: 'LocationCtrl'
		});


	}]);

	center_location.controller('LocationCtrl', function($scope, $firebaseArray, $location, $routeParams) {
		// Bind the CenterCollection to the firebase provider.
		var ref = firebase.database().ref('locations');		
		$scope.LocationCollection = $firebaseArray(ref);

		var refCenter = firebase.database().ref('centers');		
		$scope.CenterCollection = $firebaseArray(refCenter);

		$scope.OnChangeLocation = function(){
			
			var options = [];

		    angular.forEach($scope.CenterCollection, function(value, key) {
		    	// {label: 'Option 1', title: 'Option 1', value: '1', selected: true, disabled: true},
		    	
		    	if ($scope.selectedLocation.centers && $scope.selectedLocation.centers.indexOf(value.name) != -1)
		    	{
		    		options.push({label: value.name, title: value.name, value: value.name, selected: true});
		    	}
		    	else {
		    		options.push({label: value.name, title: value.name, value: value.name});
		    	}
			  	
			});
		    
			angular.element("#location-centers-selected").multiselect('dataprovider', options);
		}

		$scope.LocationCollection.$loaded().then(function(x) {
				    $scope.selectedLocation = x[0];

				}).catch(function(error) {
				    console.log("Error:", error);
				});
		
		$scope.addNewRowToSelect = function(){
			$scope.selectedLocation = {};
		};

		$scope.AddNewLocation = function(){
			console.log($scope.selectedLocation);
			var location_id = $scope.selectedLocation.$id;

			if(location_id) // Update Location
			{
				console.log($scope.selectedLocation);
				$scope.LocationCollection.$save($scope.selectedLocation);
			}
			else{ 			// Create new location
				$scope.LocationCollection.$add($scope.selectedLocation);
				// $('#newLocationModal').modal('hide');
			}
			
		};

		$scope.RemoveLocation = function() {
			//console.log($scope.selectedLocation);
			$scope.LocationCollection.$remove($scope.selectedLocation);

		};
	});

	// directive to init jquey plugin
	center_location.directive('selectCenter', function() {
	    return {
	        restrict: 'A', // Just Apply for Attribute
	        link: function(scope, element, attrs) {
	        	scope.CenterCollection.$loaded().then(function(x) {

	        		var options = [];
				    angular.forEach(x, function(value, key) {
				    	// {label: 'Option 1', title: 'Option 1', value: '1', selected: true, disabled: true}
				    	if (scope.selectedLocation){
				    		if (scope.selectedLocation.centers && scope.selectedLocation.centers.indexOf(value.name) != -1)
					    	{
					    		options.push({label: value.name, title: value.name, value: value.name, selected: true});
					    	}
					    	else {
					    		options.push({label: value.name, title: value.name, value: value.name});
					    	}
				    	}
				    	else {
				    		options.push({label: value.name, title: value.name, value: value.name});
				    	}				    	
					  	
					});

					angular.element("#location-centers-selected").multiselect('dataprovider', options);

				}).catch(function(error) {

				    console.log("Error:", error);

				});
	        }
	    };
	});