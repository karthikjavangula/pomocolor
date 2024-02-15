document.addEventListener("DOMContentLoaded", function () {
    console.log('popup.js loaded');
    // Get elements
    const settingsIcon = document.getElementById("settingsIcon");
    const enableSyncToggle = document.getElementById("enableSyncToggle");
    const wledOnButton = document.getElementById("wledOnButton");
    const wledOffButton = document.getElementById("wledOffButton");

    // Event listener for settings icon
    settingsIcon.addEventListener("click", function () {
        // Open the settings page in a new tab
        chrome.tabs.create({ url: "settings.html" });
    });

    // Load the extensionConfig from chrome.storage.local
    chrome.storage.local.get(['extensionConfig'], function (result) {
        const extensionConfig = result.extensionConfig;
        
        if (extensionConfig && extensionConfig.sync !== undefined) {
            // Set the state of the toggle switch based on extensionConfig.sync
            enableSyncToggle.checked = extensionConfig.sync;
        }
    });

    // Event listener for enable sync toggle
    enableSyncToggle.addEventListener("change", function () {
        // Update the extensionConfig in chrome.storage.local
        chrome.storage.local.get(['extensionConfig'], function (result) {
            const extensionConfig = result.extensionConfig || {};
            extensionConfig.sync = enableSyncToggle.checked;

            // Save the updated extensionConfig back to chrome.storage.local
            chrome.storage.local.set({ extensionConfig: extensionConfig }, function () {
                console.log("{WLED_ACTION}Extension Config updated:", extensionConfig);
            });
        });
    });

    // Event listener for WLED ON button
    wledOnButton.addEventListener("click", function () {
        // Placeholder for functionality to be implemented
        // console.log("{WLED_ACTION}WLED ON button clicked");
        chrome.storage.local.get(['extensionConfig'], function (result) {
            const extensionConfig = result.extensionConfig;
            wled_url = "http://" + extensionConfig.wled_ip + "/json/state";
            wled_body = {"on":true};
            fetch(wled_url, {
                method: 'POST',
                body: JSON.stringify(wled_body)
            });
        });
    });

    // Event listener for WLED OFF button
    wledOffButton.addEventListener("click", function () {
        // Placeholder for functionality to be implemented
        // console.log("{WLED_ACTION}WLED OFF button clicked");
        chrome.storage.local.get(['extensionConfig'], function (result) {
            const extensionConfig = result.extensionConfig;
            wled_url = "http://" + extensionConfig.wled_ip + "/json/state";
            wled_body = {"on":false};
            fetch(wled_url, {
                method: 'POST',
                body: JSON.stringify(wled_body)
            });
        });
    });
});
