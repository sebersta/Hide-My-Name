safari.self.addEventListener("message", onMessageReceive, false);

function onMessageReceive(event) {
    if (event.name === "generateName" && event.message.firstName && event.message.lastName && event.message.fullName) {
        
        insertIntoFocusedElement(event.message.firstName, event.message.lastName, event.message.fullName);
    }
}

function insertIntoFocusedElement(firstName, lastName, fullName) {
    var focusedElement = document.activeElement;

    if (focusedElement) {
        // For standard inputs or textareas
        if (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
            insertValueIntoElement(focusedElement, firstName, lastName, fullName);
        }
        // For custom elements like hzn-input
        else if (focusedElement.tagName === 'HZN-INPUT') {
            // Attempt to access the input field inside the custom component
            var shadowRoot = focusedElement.shadowRoot || focusedElement;
            var internalInput = shadowRoot.querySelector('input');

            if (internalInput) {
                // If we find an internal input, insert the value into it
                insertValueIntoElement(internalInput, firstName, lastName, fullName);
            } else {
                // If no internal input is found, try using a custom API (if available)
                // Example: if hzn-input has a setValue method, you could do:
                // focusedElement.setValue(fullName); (this depends on the custom element implementation)
                console.log("Could not find internal input field in custom component.");
            }
        }
    }

    function insertValueIntoElement(element, firstName, lastName, fullName) {
        // Get the id or name of the element
        var elementId = element.id.toLowerCase();
        var elementName = element.name ? element.name.toLowerCase() : '';

        // Determine whether to insert full name, first name, or last name
        if (elementId.includes('fullname') || elementId.includes('full-name') || (elementId.includes('first') && elementId.includes('last')) ||
            elementName.includes('fullname') || elementName.includes('full-name') || (elementId.includes('first') && elementId.includes('last'))) {
            element.value = fullName;
        } else if (elementId.includes('first') || elementId.includes('firstname') || elementId.includes('first-name') ||
                   elementName.includes('first') || elementName.includes('firstname') || elementName.includes('first-name')) {
            element.value = firstName;
        } else if (elementId.includes('last') || elementId.includes('lastname') || elementId.includes('last-name') ||
                   elementName.includes('last') || elementName.includes('lastname') || elementName.includes('last-name')) {
            element.value = lastName;
        } else {
            // Default: insert full name if no match is found
            element.value = fullName;
        }

        // Dispatch 'input' and 'change' events to ensure the changes are recognized
        var inputEvent = new Event('input', { bubbles: true });
        element.dispatchEvent(inputEvent);

        var changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);
    }
}
