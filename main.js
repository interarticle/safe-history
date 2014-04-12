"use strict";

function safeHistory() {
	this.getHistory = function() {
		chrome.history.search({"text": ""}, function(res) {
			console.log(res);
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
			inst.getHistory();
			heartB.main();
		});
	});
})(jQuery);


