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

	$.get("https://raw.githubusercontent.com/interarticle/safe-history/master/data/heartbleed.txt", function(data) {
		heartBleedURL = data.split('\n');
		// console.log(data);
		// parse(heartBleedURL);
	})	

	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    currentUrl = tabs[0].url;
	});

	this.parse = function () {
		var urls = heartBleedURL;
		// var currentUrl = tabs[0].url;

		console.log(urls[0]);
		var currentDomain = new URI(currentUrl).hostname();
		console.log(currentDomain);

		for ( var i = 0; i < urls.length; i++ )
			if (currentDomain.indexOf(urls[i]) != -1)
				console.log("This website was vulnerable, you might wanna change your password!");

	}

	this.isHeartBleed = function (visitTime, historyURL) {
		var historyDomain = new URI(historyURL).hostname();
		if (visitTime < new Date(2014, 3, 8)) {
			console.log("historyURL: " + historyDomain);
			for( var i = 0; i < heartBleedURL.length; i++) { 
				if(historyDomain.indexOf(heartBleedURL[i]) != -1)
					console.log("heartbleed!");
			}
		}
	}

	this.main = function () {
		// $.get("https://raw.githubusercontent.com/interarticle/safe-history/master/data/heartbleed.txt", function(data) {
		// 	// console.log(data);
		// 	parse(data);
		// 	isHeartBleed(data);
		// })
	}
}

function safeHistoryMain($scope) {
	var inst = new safeHistory();
	var heartB = new heartBleed();
	$scope.history = [];
	$scope.action = function() {
		inst.getHistory().then(function(data) {
			$scope.$apply(function() {
				$scope.history = data;
			});
		});
		heartB.parse();
		heartB.isHeartBleed(new Date(2014, 2, 8), "https://www.yahoo.com/");
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
