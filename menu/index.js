


const tara = new ObraJS();

const ps4_select = new Audio("ps4-select-button.mp3");


function clickButton() {
  // swiper.autoplay.stop();
}



function triggerToast() {
  // Check if running inside our Android WebView container
  if (window.TaraBridge) {
    window.TaraBridge.showToast("Hello from Webview JS!");
  } else {
    console.log("Not running inside Android WebView container");
  }
}

// 3. Launch an app programmatically from JS
function openApp(packageName) {
  const success = window.TaraBridge.launchApp(packageName);
  if (!success) {
    alert("App could not be launched!");
  }
}

// 4. Launch an app programmatically from JS
function closeApp(packageName) {

  const success = window.TaraBridge.stopApp(packageName);
  if (!success) {
    alert("App could not be stopped!");
  }
}

// 5. Remove Google Accounts
function removeAccounts() {
  if (window.TaraBridge && window.TaraBridge.removeGoogleAccount) {
    const isSuccess = window.TaraBridge.removeGoogleAccount();
    if (isSuccess) {
      window.TaraBridge.showToast("All accouns cleared!");
    } else {
      window.TaraBridge.showToast("No account exist");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}

// 6. Clear Standard Media Folders (Downloads, DCIM, Pictures, Videos)
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

// 7. Clear Specific Custom Folders
function clearSpecificFolders() {
  if (window.TaraBridge && window.TaraBridge.clearCustomFolders) {
    const foldersToDelete = [
      "/sdcard/Download/TempPDFs",
      "/sdcard/DCIM/Screenshots"
    ];

    const jsonString = JSON.stringify(foldersToDelete);
    const isSuccess = window.TaraBridge.clearCustomFolders(jsonString);

    console.log("Custom folders clear status:", isSuccess);
  } else {
    console.warn("TaraBridge interface not available.");
  }
}

//8. Get network latency
function getNetworkLatency() {
  if (window.TaraBridge && window.TaraBridge.getNetworkLatency) {
    const pingMs = window.TaraBridge.getNetworkLatency("8.8.8.8");
    if (pingMs !== -1) {
      console.log(`Current network latency: ${pingMs} ms`);
    } else {
      console.warn("Network unreachable or ping failed.");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}

function getDeviceInfo() {

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
      isBleConnected: window.TaraBridge.isBluetoothConnected()
    };
    console.log("Device System Info:", info);


    tara.oId("ipaddress_id").innerHTML = `IP Address: ${info.wifiIp}`;
    tara.oId("devicemodel_id").innerHTML = `Device Model: ${info.deviceModel}`;
    tara.oId("appversion_id").innerHTML = `App Version: ${info.appVersion}`;


    // 1. Get simple list of package strings
    const whitelistedPackageNames = JSON.parse(window.TaraBridge.getWhitelistedApps());
    console.log("Whitelisted Packages:", whitelistedPackageNames);
    // Output: ["pl.snowdog.kiosk", "com.android.chrome", "com.sec.android.app.popupcalculator"]

    // 2. Get detailed list with App Names
    const whitelistedDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsDetails());
    console.log("Whitelisted App Details:", whitelistedDetails);

    // 3. Get detailed list with Categorized App Names
    const whitelistedCategorizedDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsGroupedByCategory());
    console.log("Whitelisted App Categorized Details:", whitelistedCategorizedDetails);

    // 4. Get detailed list with Online and offline catagory App Names
    const whitelistedConnectivityDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsGroupedByConnectivity());
    console.log("Whitelisted App Connectivity Details:", whitelistedConnectivityDetails);

    // 4. Get detailed list with Online and offline catagory App Names
    const runningBackgroundDetails = JSON.parse(window.TaraBridge.getRunningBackgroundApps());
    console.log("Running Apps in background:", runningBackgroundDetails);

    // 5. Get recent apps opened
    const recentOpenedAppsDetails = JSON.parse(window.TaraBridge.getPreviouslyOpenedApp());
    console.log("Recent Apps Opened:", recentOpenedAppsDetails);

    return info;
  } else {
    console.warn("TaraBridge interface not found");
    return null;
  }

}


getDeviceInfo();


const allApps = () => {
  const apps = JSON.parse(window.TaraBridge.getWhitelistedAppsDetails());
  let app_map = "";
  apps.map((app) => {
    app_map += tara.oString("./templates/app_item.html", {
      app_name: app.appName,
      app_id: app.packageName,
      app_icon: app.icon,
      app_button: (event) => {
        console.log(event.currentTarget.id);
        openApp(event.currentTarget.id);
      }
    });
  });
  return app_map;
};

tara.oHtml("app", "./templates/app_layout.html", {
  swiper: () => {
    var swiper1 = new Swiper(".slider1", {
      effect: 'coverflow',
      grabCursor: true,
      slidesPerView: 3,
      spaceBetween: 10,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      loop: true,
    });
  }
});



tara.oHtml("header", "./templates/header_layout.html", {
  battery_value: window.TaraBridge.getBatteryLevel() + "%",
  refresh_rate: window.TaraBridge.getScreenRefreshRate() + "hz",
  time_id: "time_id",
  ping_id: "ping_id",
  blestatus_id: "blestatus_id",
  initialize: () => {
    setInterval(() => {
      const batteryLevel = window.TaraBridge.getBatteryLevel();
      const displayRefreshRate = window.TaraBridge.getScreenRefreshRate();
      const pingMs = window.TaraBridge.getNetworkLatency("8.8.8.8");
      tara.oId("ping_id").innerHTML = pingMs + "ms"

      const bleStatus = window.TaraBridge.isBluetoothConnected() == true ? "UP" : "X";
      tara.oId("blestatus_id").innerHTML = `${bleStatus}`;

      //document.getElementById("battery_id").innerHTML = batteryLevel + "%";
      //document.getElementById("refresh_id").innerHTML = displayRefreshRate + "hz";
    }, 2000);
    setInterval(() => {
      const now = new Date();
      const year = now.getFullYear();
      // 1. Get short month (e.g., "Jan")
      const month = now.toLocaleString('en-US', { month: 'short' });
      const day = String(now.getDate()).padStart(2, '0');
      // 2. Format time to AM/PM using native options
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert '0' hours to '12'
      const formattedHours = String(hours).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      // Will output like: "2026-Jul-31 04:47:00 PM"
      const formattedDateTime = `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
      tara.oId("time_id").innerHTML = formattedDateTime;
    }, 1000);
  }
})