function triggerToast() {
            // Check if running inside our Android WebView container
        if (window.TaraBridge) {
                window.TaraBridge.showToast("Hello from Webview JS!");
            } else {
                console.log("Not running inside Android WebView container");
            }
}

function fetchVersion() {
        if (window.TaraBridge) {
            const version = window.TaraBridge.getAppVersion();
            console.log("Native App Version: " + version);
        }
}
		
function getDeviceInfo() {
    if (window.TaraBridge) {
        const info = {
            osVersion: window.TaraBridge.getOsVersion(),
            sdkVersion: window.TaraBridge.getSdkInt(),
            deviceModel: window.TaraBridge.getDeviceModel(),
            manufacturer: window.TaraBridge.getManufacturer(),
            appVersion: window.TaraBridge.getAppVersion(),
            batteryLevel: window.TaraBridge.getBatteryLevel() + "%",
            isCharging: window.TaraBridge.isCharging()
        };

        console.log("Device System Info:", info);
        return info;
    } else {
        console.warn("TaraBridge interface not found");
        return null;
    }
}