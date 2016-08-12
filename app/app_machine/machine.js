	'use strict';

	var machine = angular.module('myApp.machine', ['ngRoute']);

	// DEFINE ROUTE CONFIG
	machine.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/machine', {
			templateUrl: 'app_machine/machine.html',
			controller: 'MachineCtrl'
		});

		$routeProvider.when('/machine/new', {
			templateUrl: 'app_machine/machine_form.html',
			controller: 'MachineCtrl'
		});

		$routeProvider.when('/machine/edit/:id', {
			templateUrl: 'app_machine/machine_form.html',
			controller: 'MachineCtrl'
		});

	}]);

	machine.controller('MachineCtrl', function($scope, $firebaseAuth, $firebaseArray, $location, $routeParams) {
		// Get Authentication
		$scope.authObj = $firebaseAuth();
		var firebaseUser = $scope.authObj.$getAuth();

		// Machines
		var refMachine = firebase.database().ref('machines');
		$scope.MachineCollection = $firebaseArray(refMachine);

		// Machine History
		var refMachineHistory = firebase.database().ref('histories');
		$scope.MachineHistoryCollection = $firebaseArray(refMachineHistory);

		// Center
		var refCenter = firebase.database().ref('centers');
		$scope.CenterCollection = $firebaseArray(refCenter);

		// Supplier
		var refSupplier = firebase.database().ref('suppliers');
		$scope.SupplierCollection = $firebaseArray(refSupplier);

		// Create reference to Storage
		var storageRef = firebase.storage().ref();

		$scope.state_options = [{ name: "Running", value: "Running" }, 
								{ name: "Partially Running", value: "Partially Running" },
								{ name: "Stopping", value: "Stopping" },
								{ name: "Waiting For Repair", value: "Waiting For Repair" },
								{ name: "Fixed ", value: "Fixed" }
								];	

		$scope.LoadMachineToEdit = function() {

			var id = $routeParams.id;

			if (id)
			{	
				// USE $loaded to wait data has been downloaded from the database
				// Refer: https://github.com/thachit/angularfire/blob/master/docs/reference.md#loaded-1
				$scope.MachineCollection.$loaded().then(function(x) {
				    $scope.newMachine = x.$getRecord(id);
				}).catch(function(error) {
				    console.log("Error:", error);
				});
			}
			
		};

		// Clear Comment field when changing Status
		$scope.OnChangeStatus = function(){
			$scope.newMachine.comment = "";
		}

		function getCurrentDate(){
			return (new Date).toString();
		}

		function saveHistoryMachine(machineId, machineData){
			// CREATE HISTORY FOR MACHINE
			var updatedMachine = $scope.MachineCollection.$getRecord(machineId);

			if(firebaseUser){
				var historyMachine = {
					machine_id: machineId,
					machine_name: updatedMachine.name,
					state: updatedMachine.state,
					comment: updatedMachine.comment,
					issue: updatedMachine.issue,
					date: getCurrentDate(),
					update_by: firebaseUser.email
				};
				console.log(historyMachine);
				$scope.MachineHistoryCollection.$add(historyMachine);
			}
			
		}

		$scope.AddNewMachine = function(){

			// New data form
			var machiner_id = $scope.newMachine.$id;
			var newMachine = $scope.newMachine;

			// NOTE: AUTO FILL LOCATION WHEN SELECT Center

			// ADD LAST UPDATE AND LAST UPDATE DATE
			if (firebaseUser){

				newMachine.last_update = firebaseUser.email;
			}
			newMachine.last_update_date = getCurrentDate();				

			// CREATE OR UPDATE MACHINE
			var res = null;
			if (machiner_id) // Update Center
			{
				$scope.MachineCollection.$save(newMachine).then(function(ref) {
					// IF UPDATE SUCCESS THEN SAVE A HISTORY
				  	saveHistoryMachine(ref.key);
				});


			}
			else  // Create new Center
			{
				
				$scope.MachineCollection.$add(newMachine).then(function(ref) {
					// IF UPDATE SUCCESS THEN SAVE A HISTORY
				  	saveHistoryMachine(ref.key);
				});
			}	

			$location.path('/machine');
		};

		// Remove a machine
		$scope.RemoveMachine = function(machine) {
			$scope.MachineCollection.$remove(machine);

		};

		$scope.RemoveImage = function(image, machine) {
			
			storageRef.child('machines/' + image.name).delete().then(function(){
				var index = machine.pictures.indexOf(image);
				machine.pictures.splice(index, 1);
				$scope.MachineCollection.$save(machine);
			});			
		};



		// UPLOAD IMAGES
		$scope.uploadFiles = function (files) {

	        if(files && files.length)
	        {	

	        	var images_extension = ['image/png', 'image/jpeg'];

	        	/*document_extension = ['text/plain', 'application/pdf', 
							        	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
							        	'application/vnd.openxmlformats-officedocument.wordprocessingml.document']*/

	        	angular.forEach(files, function(file) {
	        		
				    // Upload file to Firebase storage		    			    	
				    var uploadTask = storageRef.child('machines/' + file.name).put(file, { 'contentType': file.type });	

			    	uploadTask.on('state_changed',function(snapshot){
			    		// Observe state change events such as progress, pause, and resume
	  					// See below for more detail
	  					$("#wait").css("display", "block");	  					
	  					$scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

					}, function(error) {
							// Handle unsuccessful uploads
					  		console.log(error);

					} , function() {
							// Handle successful uploads on complete
			  				// For instance, get the download URL: https://firebasestorage.googleapis.com/...
			  				if (images_extension.indexOf(file.type) != -1) 			// IF FILE IS IMAGE
						    {
						    	if (!$scope.newMachine.pictures){
						  			$scope.newMachine.pictures = [];
						  		}

							  	$scope.newMachine.pictures.push({
								  		name: file.name,
								  		url: uploadTask.snapshot.downloadURL
							  		});		
						    }
						    else													// IF FILE IS DOCUMENT
						    {
						    	if (!$scope.newMachine.files){
						  			$scope.newMachine.files = [];
						  		}

							  	$scope.newMachine.files.push({
								  		name: file.name,
								  		url: uploadTask.snapshot.downloadURL
							  		});	
						    }

						  	
						  	// Save image one by one because firebase API is aschync
						  	$scope.MachineCollection.$save($scope.newMachine);	
						  	$("#wait").css("display", "none");				  	
					});
					
	        	});
	        }
	    };

	    $scope.LoadMachineHistory = function(machineId) {
	    	$scope.machineHistories = [];

			if (machineId)
			{	
				// USE $loaded to wait data has been downloaded from the database
				// Refer: https://github.com/thachit/angularfire/blob/master/docs/reference.md#loaded-1
				
				$scope.MachineHistoryCollection.$loaded().then(function(x) {
					// Find History by Machine ID
					$scope.MachineHistoryCollection.$ref().orderByChild("machine_id").equalTo(machineId).on("child_added", function(snapshot) {
						$scope.machineHistories.push(snapshot.val()) ;				
					});	
					$('#MachineHistoryModal').modal('show'); 		    

				}).catch(function(error) {
				    console.log("Error:", error);
				});								
			}
			
		};
		
		// NOTE: MACHINE CATEGORY FEATURES

	});

	// directive to init jquey plugin
	machine.directive('fancybox', function() {
	    return {
	        restrict: 'C', // Just Apply for Class
	        link: function(scope, element, attrs) {
	            angular.element(".fancybox").fancybox();
	        }
	    };
	});