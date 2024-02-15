// import MutationObserver from 'mutation-observer'; // Import the MutationObserver class
const getColoringClass = () => {
    const targetElements = document.getElementsByClassName('sc-cLQEGU');
    if (targetElements.length > 0) {
        const targetElement = targetElements[0];
        const coloringClass = targetElement.className.split(' ')[1];
        return coloringClass;
    } else {
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


function watchColorChanges(colorMap) {
    let previousColor = getColoringClass();
    console.log('{WLED}Initial color:', previousColor, colorMap[previousColor].name);
    updateWLED(colorMap[previousColor], false);

    const observer = new MutationObserver(() => {
        const currentColor = getColoringClass();

        if (currentColor !== previousColor) {
            console.log('Color changed:', currentColor);
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
    watchColorChanges(colorMap);
};