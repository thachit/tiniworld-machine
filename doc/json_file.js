// =============================== Center JSON ====================
centers = [

{
	name: "Nowzone Center",
	address: "326, Vo Van Kiet, Quan 1, HCM",
	manager: {
		name: "Nguyen Van A",
		phone: "0906654208"
	}
},

{

	name: "Coopmart Ly Thuong Kiet",
	address: "326, Vo Van Kiet, Quan 10, HCM",
	manager: {
		name: "Nguyen Van B",
		phone: "0906654207"
	}
}]

var newPostKey = firebase.database().ref().child('centers').push().key;
var updates = {}
updates['/centers/' + newPostKey] = data;
firebase.database().ref().update(updates);

// =============================== Location JSON===================
locations = {
	name: "Zone 1",
	centers: ["Nowzone Center", "Coopmart Ly Thuong Kiet"]
}

var newPostKey = firebase.database().ref().child('locations').push().key;
var updates = {}
updates['/locations/' + newPostKey] = locations;
firebase.database().ref().update(updates);

// =============================== Suplier JSON ==================
suppliers = {
	name: "CHK SUPPORT",
	address: "Quang Tay, Trung Quoc",
	phone: "123456789"
}

var newPostKey = firebase.database().ref().child('suppliers').push().key;
var updates = {}
updates['/suppliers/' + newPostKey] = suppliers;
firebase.database().ref().update(updates);


// =============================== Machines JSON===================
{ -KOErwRYbVlwOQuvUTGU: // Key generate by Firebase DB
	{

		name: "Walking Animal",

		center: "Nowzone center",

		ticket_payout: true,

		pictures: [{
			name: "structure-data.jpeg",
			url: "https://firebase.google.com/docs/database/web/structure-data.jpeg"
		},
		{
			name: "structure-data_1.jpeg",
			url: "https://firebase.google.com/docs/database/web/structure-data_1.jpeg"
		}
		],

		files:	[{

			name: "documentation.pdf",
			url: "https://firebase.google.com/docs/database/web/documentation.pdf"
		}],

		machine_category: "walking animals",

		location: "zone 1",

		dimension: {
			height: "100m",
			width: "25m",
			deep: "5m"
		},

		supplier: "CHK SUPPORT",

		play_instruction: "Bo 2 xu, bam enter",

		max_ticket_payout: 2000,

		cost_to_play: 3000,

		common_issues: "",

		state: "Fixed",

		last_update: "nguyencothach1989@gmail.com",

		last_update_date: "2016-01-01"
	}
}

var newPostKey = firebase.database().ref().child('machines').push().key;
var updates = {}
updates['/machines/' + newPostKey] = data;
firebase.database().ref().update(updates);

// =============================== Machine Histories JSON===================

histories = [
	{
	    "comment" : "May bi hu, ngat de sua chua",
	    "date" : "2016-01-01 08:15:22",
	    "issue" : "May bi treo CPU",
	    "machine_id" : "-KOra137Yr3BIHr0t9Pa",
	    "machine_name" : "Machine 2",
	    "state" : "in-active",
	    "update_by" : "nguyencothach1989@gmail.com"
  	}]

var newPostKey = firebase.database().ref().child('histories').push().key;
var updates = {}
updates['/histories/' + newPostKey] = histories;
firebase.database().ref().update(updates);