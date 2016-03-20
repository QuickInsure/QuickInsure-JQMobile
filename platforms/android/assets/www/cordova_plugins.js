cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "id": "cordova-plugin-dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "id": "cordova-plugin-globalization.GlobalizationError",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "id": "cordova-plugin-globalization.globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/ibm-mfp-core/www/BMSClient.js",
        "id": "ibm-mfp-core.BMSClient",
        "clobbers": [
            "BMSClient"
        ]
    },
    {
        "file": "plugins/ibm-mfp-core/www/MFPRequest.js",
        "id": "ibm-mfp-core.MFPRequest",
        "clobbers": [
            "MFPRequest"
        ]
    },
    {
        "file": "plugins/ibm-mfp-core/www/MFPLogger.js",
        "id": "ibm-mfp-core.MFPLogger",
        "clobbers": [
            "MFPLogger"
        ]
    },
    {
        "file": "plugins/ibm-mfp-core/www/MFPAnalytics.js",
        "id": "ibm-mfp-core.MFPAnalytics",
        "clobbers": [
            "MFPAnalytics"
        ]
    },
    {
        "file": "plugins/ibm-mfp-core/www/MFPAuthorizationManager.js",
        "id": "ibm-mfp-core.MFPAuthorizationManager",
        "clobbers": [
            "MFPAuthorizationManager"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-plugin-x-socialsharing": "5.0.11",
    "cordova-plugin-camera": "2.1.1",
    "cordova-plugin-device": "1.1.1",
    "cordova-plugin-dialogs": "1.2.0",
    "cordova-plugin-globalization": "1.0.3",
    "cordova-plugin-inappbrowser": "1.2.1",
    "cordova-plugin-network-information": "1.2.0",
    "cordova-plugin-splashscreen": "3.1.0",
    "cordova-plugin-statusbar": "2.1.2",
    "cordova-plugin-crosswalk-webview": "1.6.0",
    "ibm-mfp-core": "1.0.11",
    "cordova-plugin-console": "1.0.2"
};
// BOTTOM OF METADATA
});