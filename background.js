// background.js (service worker)

chrome.runtime.onInstalled.addListener(function (details) {
    // if (details.reason === 'install' || details.reason === 'update') { // Uncomment this line to force a refresh of the colorMap and defaultConfig
    if (details.reason === 'install') {    
        console.log("reason:", details.reason);
        fetch('colorMap.json')
            .then(response => {
                console.log('First run: fetching colorMap.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(colorMap => {
                console.log(colorMap);
                chrome.storage.local.set({colorMap: colorMap});
                console.log('colorMap stored successfully');
            })
            .catch(err => console.log(err));
        fetch('defaultConfig.json')
            .then(response => {
                console.log('First run: fetching defaultConfig.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(defaultConfig => {
                console.log(defaultConfig);
                chrome.storage.local.set({extensionConfig: defaultConfig});
                console.log('defaultConfig stored successfully');
            });
    }
});

let timeoutId = null; // Global timeoutId

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const color = message.color;
    const blinkAtFirst = message.blinkAtFirst;
    // let extensionConfig = null; // Modified: Changed const to let
    // let timeoutId = null; // Modified: Added null check for timeoutId

    if (message.action === 'updateWLED') {
        chrome.storage.local.get(['extensionConfig'], function (result) {
            console.log('extensionConfig loaded from storage:', result.extensionConfig);
            let extensionConfig = result.extensionConfig;

            if (!extensionConfig.sync) { // Modified: Added null check for extensionConfig
                console.log('Sync is disabled. Not updating WLED.');
                return false;
            }

            console.log('{WLED}updateWLED called with color:', color.name, color.default_hex, color.user_hex, 'blinkAtFirst:', blinkAtFirst);
            const wled_ip = extensionConfig.wled_ip;
            const wled_default_id = extensionConfig.wled_default_id;
            const wled_blink_id = extensionConfig.wled_blink_id;

            // Send POST request to WLED with body = {"on":true, "ps":wled_default_id, "seg":[{"id":0, "col":[[red_val,green_val,blue_val]]}]}
            // First convert hex to RGB:
            const red_val = parseInt(color.user_hex.substring(1,3), 16);
            const green_val = parseInt(color.user_hex.substring(3,5), 16);
            const blue_val = parseInt(color.user_hex.substring(5,7), 16);
            const wled_url = "http://" + wled_ip + "/json/state";

            if (blinkAtFirst) {
                // If the color changes within 4 seconds, clear the timeout
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    console.log('Aborted solid color update due to new color change');
                }

                // Log that we are setting the WLED to blink mode
                console.log('{WLED}Setting WLED to blink mode with color:', color.name, 'ip:', extensionConfig.wled_ip, 'effect id:', extensionConfig.wled_blink_id);
                const wled_ps_body = {"on":true, "ps":wled_blink_id};
                const wled_seg_body = {"on":true, "seg":[{"id":0, "col":[[red_val,green_val,blue_val]]}]};
                console.log(wled_ps_body, wled_seg_body);
                fetch(wled_url, {
                    method: 'POST',
                    body: JSON.stringify(wled_ps_body)
                })
                .then(function() {
                    fetch(wled_url, {
                    method: 'POST',
                    body: JSON.stringify(wled_seg_body)
                    });
                });
                // After 4 seconds, set the WLED to solid mode
                timeoutId = setTimeout(function() {
                    console.log('{WLED}Setting WLED to solid mode with color:', color.name, 'ip:', extensionConfig.wled_ip, 'effect id:', extensionConfig.wled_default_id);
                    const wled_ps_body = {"on":true, "ps":wled_default_id};
                    const wled_seg_body = {"on":true, "seg":[{"id":0, "col":[[red_val,green_val,blue_val]]}]};
                    fetch(wled_url, {
                        method: 'POST',
                        body: JSON.stringify(wled_ps_body)
                    })
                    .then(function() {
                        fetch(wled_url, {
                        method: 'POST',
                        body: JSON.stringify(wled_seg_body)
                        });
                    });
                }, 4000);
            } else {
                // Log that we are setting the WLED to solid mode
                console.log('{WLED}Setting WLED to solid mode with color:', color.name, 'ip:', extensionConfig.wled_ip, 'effect id:', extensionConfig.wled_default_id);
                const wled_ps_body = {"on":true, "ps":wled_default_id};
                const wled_seg_body = {"on":true, "seg":[{"id":0, "col":[[red_val,green_val,blue_val]]}]};
                fetch(wled_url, {
                    method: 'POST',
                    body: JSON.stringify(wled_ps_body)
                })
                .then(function() {
                    fetch(wled_url, {
                    method: 'POST',
                    body: JSON.stringify(wled_seg_body)
                    });
                });
            }
        });
        return true;
    }
});
