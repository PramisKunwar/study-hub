# 🎯 Procrastination Detector

A simple Chrome Extension that detects procrastination behavior and gently nudges you back to focus.

## What It Does

The extension monitors three behavioral signals on social media sites and shows a motivational warning overlay when thresholds are crossed:

| Signal | Threshold | Warning |
|---|---|---|
| ⏱️ Time on Social Media | 15+ minutes continuously | "You've been on social media for X minutes. Time to refocus! 🚀" |
| 🔄 Tab Switches | 20+ in 10 minutes | "You've switched tabs X times in 10 minutes. Time to refocus 🚀" |
| 📜 Scroll Activity | 100+ events in 2 minutes | "You've been scrolling a lot. Maybe take a break ✋" |

## Tracked Sites

Only these domains are monitored:

- `youtube.com`
- `instagram.com`
- `twitter.com` / `x.com`
- `tiktok.com`
- `reddit.com`

## File Structure

```
├── chrome-extension/          # Chrome Extension (load this folder)
│   ├── manifest.json          # Extension config (Manifest V3)
│   ├── background.js          # Tab switch detection (service worker)
│   ├── content.js             # Time tracking, scroll detection, warning overlay
│   ├── popup.html             # Popup UI structure
│   ├── popup.css              # Popup styling
│   └── popup.js               # Popup data display logic
│
├── src/                       # Landing page (React + Vite)
│   ├── pages/
│   │   └── Index.tsx          # Landing page with install instructions
│   ├── components/            # Shared UI components
│   ├── index.css              # Global styles & design tokens
│   ├── App.tsx                # App router
│   └── main.tsx               # Entry point
│
├── index.html                 # Vite entry HTML
├── tailwind.config.ts         # Tailwind configuration
├── vite.config.ts             # Vite configuration
└── package.json               # Dependencies
```

## How Each File Works

### `manifest.json`
Configures the extension using **Manifest V3**. Declares permissions (`storage`, `tabs`, `activeTab`), restricts host access to tracked domains only, and registers the popup, background service worker, and content script.

### `background.js`
Listens for `chrome.tabs.onActivated` events. Maintains a rolling array of tab-switch timestamps (last 10 minutes). If switches exceed 20, sends a `TAB_SWITCH_WARNING` message to the active tab's content script.

### `content.js`
Runs on tracked sites only. Handles three things:
- **Time tracking** — starts/pauses a timer based on tab visibility, saves seconds to `chrome.storage.local`
- **Scroll tracking** — counts scroll events in a 2-minute rolling window
- **Warning overlay** — displays a dismissible floating card (bottom-right) with a 60-second cooldown between warnings

### `popup.html` / `popup.css` / `popup.js`
The extension popup UI. When opened, `popup.js` reads stats from `chrome.storage.local` and displays current session time, tab switch count, and scroll activity level. Values turn orange when thresholds are exceeded.

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `chrome-extension` folder from this project
6. The extension icon 🎯 will appear in your toolbar

## Testing

1. Navigate to any tracked site (e.g., `youtube.com`)
2. The timer starts automatically — check the popup after a few seconds
3. Switch between tabs rapidly to trigger the tab-switch warning
4. Scroll quickly on a tracked site to trigger the scroll warning
5. Warnings appear as a floating card in the bottom-right corner

## Tech Stack

- **Extension**: Vanilla JavaScript, Chrome Extension Manifest V3
- **Landing Page**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui

## Simplicity Rules

This project intentionally does **not** include:
- AI or machine learning
- User accounts or cloud databases
- Analytics dashboards, charts, or graphs
- External APIs or notification systems
- Customizable settings or dark mode
