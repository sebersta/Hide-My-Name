safari.self.addEventListener("message", onMessageReceive, false);

function onMessageReceive(event) {
    if (event.name === "generateName" && event.message.firstName && event.message.lastName && event.message.fullName) {
        
        insertIntoFocusedElement(event.message.firstName, event.message.lastName, event.message.fullName);
    }
}

function insertIntoFocusedElement(firstName, lastName, fullName) {
    var focusedElement = document.activeElement;

    if (focusedElement && (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA')) {
        // Get the id or name of the focused element
        var elementId = focusedElement.id.toLowerCase();
        var elementName = focusedElement.name.toLowerCase();

        // Determine whether to insert full name, first name, or last name
        if (elementId.includes('fullname') || elementId.includes('full-name') || (elementId.includes('first') && elementId.includes('last')) ||
            elementName.includes('fullname') || elementName.includes('full-name') || (elementId.includes('first') && elementId.includes('last'))) {
            // Insert full name if the element id or name suggests a full name field
            focusedElement.value = fullName;
        } else if (elementId.includes('first') || elementId.includes('firstname') || elementId.includes('first-name') || elementId.includes('full-name') ||
                   elementName.includes('first') || elementName.includes('firstname') || elementName.includes('first-name')) {
            // Insert first name if the element id or name suggests a first name field
            focusedElement.value = firstName;
        } else if (elementId.includes('last') || elementId.includes('lastname') || elementId.includes('last-name') ||
                   elementName.includes('last') || elementName.includes('lastname') || elementName.includes('last-name')) {
            // Insert last name if the element id or name suggests a last name field
            focusedElement.value = lastName;
        } else {
            // Default: insert full name if no match is found
            focusedElement.value = fullName;
        }

        // Dispatch 'input' and 'change' events to ensure the changes are recognized
        var inputEvent = new Event('input', { bubbles: true });
        focusedElement.dispatchEvent(inputEvent);

        var changeEvent = new Event('change', { bubbles: true });
        focusedElement.dispatchEvent(changeEvent);
    }
}
