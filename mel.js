var app = angular.module("modeler", []);

app.controller("MainController", function($scope, $window, $compile) {
    $scope.test = new Date();
    // random note generator
    $scope.generateNotes = function generateNotes (melodyLength) {
		var nums = [];
		var frequencies = {
		    0: 261.63, // C
		    1: 293.66,
		    2: 329.63,
		    3: 349.23,
		    4: 392.00,
		    5: 440.00,
		    6: 493.88,
		    7: 523.25 // C (next octave)
		}
		while (nums.length < melodyLength){
			nums.push(generateNum());
		}
		var freqs = nums.map(function (num){
			return frequencies[num];
		})
		return freqs;
	}
});

function generateNum () {
	var min = 0; // 0 = C (middle)
	var max = 7; // 7 = C (next octave)
	return Math.floor(Math.random() * (max - min + 1)) + min;
}