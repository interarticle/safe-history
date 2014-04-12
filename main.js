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

	this.main = function () {
		$.get("https://raw.githubusercontent.com/interarticle/safe-history/master/heartbleed.txt", function(data) {
			// console.log(data);
			parse(data);
		})
	}
}

(function($, undefined) {
	var inst = new safeHistory();
	var heartB = new heartBleed();
	$(function() {
		$("#actionbtn").click(function() {
			heartB.main();
			inst.getHistory().then(function(data) {console.log(data)});
		});
	});
})(jQuery);


function avg(url) {
	return new Promise(function(resolve, reject) {
		$.get("http://www.avgthreatlabs.com/website-safety-reports/domain/" + url, function(data) {
			re = {
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
			re = {Computer : data.match(/Computer Threats: (\d+)/)[1],
				  Identity : data.match(/Identity Threats: (\d+)/)[1],
				  Annoyance : data.match(/Annoyance factors: (\d+)/)[1],
				  Rating : data.match(/<div class="community-text">[\s]+<label>(\d+\.\d+)/)[1]};
			resolve(re);
		});
	});
}