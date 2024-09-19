//
//  SafariExtensionHandler.swift
//  Hide My Name Extension
//
//  Created by Jian Qin on 2024/9/17.
//

import SafariServices
import os.log
import Fakery

class SafariExtensionHandler: SFSafariExtensionHandler {

    var selectedLocale: String {
            if let sharedDefaults = UserDefaults(suiteName: "8HVQYZSB2F.Hide-My-Name"),
               let locale = sharedDefaults.string(forKey: "selectedLocale") {
                return locale
            } else {
                return "en-UK" // Default locale
            }
    }

    override func toolbarItemClicked(in window: SFSafariWindow) {
        os_log(.default, "The extension's toolbar item was clicked with locale %@", selectedLocale)
    }

    override func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        if #available(iOS 17.0, macOS 14.0, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = request?.userInfo?["profile"] as? UUID
        }

        os_log(.default, "The extension received a request for profile: %@", profile?.uuidString ?? "none")
    }

    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        if messageName == "localeChanged" {
            os_log(.default, "Dispatching locale change to script: %@", self.selectedLocale)
            page.dispatchMessageToScript(withName: "localeChanged", userInfo: ["locale": self.selectedLocale])
        } else {
            os_log(.default, "Unexpected message received: %@", messageName)
        }
    }

    override func contextMenuItemSelected(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil) {
        switch command {
        case "generateName":
            os_log(.default, "Context menu 'generateName' selected with locale %@", selectedLocale)
            // Generate a fake name using the updated locale
            let faker = Faker(locale: selectedLocale)
            let firstName = faker.name.firstName()
            let lastName = faker.name.lastName()
            let fullName = faker.name.name()
            // Send the generated name to the content script
            sendName(firstName: firstName, lastName: lastName, fullName: fullName, to: page)
        default:
            os_log(.default, "Unknown context menu command")
            break
        }
    }

    private func sendName(firstName: String, lastName: String, fullName: String, to page: SFSafariPage) {
        os_log(.default, "Sending generated name to page: %@ %@", firstName, lastName)
        page.dispatchMessageToScript(withName: "generateName", userInfo: ["firstName": firstName, "lastName": lastName, "fullName": fullName])
    }
}
