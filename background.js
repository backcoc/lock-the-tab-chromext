chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ lockedUrls: [], pin: "745123" }); // Default PIN
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.sync.get(["lockedUrls"], ({ lockedUrls }) => {
      if (lockedUrls.some((url) => tab.url.includes(url))) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["content.js"],
        });
      }
    });
  });
  