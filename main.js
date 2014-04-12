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
			inst.getHistory().then(function(data) {
				console.log(data);
				for (var i = 0; i < data.length; i++) {
					$("#data").append($("<div>").text(data[i]['url']));
				}
			});
			heartB.main();
		});
	});
})(jQuery);
