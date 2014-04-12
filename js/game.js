"use strict";

angular.module("game", []);
angular.module("game").config(function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
}).controller("gameMain", function ($scope) {
    $scope.sites = [];
    $scope.ready = false;
    $scope.index = 0;
    $scope.next = function(safe) {
        if(!$scope.ready)
            return;
        $scope.sites[$scope.index++].choice = safe;
        $('#myRoundabout').roundabout_animateToNextChild();
        if($scope.index == 10) {
                        
        }

    }
    loadData().then(function(data) {
        $scope.$apply(function() {
            $scope.sites = data.result;

            $.each(data.result, function(index, value) {
                data.thumbH.getThumbnail(value.url).then(function(url) {
                    $scope.$apply(function() {
                        value.thumbnail = url;
                    });
                });
            });
            $scope.ready = true;
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
});
