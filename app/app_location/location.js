'use strict';

	var center = angular.module('myApp.location', ['ngRoute']);

	// DEFINE ROUTE CONFIG
	center.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/location', {
			templateUrl: 'app_location/location.html',
			controller: 'LocationCtrl'
		});


	}]);

	center.controller('LocationCtrl', function($scope, $firebaseArray, $location, $routeParams) {
		// Bind the CenterCollection to the firebase provider.
		var ref = firebase.database().ref('locations');		
		$scope.LocationCollection = $firebaseArray(ref);

		var refCenter = firebase.database().ref('centers');		
		$scope.CenterCollection = $firebaseArray(refCenter);

		// Start Multiselect when document ready
		$scope.$on('$viewContentLoaded', function() {
			/*$('#centerSelect').append('<select id="location-centers-selected" multiple="multiple"'+
														'ng-model="selectedCenter">'+
														'<option ng-repeat="x in CenterCollection" value="{{x.name}}">{{x.name}}</option>'+
												'</select>');*/
		
			$scope.CenterCollection.$loaded().then(function(x) {				
				    console.log($('#centerSelect').html());
					$('#location-centers-selected').multiselect();
				}).catch(function(error) {
				    console.log("Error:", error);
				});
			          
    	});

		$scope.AddNewLocation = function(){
			var locationName = $scope.selectedLocation.name;

			var location_id = $scope.selectedLocation.$id;

			if(location_id) // Update Location
			{
				console.log($scope.selectedCenter);
			}
			else{ 			// Create new location
				if (locationName)
				{
					var newLocation = {name: locationName};
					$scope.LocationCollection.$add(newLocation);
					$('#newLocationModal').modal('hide');
				}
			}
			
		};

		$scope.RemoveLocation = function() {
			//console.log($scope.selectedLocation);
			$scope.LocationCollection.$remove($scope.selectedLocation);

		};
	});