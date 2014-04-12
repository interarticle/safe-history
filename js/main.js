"use strict";

function safeHistory() {
	this.getHistory = function(number, startTime, endTime) {
		var searchObject = {"text": ""};
		if (number) {
			searchObject['maxResults'] = number;
		}
		if (startTime) {
			searchObject['startTime'] = startTime;
		}
		if (endTime) {
			searchObject['endTime'] = endTime;
		}
		return new Promise(function(resolve) {
			chrome.history.search(searchObject, function(res) {
				resolve(res);
			});
		});
	}
}

function heartBleed () {
	var currentUrl;
	var heartBleedURL;

	$.get("https://raw.githubusercontent.com/interarticle/safe-history/master/heartbleed.txt", function(heartBleedURL) {
		// console.log(data);
		// parse(heartBleedURL);
	})	

	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    currentUrl = tabs[0].url;
	});

	var parse = function (data) {
		var urls = data.split('\n');
		// var currentUrl = tabs[0].url;

		console.log(urls[0]);
		var currentDomain = currentUrl.split('/')[2];
		console.log(currentDomain);

		for ( var i = 0; i < urls.length; i++ )
			if (currentDomain.indexOf(urls[i]) != -1)
				console.log("This website was vulnerable, you might wanna change your password!")

	}

	// var isHeartBleed = function (visitTime, historyURL) {
	// 	if (visitTime < new Date(2014, 3, 8)) {
	// 		var historyDomain = historyURL.split('/')[2];
	// 		for( var i = 0; i < urls.length; i++) {
	// 			if(historyDomain.indexOf())
	// 		}
	// 	}
	// }

	this.main = function () {
		$.get("https://raw.githubusercontent.com/interarticle/safe-history/master/data/heartbleed.txt", function(data) {
			// console.log(data);
			parse(data);
			isHeartBleed(data);
		})
	}
}

function safeHistoryMain($scope) {
	var inst = new safeHistory();
	var heartB = new heartBleed();
	$scope.history = [];
	$scope.action = function() {
		inst.getHistory().then(function(data) {
			// Filter data to eliminate duplicate hostnames
			var hostnameFilter = {};
			$scope.$apply(function() {
				$scope.history = data;
			});
		});
		heartB.main();
	};
}


function avg(url) {
	return new Promise(function(resolve, reject) {
		$.get("http://www.avgthreatlabs.com/website-safety-reports/domain/" + url, function(data) {
			var re = {
				Rating : data.match(/<span itemprop="average" id="percentage">(\d+%)<\/span>/)[1],
				Type : data.match(/<h2 class="green">(.+)<\/h2>/)[1]
				};
			resolve(re);
		});
	});
}

function norton(addr) {
	return new Promise(function(resolve, reject) {
		$.get("https://safeweb.norton.com/report/show",{url:addr, ulang:"eng"},
		function(data) {
			var re = {Computer : data.match(/Computer Threats: (\d+)/)[1],
				  Identity : data.match(/Identity Threats: (\d+)/)[1],
				  Annoyance : data.match(/Annoyance factors: (\d+)/)[1],
				  Rating : data.match(/<div class="community-text">[\s]+<label>(\d+\.\d+)/)[1]};
			resolve(re);
		});
	});
}

function getWOTRate(url_list) {
    return new Promise(function(resolve) {
        var params = "";
        for (var i = 0; i < url_list.length; i++) {
            params = params + url_list[i] + "/";
        }
        $.get(
            "http://api.mywot.com/0.4/public_link_json2?hosts=" + params + "&key=683b9b246d59621df5d3dd8ae88a69e7104c0bdf",
            function (data) {
                result = [];
                $.each(data, function(key, val) {
                    entry = {};
                    entry["site"] = val["target"];
                    if (val["0"] != null) {
                        var rate_sum = 0;
                        for (var i = 0; i < val["0"].length; i++) {
                            rate_sum += val["0"][i];
                        }
                        entry["wot_rate"] = Math.floor(rate_sum / val["0"].length);
                    } else {
                        entry["wot_rate"] = "Not available"
                    }
                    result.push(entry);
                })
                resolve(result);
            },
            "json"
        )
    })
}

function getGoogleSafeBrowsingRate(url_list) {
    return new Promise(function(resolve) {
        var params = url_list.length;
        for (var i = 0; i < url_list.length; i++) {
            params = params + "\n" + url_list[i];
        }
        $.ajax({
            type: "POST",
            url: "https://sb-ssl.google.com/safebrowsing/api/lookup?client=firefox&apikey=ABQIAAAAnz8NMTU8sfDxwFqx36NDsRQ3PTNICuN5Fwsgomuke8FxMfY_PA&appver=1.5.2&pver=3.0",
            data: params
        }).done( function (data) {
            data = data.trim().split("\n")

            result = [];
            for (var i = 0; i < data.length; i++) {
                entry = {};
                entry["site"] = url_list[i];
                entry["google_rate"] = data[i];
                result.push(entry);
            }
            resolve(result);
        });
    })
}
