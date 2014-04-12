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

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);
   $('#warning').text(tabs[0].url);

});
