// =============================================
// popup.js - Updates the popup UI with current stats
// Reads data from chrome.storage.local
// =============================================

// Run when the popup opens
document.addEventListener("DOMContentLoaded", () => {

  chrome.storgage.local.get(
    ["timeOnSite", "tabSwitchCount", "scrollCount"],
    (data) => {

      const totalSeconds = data.timeOnSite || 0;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeEl = document.getElementById("time-value");
      timeEl.textContent = `${minutes}m ${seconds}s`;


      if(totalSeconds >= 15 * 60) {
        timeEl.classList.add("warning");
      }

      const tabCount = data.tabSwitchCount || 0;
      const tabeEl = document.getElementById("tab-value");
      tabeEl.textContent = tabCount;

      if(tabCount >= 20) {
        tabeEl.classList.add("warning");
      }

      const scrollCount = data.scrollCount || 0;
      const scrollEl = document.getElementById("scroll-value");

      if(scrollCount >=100){
        scrollEl.textContent = "High ⚠️";
        scrollEl.classList.add("warning");
      } else if (scrollCount >=50) {
        scrollEl.textContent = "Medium";
      } else {
        scrollEl.textContent = "Low";
      }
  } );
});