# Chrome Extension Development Progress

## Description
This markdown document tracks the progress of developing a Chrome extension that syncs the background color of the Pomodoro timer on pomofocus.io with WLED lights.

### Achieved Progress
1. Successfully extracting changes in the background color (contentScript.js).
2. Using chrome storage to store the colorMap, initialized on extension installation (background.js).

### Goals yet to Achieve

1. **Dummy WLED Communication Function**
   - Create a dummy function for WLED communication.
   - Always returns True for now.
   - Triggered each time the color updates.

2. **Asynchronous Scripting for WLED Effects**
   - Make WLED blink for 4-5 seconds on color change.
   - Set to a solid glow afterward.
   - Handle asynchronous calls effectively.

3. **Color Change Handling**
   - Abort solid color update if color changes within 4-5 seconds.
   - Prevent clashes from multiple calls.

4. **Config Object Implementation**
   - Store a JSON object called config in chrome storage.
   - Include WLED IP address and flags.
   - Implement the WLED communication function using config.

5. **Popup UI Implementation**
   - Create popup.html, popup.js, and popup.css.
   - Include toggle switch for syncing, button to turn off WLED, and IP address update field.
   - Optionally, add a colored status indicator for WLED connection.

6. **Optimization and Stress Testing**
   - Optimize extension performance.
   - Conduct stress tests to ensure stability.

7. **Deployment and Open Sourcing**
   - Deploy to Chrome Web Store.
   - Open-source the extension on GitHub.

### Next Steps
- Begin with the implementation of the dummy WLED communication function.
- Progressively work through goals, addressing asynchronous scripting, color change handling, and config object implementation.
- Develop the popup UI for user interaction.
- Conduct optimization and stress testing to ensure robust functionality.
- Prepare for deployment to the Chrome Web Store and open-source release on GitHub.

This document will be updated as progress is made.