//
//  SafariExtensionViewController.swift
//  Hide My Name Extension
//
//  Created by Jian Qin on 2024/9/19.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
