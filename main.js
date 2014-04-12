function safeHistory() {
	this.getHistory = function() {
	}
}

(function($, undefined) {
	var inst = new safeHistory();
	$(function() {
		$("#actionbtn").click(function() {
			console.log(inst.getHistory());
		});
	});
})(jQuery);

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);
   $('#warning').text(tabs[0].url);

});