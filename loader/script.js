function triggerToast() {
            // Check if running inside our Android WebView container
        if (window.TaraBridge) {
                window.TaraBridge.showToast("Hello from Webview JS!");
            } else {
                console.log("Not running inside Android WebView container");
            }
}

// 3. Launch an app programmatically from JS
function openChrome() {
    const success = window.TaraBridge.launchApp("com.android.chrome");
    if (!success) {
        alert("App could not be launched!");
    }
}
		
function getDeviceInfo() {
	triggerToast();
    if (window.TaraBridge) {
        const info = {
            osVersion: window.TaraBridge.getOsVersion(),
            sdkVersion: window.TaraBridge.getSdkInt(),
            deviceModel: window.TaraBridge.getDeviceModel(),
            manufacturer: window.TaraBridge.getManufacturer(),
            appVersion: window.TaraBridge.getAppVersion(),
            batteryLevel: window.TaraBridge.getBatteryLevel() + "%",
            isCharging: window.TaraBridge.isCharging(),
			wifiIp: window.TaraBridge.getWifiIpAddress(),
			ethIp: window.TaraBridge.getEthernetIpAddress(),
			deviceSerial: window.TaraBridge.getDeviceSerial(),
			displayRefreshRate: window.TaraBridge.getScreenRefreshRate(),
			
        };
        console.log("Device System Info:", info);
		
		
			// 1. Get simple list of package strings
const whitelistedPackageNames = JSON.parse(window.TaraBridge.getWhitelistedApps());
console.log("Whitelisted Packages:", whitelistedPackageNames);
// Output: ["pl.snowdog.kiosk", "com.android.chrome", "com.sec.android.app.popupcalculator"]

// 2. Get detailed list with App Names
const whitelistedDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsDetails());
console.log("Whitelisted App Details:", whitelistedDetails);
/* Output:
[
  { "packageName": "pl.snowdog.kiosk", "appName": "Tara Kiosk" },
  { "packageName": "com.android.chrome", "appName": "Google Chrome" }
]
*/
		
        return info;
    } else {
        console.warn("TaraBridge interface not found");
        return null;
    }
	
	

}