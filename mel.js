var app = angular.module("modeler", []);

app.controller("MainController", function($scope, $window, $compile) {
    $scope.test = new Date();
});

