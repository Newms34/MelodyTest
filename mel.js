var app = angular.module("modeler", []);

app.controller("MainController", function($scope, $window, $compile) {

	var currToneNum = 0;
	$scope.isDisabled = false;

    $scope.notes = []
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
		$scope.notes = freqs;
	};

	$scope.playNotes = function() {
		$scope.isDisabled = true;
		currToneNum = 0;
		$scope.oscOn($scope.notes[0], 500)
	};



	$scope.oscOn = function(freq, dur) {
		
	    //this function plays a tone. it then stops the tone after 'dur' seconds and continues on to the next tone (if there is one)
	    // var barW = parseInt((100 * (freq - min) / (max - min)));
	    // var barHue = (currToneNum * 30) % 360
	    if (typeof oscillator != 'undefined') oscillator.disconnect(); //if there is a previous osc, disconnect it first
	    oscillator = context.createOscillator();
	    oscillator.frequency.value = freq;
	    oscillator.connect(gainNode);
	    gainNode.connect(context.destination);
	    gainNode.gain.value = gainValue;
	    oscillator.type = soundType;
	    oscillator.start ? oscillator.start(0) : oscillator.noteOn(0);
	  
	    if (currToneNum === $scope.notes.length-1) {
	    	$scope.isDisabled = false;
	    	$scope.$digest();
	    }

	    setTimeout(function() {
	    	// console.log($scope.notes[currToneNum])
	        oscillator.disconnect();
	        if (currToneNum < $scope.notes.length - 1) {
	            //still freqs to play!
	            currToneNum++;
	            $scope.oscOn($scope.notes[currToneNum], 500);
	        }
	    }, dur);
	};


});



// ######## AudioOutput ####################



var audioCont = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

var recorded = false; //flag if we've already written the notes.
var soundType = 'sine';

// set the broswer's audioContext 

if (audioCont) {
    var context = new audioCont();
    var gainValue = 0.5; //vol!
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    var oscillator;
} else {
    alert('Your browser doesn\'t support webaudio. Sorry!');
}

// freqArr = mock_output;



function generateNum () {
	var min = 0; // 0 = C (middle)
	var max = 7; // 7 = C (next octave)
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

