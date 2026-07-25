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
function openChrome(packageName) {
  const success = window.TaraBridge.launchApp(packageName);
  if (!success) {
    alert("App could not be launched!");
  }
}

function getDeviceInfo() {
  triggerToast();
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

    // 3. Get detailed list with Online and offline catagory App Names
    const whitelistedConnectivityDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsGroupedByConnectivity());
    console.log("Whitelisted App Connectivity Details:", whitelistedConnectivityDetails);

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
        openChrome(event.currentTarget.id);
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
  initialize: () => {
    setInterval(() => {
      const batteryLevel = window.TaraBridge.getBatteryLevel();
      const displayRefreshRate = window.TaraBridge.getScreenRefreshRate();
      //document.getElementById("battery_id").innerHTML = batteryLevel + "%";
      //document.getElementById("refresh_id").innerHTML = displayRefreshRate + "hz";
    }, 2000);
  }
})