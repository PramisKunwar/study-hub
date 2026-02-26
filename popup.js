// =============================================
// popup.js - Updates the popup UI with current stats
// Reads data from chrome.storage.local
// =============================================

// Run when the popup opens
document.addEventListener("DOMContentLoaded", () => {
  // Get all stored values at once
  chrome.storage.local.get(
    ["timeOnSite", "tabSwitchCount", "scrollCount"],
    (data) => {
      // --- Time on Social Media ---
      const totalSeconds = data.timeOnSite || 0;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeEl = document.getElementById("time-value");
      timeEl.textContent = `${minutes}m ${seconds}s`;

      // Add warning class if over 15 minutes
      if (totalSeconds >= 15 * 60) {
        timeEl.classList.add("warning");
      }

      // --- Tab Switches ---
      const tabCount = data.tabSwitchCount || 0;
      const tabEl = document.getElementById("tab-value");
      tabEl.textContent = tabCount;

      // Add warning class if over 20 switches
      if (tabCount >= 20) {
        tabEl.classList.add("warning");
      }

      // --- Scroll Activity ---
      const scrollCount = data.scrollCount || 0;
      const scrollEl = document.getElementById("scroll-value");

      // Show a simple text label based on scroll activity
      if (scrollCount >= 100) {
        scrollEl.textContent = "High ⚠️";
        scrollEl.classList.add("warning");
      } else if (scrollCount >= 50) {
        scrollEl.textContent = "Medium";
      } else {
        scrollEl.textContent = "Low";
      }
    }
  );
});