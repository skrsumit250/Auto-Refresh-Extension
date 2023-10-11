let refreshInterval = null;
let currentWebsite = null;

function startRefreshing(interval) {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const url = new URL(tabs[0].url);
      currentWebsite = url.hostname; // Store the current website's domain
      refreshInterval = setInterval(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (newTabs) => {
          const newUrl = new URL(newTabs[0].url);
          if (newUrl.hostname === currentWebsite) {
            chrome.tabs.update(newTabs[0].id, { url: newTabs[0].url });
          }
        });
      }, interval * 1000);
    }
  });
}


// chrome.runtime.onInstalled.addListener(() => {
//   // Initialize the extension with a default interval (e.g., 10 seconds)
//   startRefreshing(100);
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRefresh') {
    startRefreshing(message.interval);
  } else if (message.action === 'stopRefresh') {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }
});
chrome.windows.onRemoved.addListener(windowId => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
});
