
Cufon.now();
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