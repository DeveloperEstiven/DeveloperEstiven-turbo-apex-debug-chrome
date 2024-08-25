console.log("🟢 service worker");

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.active) {
    updateIconBasedOnURL(tab);
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    updateIconBasedOnURL(tab);
  });
});

function updateIconBasedOnURL(tab) {
  const supportedPattern =
    /^https:\/\/[a-zA-Z0-9.-]+\.salesforce\.com\/.*\/apex\/debug\/ApexCSIPage/;

  const suffix = supportedPattern.test(tab.url) ? "" : "-gray";
  chrome.action.setIcon({
    path: {
      16: `images/icon-16${suffix}.png`,
      32: `images/icon-32${suffix}.png`,
      48: `images/icon-48${suffix}.png`,
    },
    tabId: tab.id,
  });
}
