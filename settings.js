let unsavedChanges = false; // Flag to track unsaved changes
document.addEventListener("DOMContentLoaded", function () {
    
    // Get elements
    const wledIPInput = document.getElementById("wledIP");
    const blinkEffectIDInput = document.getElementById("blinkEffectID");
    const defaultEffectIDInput = document.getElementById("defaultEffectID");
    const saveButton = document.getElementById("saveButton");
    
    // Load the extensionConfig from chrome.storage.local
    chrome.storage.local.get(['extensionConfig'], function (result) {
        const extensionConfig = result.extensionConfig;
        
        if (extensionConfig) {
            // Set input values based on extensionConfig
            wledIPInput.value = extensionConfig.wled_ip || "";
            blinkEffectIDInput.value = extensionConfig.wled_blink_id || "";
            defaultEffectIDInput.value = extensionConfig.wled_default_id || "";
        }
        
        input_groups.addEventListener("change", function () {
            unsavedChanges = true;
        });

        window.addEventListener("beforeunload", function(event) {
            if (unsavedChanges) {
                const message = "You have unsaved changes. Are you sure you want to leave?";
                event.returnValue = message;
                return message;
            }
        });

        // Event listener for Save button
        saveButton.addEventListener("click", function () {
            // Update the extensionConfig in chrome.storage.local
            chrome.storage.local.get(['extensionConfig'], function (result) {
                const extensionConfig = result.extensionConfig || {};
                
                // Update values from inputs
                extensionConfig.wled_ip = wledIPInput.value;
                extensionConfig.wled_blink_id = parseInt(blinkEffectIDInput.value, 10) || 0;
                extensionConfig.wled_default_id = parseInt(defaultEffectIDInput.value, 10) || 0;
                
                // Save the updated extensionConfig back to chrome.storage.local
                chrome.storage.local.set({ extensionConfig: extensionConfig }, function () {
                    console.log("Extension Config updated:", extensionConfig);
                    alert("Settings saved!");
                });
            });
        });
    
        
        colorMapButton.addEventListener("click", function () {
            // Open the color mapper page in a new tab
            chrome.tabs.create({ url: "color-mapper.html" });
        });
    });
    

});
