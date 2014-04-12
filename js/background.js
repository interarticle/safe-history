chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "chrome-extension://nholglpomhkenpcodbbkdeehnbdhcfgm/index.html";
  chrome.tabs.create({ url: newURL });
});