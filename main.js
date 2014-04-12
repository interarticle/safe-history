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

(function($, undefined) {
	var inst = new safeHistory();
	$(function() {
		$("#actionbtn").click(function() {
			inst.getHistory().then(function(data) {console.log(data)});
		});
	});
})(jQuery);