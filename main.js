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