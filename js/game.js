"use strict";

angular.module("game", ["ngRoute"]);
angular.module("game").config(function($compileProvider, $routeProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

    $routeProvider
    .when ("/", {
        templateUrl: "pages/index.html",
        controller: "gameMain"
    })
    .when("/result", {
        templateUrl: "pages/result.html",
        controller: "resultController"
    })
    ;
})
.controller("gameMain", function ($scope) {
    $scope.sites = [];
    $scope.ready = false;
    $scope.index = 0;
    $scope.next = function(safe) {
        if(!$scope.ready)
            return;
        $scope.sites[$scope.index++].choice = safe;

        if($scope.index == 10) {
            location.href = "#/result";
            return;               
        }
        $('#myRoundabout').roundabout_animateToChild($scope.index);
    }
    $scope.load_progress = "Calculating risk factors...";
    loadData().then(function(data) {
        $scope.$apply(function() {
            $scope.sites = data.result;

            $scope.load_progress = "Preloading thumbnails...";

            var thumbProm = [];
            $.each(data.result, function(index, value) {
                var prom = data.thumbH.getThumbnail(value.url).then(function(url) {
                    $scope.$apply(function() {
                        value.thumbnail = url;
                    });
                });
                thumbProm.push(prom);
            });

            Promise.all(thumbProm.splice(0, 3)).then(function() {
                $scope.ready = true;
            });
            setTimeout(function() {
                $(document).ready(function () {
                    $('#myRoundabout').roundabout({
                        shape: 'square',
                        minScale: 0.93, // tiny!
                        maxScale: 1, // tiny!
                        easing: 'easeOutExpo',
                        clickToFocus: 'true',
                        focusBearing: '0',
                        duration: 800,
                        reflect: true
                    });
                });
            }, 0);
        });
    });
})
.controller("resultController", function($scope) {

});