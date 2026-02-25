// =============================================
// content.js - Runs on tracked social media sites
// Handles: time tracking, scroll detection, overlay warnings
// =============================================

// --- TIME TRACKING ---

let sessionStartTime = null; // When the user started on this page
let totalTimeOnSite = 0; // Total seconds spent (this session)
let timerInterval = null; // Interval ID for the timer
const TIME_WARNING_THRESHOLD = 15 * 60; // 15 minutes in seconds

// Start the timer when the page loads (tab is active)
function startTimer() {
  if (timerInterval) return; // Don't start if already running
  sessionStartTime = Date.now();
  timerInterval = setInterval(() => {
    // Calculate total time: previous time + current active stretch
    const currentStretch = Math.floor((Date.now() - sessionStartTime) / 1000);
    const displayTime = totalTimeOnSite + currentStretch;

    // Save to storage so popup can read it
    chrome.storage.local.set({ timeOnSite: displayTime });

    // Show warning if over 15 minutes
    if (displayTime >= TIME_WARNING_THRESHOLD) {
      const minutes = Math.floor(displayTime / 60);
      showWarning(
        `You've been on social media for ${minutes} minutes. Time to refocus! 🚀`
      );
    }
  }, 1000); // Update every second
}

// Pause the timer when tab becomes inactive
function pauseTimer() {
  if (timerInterval) {
    // Add the current stretch to total time
    const currentStretch = Math.floor((Date.now() - sessionStartTime) / 1000);
    totalTimeOnSite += currentStretch;
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Listen for tab visibility changes (user switches away/back)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseTimer();
  } else {
    startTimer();
  }
});

// Start timer immediately when content script loads
startTimer();

// --- SCROLL TRACKING ---

let scrollTimestamps = []; // Array of recent scroll event timestamps
const SCROLL_WARNING_THRESHOLD = 100; // Max scroll events in 2 minutes
const SCROLL_WINDOW = 2 * 60 * 1000; // 2 minutes in milliseconds

// Listen for scroll events on the page
window.addEventListener(
  "scroll",
  () => {
    const now = Date.now();
    scrollTimestamps.push(now);

    // Remove scroll events older than 2 minutes
    const twoMinutesAgo = now - SCROLL_WINDOW;
    scrollTimestamps = scrollTimestamps.filter((t) => t > twoMinutesAgo);

    // Save scroll count so popup can read it
    chrome.storage.local.set({ scrollCount: scrollTimestamps.length });

    // Show warning if scrolling too much
    if (scrollTimestamps.length >= SCROLL_WARNING_THRESHOLD) {
      showWarning("You've been scrolling a lot. Maybe take a break ✋");
    }
  },
  { passive: true }
); // passive: true for better scroll performance

// --- LISTEN FOR MESSAGES FROM BACKGROUND SCRIPT ---

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TAB_SWITCH_WARNING") {
    showWarning(
      `You've switched tabs ${message.count} times in 10 minutes. Time to refocus 🚀`
    );
  }
});

// --- WARNING OVERLAY ---

let currentOverlay = null; // Track current overlay (only show one at a time)
let warningCooldown = false; // Prevent spam warnings

function showWarning(message) {
  // Don't show if there's already a warning or we're in cooldown
  if (currentOverlay || warningCooldown) return;

  // Create the overlay container
  const overlay = document.createElement("div");
  overlay.id = "procrastination-warning";
  overlay.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    max-width: 340px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 20px 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    border-left: 4px solid #f97316;
    animation: procrastination-slide-in 0.3s ease-out;
    opacity: 0.97;
  `;

  // Create the message text
  const text = document.createElement("p");
  text.textContent = message;
  text.style.cssText = `
    margin: 0 0 14px 0;
    font-size: 14px;
    line-height: 1.5;
    color: #1a1a1a;
    font-weight: 500;
  `;

  // Create the dismiss button
  const button = document.createElement("button");
  button.textContent = "Got it ✓";
  button.style.cssText = `
    background: #f97316;
    color: #ffffff;
    border: none;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
  `;
  button.onmouseover = () => (button.style.background = "#ea580c");
  button.onmouseout = () => (button.style.background = "#f97316");
  button.onclick = () => {
    overlay.style.animation = "procrastination-slide-out 0.2s ease-in forwards";
    setTimeout(() => {
      overlay.remove();
      currentOverlay = null;
    }, 200);
    // 60 second cooldown before showing another warning
    warningCooldown = true;
    setTimeout(() => (warningCooldown = false), 60000);
  };

  // Add animation keyframes (injected once)
  if (!document.getElementById("procrastination-styles")) {
    const style = document.createElement("style");
    style.id = "procrastination-styles";
    style.textContent = `
      @keyframes procrastination-slide-in {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 0.97; }
      }
      @keyframes procrastination-slide-out {
        from { transform: translateX(0); opacity: 0.97; }
        to { transform: translateX(100px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Assemble and show the overlay
  overlay.appendChild(text);
  overlay.appendChild(button);
  document.body.appendChild(overlay);
  currentOverlay = overlay;

  // Auto-dismiss after 15 seconds
  setTimeout(() => {
    if (currentOverlay === overlay) {
      button.click();
    }
  }, 15000);
}