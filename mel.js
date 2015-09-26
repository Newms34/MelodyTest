var app = angular.module("modeler", []);

app.controller("MainController", function($scope, $window, $compile) {
    $scope.test = new Date();
});




mock_output = [261.6,	293.7,	329.6,	349.2,	392.0,	440.0,	493.9];

// ######## AudioContext producer

var audioCont = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

var recorded = false; //flag if we've already written the notes.
var soundType = 'sine';

// set the broswer's audioContext 
var currToneNum = 0;
if (audioCont) {
    var context = new audioCont();
    var gainValue = 0.5; //vol!
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    var oscillator;
} else {
    alert('Your browser doesn\'t support webaudio. Sorry!');
}

freqArr = mock_output;

var oscOn = function(freq, dur) {
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
    // $('#showBar').css({
    //     'width': barW + '%',
    //     'background-color': 'hsl(' + barHue + ',100%,' + barW + '%)'
    // });
    setTimeout(function() {
    	console.log(freqArr[currToneNum])
        oscillator.disconnect();
        if (currToneNum < freqArr.length - 1) {
            //still freqs to play!
            currToneNum++;
            oscOn(freqArr[currToneNum], 500);
        }
    }, dur);
};

// for (var i =0 ; i<mock_output.length ; i++) {
// 	console.log(mock_output[i])
// 	oscOn(mock_output[i], 500)
// }

window.onload = function() { oscOn(mock_output[currToneNum], 500) }
