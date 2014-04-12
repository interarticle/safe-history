"use strict";

function safeHistory() {
	this.getHistory = function() {
		chrome.history.search({"text": ""}, function(res) {
			console.log(res);
		});
	}
}

(function($, undefined) {
	var inst = new safeHistory();
	$(function() {
		$("#actionbtn").click(function() {
			inst.getHistory();
			$.get("https://raw.githubusercontent.com/interarticle/safe-history/master/README.md", function(data) {
				console.log(data);
			})
		});
	});
})(jQuery);