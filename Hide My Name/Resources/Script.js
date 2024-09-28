function show(enabled, useSettingsInsteadOfPreferences) {
    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('state-on')[0].innerText = "Hide My Name’s extension is currently on. To generate names, control-click the text input area in Safari, and then choose Hide My Name from the shortcut menu.";
        document.getElementsByClassName('state-off')[0].innerText = "Hide My Name’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('state-unknown')[0].innerText = "You can turn on Hide My Name’s extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('open-preferences')[0].innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage({ action: "open-preferences" });
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);

document.querySelector("#locale-picker").addEventListener("change", function() {
    const selectedLocale = this.value;
    // Send the selected locale to the extension
    webkit.messageHandlers.controller.postMessage({ action: "locale-changed", locale: selectedLocale });
});

function fetchLocale() {
    webkit.messageHandlers.controller.postMessage({ action: "fetch-locale"});
}

document.addEventListener("DOMContentLoaded", fetchLocale);
