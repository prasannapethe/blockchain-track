var app = angular
		.module('blockchainApp', [ 'ngRoute', 'ngAnimate', 'toaster' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider
	// Home
	.when("/", {
		templateUrl : "routefile/home.html",
		controller : "HomeCtrl"
	})
	// Pages
	.when("/newtrans", {
		templateUrl : "routefile/newtrans.html",
		controller : "newtransCtrl"
	}).when("/newblock", {
		templateUrl : "routefile/newblock.html",
		controller : "newblockCtrl"
	})
	// else 404
	.otherwise("/404", {
		templateUrl : "routefile/404.html",
		controller : "HomeCtrl"
	});
	
	
} ]);

app.controller('HomeCtrl', function(toaster, $scope) {
	$scope.status = "not connected";

	var websocket;
	function init() {

		websocket = new WebSocket("wss://ws.blockchain.info/inv");

		

		websocket.onmessage = function(event) {
			// message processing code goes here
			var msgData = JSON.parse(event.data);
			if (msgData.op == 'utx') {
				var txHash = msgData.x.hash;

				var outputs = msgData.x.out;
				var totalTxValue = 0;
				for (var j = 0; j < outputs.length; j++) {
					var output = outputs[j];
					totalTxValue += output.value;
				}
				totalTxValue = totalTxValue / 100000000;
				// document.getElementById("status").innerHTML = "tx: " + txHash
				// +"Amount: " + txHash;
				toaster.pop('note', "New transaction ", txHash + " Amount "
						+ totalTxValue);
			}
			if (msgData.op == 'block') {
				var blockHash = msgData.x.hash;
				toaster.pop('note', "New Block Created", blockHash);
			}
		};
		
		
		websocket.onopen = function() {
			document.getElementById("status").innerHTML = "Connected";
		};

		websocket.onerror = function(event) {
			document.getElementById("status").innerHTML = "Error";
		};
	}
	;

	function sendMessage(message) {
		document.getElementById("output").innerHTML = message;
		websocket.send(message);
	}

	$scope.start = function() {
		websocket.send('{"op":"unconfirmed_sub"}');
		websocket.send('{"op":"blocks_sub"}');
	}

	$scope.stop = function() {
		websocket.send('{"op":"unconfirmed_unsub"}');
		websocket.send('{"op":"blocks_unsub"}');
	}

	window.addEventListener("load", init, false);		
});

app.controller('newblockCtrl', function(/* $scope, $location, $http */) {

});

/**
 * Controls all other Pages
 */
app.controller('newtransCtrl', function($scope, $location, toaster) {

	
});