"use strict";
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
    $('.button1').click(function() {
        $('#myRoundabout').roundabout_animateToNextChild();
    });
});

function loadData() {
    return new Promise(function(resolve, reject) {
        var thb = new thumbnailHandler();
        var inst = new safeHistory();
        var heartB = new heartBleed();
        Promise.all([
            heartB.ctor,
            thb.ctor]).then(function() {
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

                    value.printableDate = new Date(value.lastVisitTime).toString();
                    hostnames[hostname] = (value);
                });
                // console.log(hostnames);

                var sites = Object.keys(hostnames);


                $.each(hostnames, function(index, value) {
                    value.heartBleed = heartB.isHeartBleed(new Date(value.lastVisitTime), value.url);
                });

                Promise.all([
                    getWOTRate(sites).then(function(results) {
                        $.each(results, function(index, result) {
                            var value = hostnames[sites[index]];
                            value.wotRating = result.wot_rate;
                        });
                    }),
                    getGoogleSafeBrowsingRate(sites).then(function(results) {
                        $.each(results, function(index, result) {
                            var value = hostnames[sites[index]];
                            value.googleRating = result.google_rate;
                        });
                    })
                ]).then(function() {
                    var good = [];
                    var bad = [];
                    var result = [];
                    $.each(hostnames, function(index, value) {
                        if ((value.wotRating =="Not available" || value.wotRating >= 50) 
                            && value.googleRating == "ok"
                            && value.heartBleed == false) {
                            value.verdict= "good";
                            good.push(value);
                        } else {
                            value.verdict = "bad";
                            bad.push(value);
                        }
                    });
                    var goodCopy = good;
                    var badCopy = bad;
                    var heartBleed = badCopy.filter(function (o) { return o.heartBleed; });
                    // console.log(good);
                    // console.log(bad);
                    for (var i = 0 ; i < 5 ; i++) {
                        if (bad.length <= 0) {
                            break;
                        }
                        var idx=Math.floor(Math.random()*bad.length);
                        var tmp = bad.splice(idx, 1)[0];
                        if (tmp.heartBleed == true) {
                            var badDup = bad;
                            bad = [];
                            $.each(badDup, function(index, value) {
                                if (!value.heartBleed) {
                                    bad.push(value);
                                }
                            });
                        }
                        result.push(tmp);
                    }

                    while(result.length < 10) {
                        if (good.length <= 0) {
                            break;
                        }
                        var idx=Math.floor(Math.random()*good.length);
                        result.push(good.splice(idx, 1)[0]);
                    }
                    for(var j, x, i = result.length; i; j = Math.floor(Math.random() * i), x = result[--i], result[i] = result[j], result[j] = x);
                    // console.log(result);
                    resolve({
                        result: result,
                        good: goodCopy,
                        bad: badCopy,
                        heartBleed: heartBleed
                    });
                });

                // console.log(hostnames);
            });
        });
    });
}