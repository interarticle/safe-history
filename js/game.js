
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

function loadData() {
    var inst = new safeHistory();
    var heartB = new heartBleed();
    heartB.ctor.then(function() {
        heartB.parse();
        inst.getHistory(1000).then(function(data) {
            // Filter data to eliminate duplicate hostnames
            var hostnames = {};

            // console.log(data);
            $.each(data, function(key, value) {
                var uri = new URI(value.url);
                var hostname = uri.hostname().toLowerCase();
                if (uri.protocol() != "http" && uri.protocol() != "https") {
                    return; // Ignore any urls that are not http or https, can't deal with that really.
                }

                if (!hostnames[hostname]) hostnames[hostname] = [];
                value.printableDate = new Date(value.lastVisitTime).toString();
                hostnames[hostname].push(value);
            });
            // console.log(hostnames);

            var sites = Object.keys(hostnames);

            getWOTRate(sites).then(function(results) {
                
            });

            getGoogleSafeBrowsingRate(sites).then(function(results) {
                
            });

        });
    });
}