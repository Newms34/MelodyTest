var app = angular.module("modeler", []);

app.controller("MainController", function($scope, $window, $compile) {
    $scope.fullNotes = [];
    $scope.noteCols = ['#f00', '#fc0', '#ff0', '#cf0', '#0f0', '#0fc', '#0ff', '#0cf'];
    $scope.noteYs = {
        0: 246,
        1: 220,
        2: 196,
        3: 171,
        4: 120,
        5: 96,
        6: 70,
        7: 46
    }
    $scope.makeFullNotes = function() {
        $scope.fullNotes = []; //clear our full notes arr
        for (var i = 0; i < $scope.notes.length; i++) {
            var xPos = Math.floor(1000 * i / $scope.notes.length);

            $scope.fullNotes.push({
                x: xPos + 100,
                y: $scope.noteYs[$scope.notes[i]],
                col: $scope.noteCols[$scope.notes[i]]
            });

        }
    };
    $scope.frequencies = {
        0: 329.63,
        1: 349.23,
        2: 392.00,
        3: 440.00,
        4: 493.88,
        5: 523.25,
        6: 587.33,
        7: 659.25
    };

    var currToneNum = 0;
    $scope.isDisabled = false;

    $scope.notes = []
        // random note generator
    $scope.generateNotes = function generateNotes(melodyLength) {
        var nums = [];
        while (nums.length < melodyLength) {
            nums.push(generateNum());
        }
        var freqs = nums.map(function(num) {
            return num;
        })
        $scope.notes = freqs;
        $scope.makeFullNotes();
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
        oscillator.frequency.value = $scope.frequencies[freq];
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.value = gainValue;
        oscillator.type = soundType;
        oscillator.start ? oscillator.start(0) : oscillator.noteOn(0);

        if (currToneNum === $scope.notes.length - 1) {
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



function generateNum() {
    var min = 0; // 0 = C (middle)
    var max = 7; // 7 = C (next octave)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}