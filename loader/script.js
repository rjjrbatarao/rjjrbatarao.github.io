

window.onKioskLockscreenShown = function () {
  // Called function when webview is shown
  if (window.TaraBridge) {
	if(window.TaraBridge.isLockscreen() == true){
		setTimeout(() => {
			clearAllAppCache();
		},10000);
	} else {
		window.TaraBridge.showToast("Cancelled Cache Clearing");
	}
  }
}

function onLoadEvent(){
	  if (window.TaraBridge) {
		// 1. Get tablet info
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
		// test to clear the packages
	}
}

//  Remove Google Accounts
function removeAccounts() {
  if (window.TaraBridge && window.TaraBridge.removeGoogleAccount) {
    const isSuccess = window.TaraBridge.removeGoogleAccount();
    if (isSuccess) {
      window.TaraBridge.showToast("All accounts cleared!");
    } else {
      window.TaraBridge.showToast("No account exist");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}

//  Clear Standard Media Folders (Downloads, DCIM, Pictures, Videos)
function clearAllMedia() {
  if (window.TaraBridge && window.TaraBridge.clearDefaultMediaFolders) {
    const isSuccess = window.TaraBridge.clearDefaultMediaFolders();
    if (isSuccess) {
      window.TaraBridge.showToast("All default media folders cleared!");
    } else {
      window.TaraBridge.showToast("Some files could not be deleted.");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}


//  Clear all app cache
function clearAllAppCache() {
  if (window.TaraBridge && window.TaraBridge.clearAllWhitelistedAppsCache) {
    const isSuccess = window.TaraBridge.clearAllWhitelistedAppsCache();
    if (isSuccess) {
      window.TaraBridge.showToast("All package cache cleared!");
    } else {
      window.TaraBridge.showToast("No packages exist");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}

//  Clear Specific app cache
//  window.TaraBridge.clearAppCacheByPackage("com.google.android.youtube")
function clearAppCache(package_name) {
  if (window.TaraBridge && window.TaraBridge.clearAppCacheByPackage) {
    const isSuccess = window.TaraBridge.package_name();
    if (isSuccess) {
      window.TaraBridge.showToast("Package cache cleared!");
    } else {
      window.TaraBridge.showToast("No package exist");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}


