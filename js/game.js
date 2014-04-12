"use strict";
angular.module("game", []);
angular.module("game").config(function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
}).controller("gameMain", function ($scope) {
    $scope.sites = [];
    $scope.ready = false;

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
            // $('.button1').click(function() {
            //     $('#myRoundabout').roundabout_animateToNextChild();
            // });

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
