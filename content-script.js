// import MutationObserver from 'mutation-observer'; // Import the MutationObserver class

// const className = 'sc-cLQEGU';
// const className = 'sc-lkqHmb';
const getColoringClass = (extensionConfig) => {
    const targetElements = document.getElementsByClassName(extensionConfig.coloringClassName);
    if (targetElements.length > 0) {
        const targetElement = targetElements[0];
        const coloringClass = targetElement.className.split(' ')[1];
        console.log('Coloring class:', coloringClass);
        return coloringClass;
    } else {
        console.log('Failed to find Coloring class. Please check the defaultConfig.json');
        return null;
    }
};

let timeoutId = null;

function updateWLED(color, blinkAtFirst=true) {
    chrome.runtime.sendMessage({ action: 'updateWLED', color, blinkAtFirst}, response => {
        if (response.success) {
            console.log('WLED update successful');
        } else {
            console.error('WLED update failed');
        }
    });
}   


function watchColorChanges(colorMap, extensionConfig) {
    let previousColor = getColoringClass(extensionConfig);
    console.log("got previous color", previousColor);
    if (previousColor && colorMap[previousColor]) {
        console.log('{WLED}Initial color:', previousColor, colorMap[previousColor].name);
        updateWLED(colorMap[previousColor], false);
    }
    else {
        console.log('colorMap.json and extensionConfig.json are out of date. Please update them.');
    }

    const observer = new MutationObserver(() => {
        const currentColor = getColoringClass(extensionConfig);

        if (currentColor !== previousColor) {
            console.log('Color changed:', currentColor);
            if (!colorMap[currentColor]) {
                console.log('Color not found in colorMap.json');
                return;
            }
            console.log(colorMap[currentColor].name);
            updateWLED(colorMap[currentColor]);
            previousColor = currentColor;
        }
    });

    const targetNode = document.body;

    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    observer.observe(targetNode, config);
}

console.log('contentScript.js loaded');

chrome.storage.local.get(['colorMap'], function (result) {
    console.log('colorMap loaded from storage:', result.colorMap);
    colorMap = result.colorMap;
});

chrome.storage.local.get(['extensionConfig'], function (result) {
    console.log('extensionConfig loaded from storage:', result.extensionConfig);
    extensionConfig = result.extensionConfig;
});

window.onload = function () {
    watchColorChanges(colorMap, extensionConfig);
};