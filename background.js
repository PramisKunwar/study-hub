// =============================================
// background.js - Handles tab switching detection
// =============================================

// Array to store timestamps of recent tab switches
let tabSwitchTimestamps = [];

// Listen for when the user switches to a different tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  const now = Date.now();

  // Add current timestamp to the array
  tabSwitchTimestamps.push(now);

  // Remove timestamps older than 10 minutes (600,000 ms)
  const tenMinutesAgo = now - 10 * 60 * 1000;
  tabSwitchTimestamps = tabSwitchTimestamps.filter((t) => t > tenMinutesAgo);

  // Save the count to storage so popup.js and content.js can read it
  chrome.storage.local.set({ tabSwitchCount: tabSwitchTimestamps.length });

  // If tab switches exceed 20 in 10 minutes, warn the active tab
  if (tabSwitchTimestamps.length >= 20) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab && tab.url) {
        // Only send warning to tracked sites
        const trackedDomains = [
          "youtube.com",
          "instagram.com",
          "twitter.com",
          "x.com",
          "tiktok.com",
          "reddit.com",
        ];
        const isTracked = trackedDomains.some((domain) =>
          tab.url.includes(domain)
        );
        if (isTracked) {
          chrome.tabs.sendMessage(activeInfo.tabId, {
            type: "TAB_SWITCH_WARNING",
            count: tabSwitchTimestamps.length,
          });
        }
      }
    });
  }
});
