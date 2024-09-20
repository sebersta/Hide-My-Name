//
//  ViewController.swift
//  Hide My Name
//
//  Created by Jian Qin on 2024/9/19.
//

import Cocoa
import SafariServices
import WebKit

let extensionBundleIdentifier = "com.sebersta.Hide-My-Name.Extension"

class ViewController: NSViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show(\(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show(\(state.isEnabled), false)")
                }
            }
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let messageBody = message.body as? [String: Any], let action = messageBody["action"] as? String else {
            return
        }
        
        switch action {
        case "open-preferences":
            SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                DispatchQueue.main.async {
                    NSApplication.shared.terminate(nil)
                }
            }
            
        case "locale-changed":
            if let locale = messageBody["locale"] as? String {
                print("Changed locale to \(locale)")
                storeLocaleInUserDefaults(locale: locale)
            }
            
        case "fetch-locale":
            let locale = fetchLocaleInUserDefaults()
            print("Fetched locale: \(locale)")
            let jsScript = "document.getElementById('locale-picker').value = '\(locale)'"
            message.webView?.evaluateJavaScript(jsScript, completionHandler: nil)
            
        default:
            break
        }
    }
    
    
    @IBAction func storeLocaleInUserDefaults(locale: String) {
        if let sharedDefaults = UserDefaults(suiteName: "8HVQYZSB2F.Hide-My-Name") {
            sharedDefaults.set(locale, forKey: "selectedLocale")
            sharedDefaults.synchronize() // Ensures the value is saved immediately
        }
    }
    
    func fetchLocaleInUserDefaults() -> String {
        if let sharedDefaults = UserDefaults(suiteName: "8HVQYZSB2F.Hide-My-Name") {
            let locale = sharedDefaults.string(forKey: "selectedLocale")
            return locale ?? "en-UK"
        }
        return "en-UK"
    }
}
