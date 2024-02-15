let colorMap = {}; // Global variable to store color map
let unsavedChanges = false; // Flag to track unsaved changes

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the colorMap from Chrome storage
    chrome.storage.local.get("colorMap", function(data) {
        colorMap = data.colorMap || {};

        // Get the colorMapperContainer element
        const colorMapperContainer = document.getElementById("colorMapperContainer");

        // Populate the color mapper rows dynamically
        Object.keys(colorMap).forEach(key => {
            const colorRow = document.createElement("div");
            colorRow.classList.add("color-mapper-row");

            const defaultButton = createButton(key, "default-color-button", colorMap[key].default_hex);
            const userButton = createButton(key, "user-color-button", colorMap[key].user_hex);

            // Add event listener to userButton to open color picker
            userButton.addEventListener("click", function() {
                openColorPicker(userButton, key);
            });

            colorRow.appendChild(defaultButton);
            colorRow.appendChild(userButton);

            colorMapperContainer.appendChild(colorRow);
        });

        // Add event listener to save button
        const saveButton = document.getElementById("saveButton");
        saveButton.addEventListener("click", function() {
            saveColors();
            unsavedChanges = false;
        });

        // Set up event listener for beforeunload
        window.addEventListener("beforeunload", function(event) {
            if (unsavedChanges) {
                const message = "You have unsaved changes. Are you sure you want to leave?";
                event.returnValue = message;
                return message;
            }
        });
    });
});

function createButton(id, className, color) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add(className);
    button.textContent = color;
    button.style.backgroundColor = color;

    return button;
}

function openColorPicker(button, key) {
    // Calculate position for the color picker
    const rect = button.getBoundingClientRect();

    const colorPicker = document.createElement("input");
    colorPicker.style.position = "absolute";
    colorPicker.type = "color";
    colorPicker.value = button.style.backgroundColor;
    // colorPicker.style.position = "absolute";
    colorPicker.style.left = rect.left + window.scrollX + "px";
    colorPicker.style.top = rect.bottom + window.scrollY + "px";

    const originalColor = colorPicker.value;

    // Add event listener to input event
    colorPicker.addEventListener("input", function() {
        // Update button color and label as the user changes the color
        button.style.backgroundColor = colorPicker.value;
        button.textContent = colorPicker.value.toUpperCase();
        console.log("{WLED} Sending Solid Color to WLED: ", colorPicker.value.toUpperCase());
        chrome.storage.local.get(['extensionConfig'], function (result) {
            const extensionConfig = result.extensionConfig;
            const wled_ip = extensionConfig.wled_ip;
            const wled_default_id = extensionConfig.wled_default_id;

            // Send POST request to WLED with body = {"on":true, "ps":wled_default_id, "seg":[{"id":0, "col":[[red_val,green_val,blue_val]]}]}
            // First convert hex to RGB:
            const red_val = parseInt(colorPicker.value.substring(1,3), 16);
            const green_val = parseInt(colorPicker.value.substring(3,5), 16);
            const blue_val = parseInt(colorPicker.value.substring(5,7), 16);
            const wled_url = "http://" + wled_ip + "/json/state";
            const wled_body = {"on":true, "ps":wled_default_id, "seg":[{"id":0, "col":[[red_val,green_val,blue_val]]}]};
            fetch(wled_url, {
                method: 'POST',
                body: JSON.stringify(wled_body)
            });
        });

        unsavedChanges = true;
    });

    // Add event listener to change event
    colorPicker.addEventListener("change", function() {
        // Update the colorMap object
        colorMap[key].user_hex = colorPicker.value;
    });

    // Prompt the user only when the color picker is canceled
    colorPicker.addEventListener("cancel", function() {
        const confirmed = confirm("Close the color picker without saving?");
        if (confirmed) {
            // Reset color picker to the original color if canceled
            colorPicker.value = originalColor;
            unsavedChanges = false;
        }
    });

    colorPicker.click(); // Trigger the color picker dialog
}

function saveColors() {
    // Save the updated colorMap to local storage
    chrome.storage.local.set({ colorMap: colorMap }, function() {
        alert("Colors saved!");
    });
}
