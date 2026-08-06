


const tara = new ObraJS();

const ps4_select = new Audio("ps4-select-button.mp3");
const slide_select = new Audio("slide.mp3");
const overlay = document.querySelector('.loading-overlay');

// Function to hide the loading screen
function hideLoading() {
  overlay.classList.add('hide');
}

// Function to show the loading screen again
function showLoading() {
  overlay.classList.remove('hide');
}

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


    //tara.oId("ipaddress_id").innerHTML = `IP Address: ${info.wifiIp}`;
    //tara.oId("devicemodel_id").innerHTML = `Device Model: ${info.deviceModel}`;
    //tara.oId("appversion_id").innerHTML = `App Version: ${info.appVersion}`;


    // // 1. Get simple list of package strings
    // const whitelistedPackageNames = JSON.parse(window.TaraBridge.getWhitelistedApps());
    // console.log("Whitelisted Packages:", whitelistedPackageNames);
    // // Output: ["pl.snowdog.kiosk", "com.android.chrome", "com.sec.android.app.popupcalculator"]

    // // 2. Get detailed list with App Names
    // const whitelistedDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsDetails());
    // console.log("Whitelisted App Details:", whitelistedDetails);

    // // 3. Get detailed list with Categorized App Names
    // const whitelistedCategorizedDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsGroupedByCategory());
    // console.log("Whitelisted App Categorized Details:", whitelistedCategorizedDetails);

    // // 4. Get detailed list with Online and offline catagory App Names
    // const whitelistedConnectivityDetails = JSON.parse(window.TaraBridge.getWhitelistedAppsGroupedByConnectivity());
    // console.log("Whitelisted App Connectivity Details:", whitelistedConnectivityDetails);

    // // 4. Get detailed list with Online and offline catagory App Names
    // const runningBackgroundDetails = JSON.parse(window.TaraBridge.getRunningBackgroundApps());
    // console.log("Running Apps in background:", runningBackgroundDetails);

    // // 5. Get recent apps opened
    // const recentOpenedAppsDetails = JSON.parse(window.TaraBridge.getPreviouslyOpenedApp());
    // console.log("Recent Apps Opened:", recentOpenedAppsDetails);

    return info;
  } else {
    console.warn("TaraBridge interface not found");
    return null;
  }

}


getDeviceInfo();

let icon_index = 0;
let white_listed_apps = window.TaraBridge.getWhitelistedAppsDetails();
let filtered_apps = JSON.parse(white_listed_apps);
console.log("all apps:", filtered_apps);


const taraFilter = (alphabet) => {
  icon_index = 0;
  filtered_apps = filterByStartingLetter(JSON.parse(white_listed_apps), 'appName', alphabet);
  renderAllApps();
}

const taraAllApps = () => {
  icon_index = 0;
  filtered_apps = JSON.parse(white_listed_apps);
  renderAllApps();

}


function filterByStartingLetter(arr, propertyKey, letter) {
  // Guard against empty search letters
  if (!letter) return arr;
  const searchLetter = letter.toLowerCase();
  return arr.filter(item => {
    // Safely retrieve the property value, convert to string, and handle null/undefined
    const value = item[propertyKey]?.toString() || '';
    return value.toLowerCase().startsWith(searchLetter);
  });
}

const allApps = () => {
  const apps = filtered_apps;
  let app_map = "";
  apps.map((app) => {
    app_map += tara.oString("./templates/app_item.html", {
      app_name: app.appName,
      app_id: app.packageName + "_app",
      app_icon: app.icon,
      app_icon_id: "icon_id_" + icon_index,
      app_button: (event) => {
        console.log(event.currentTarget.id);
        openApp(event.currentTarget.id.replaceAll("_app", ""));
      }
    });
    icon_index++;
  });
  return app_map;
};


const marqueueApps = () => {
  const apps = JSON.parse(white_listed_apps);
  let app_map = "";
  apps.map((app) => {
    app_map += tara.oString("./templates/app_icon.html", {
      app_icon: app.icon,
      app_id: app.packageName + "_icon",
      app_button: (event) => {
        console.log(event.currentTarget.id);
        openApp(event.currentTarget.id.replaceAll("_icon", ""));
      }
    });
  });
  return app_map;
}



const renderAllApps = () => {
  let lastIndex2 = null;
  showLoading();
  tara.oHtml("app_id", "./templates/app_layout.html", {
    swiper1: () => {
      var swiper1 = new Swiper(".large-swiper", {
        effect: 'coverflow',
        grabCursor: true,
        slidesPerView: 3,
        spaceBetween: 10,
        loop: true,
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
        on: {
          slideChangeTransitionEnd: function () {

            if (this.realIndex === lastIndex2) return;
            lastIndex2 = this.realIndex;

            let icon_image = "";
            if (this.realIndex + 1 != icon_index) {
              icon_image = tara.oId("icon_id_" + (this.realIndex + 1)).src;
            } else {
              icon_image = tara.oId("icon_id_0").src;
            }
            console.log('Slide changed to index: ', this.realIndex + 1, icon_index);

            getHexPalette(icon_image).then(color => {
              console.log("pallete changed: ", color);
              const pallete = getShades(color[0]);
              document.documentElement.style.setProperty("--pallete-body", pallete.original);
              document.documentElement.style.setProperty("--pallete-light", pallete.light);
              document.documentElement.style.setProperty("--pallete-dark", pallete.dark);
              document.documentElement.style.setProperty("--pallete-darker", pallete.darker);
            })
            ps4_select.pause();
            ps4_select.currentTime = 0;
            ps4_select.play();
          },
        },

      });
      setTimeout(() => {
        hideLoading();
      }, 300);
    }
  });
}

renderAllApps();

tara.oHtml("marqueue_id", "./templates/marqueue_layout.html", {
  swiper2: () => {
    var swiper2 = new Swiper('.small-swiper', {
      slidesPerView: 4,
      spaceBetween: 10,
      loop: true,
      autoplay: {
        delay: 3000, // Time between transitions in ms (3 seconds)
        disableOnInteraction: false, // Keeps autoplay running after user swipes
        pauseOnMouseEnter: true, // Pauses scrolling when hovered
      },

    });
  }
});

tara.oHtml("header", "./templates/header_layout.html", {
  battery_value: window.TaraBridge.getBatteryLevel() + "%",
  refresh_rate: window.TaraBridge.getScreenRefreshRate() + "hz",
  time_id: "time_id",
  ping_id: "ping_id",
  battery_id: "battery_id",
  blestatus_id: "blestatus_id",
  refresh_id: "refresh_id",
  initialize: () => {
    setInterval(() => {
      const batteryLevel = window.TaraBridge.getBatteryLevel();
      const displayRefreshRate = window.TaraBridge.getScreenRefreshRate();
      const pingMs = window.TaraBridge.getNetworkLatency("8.8.8.8");
      tara.oId("ping_id").innerHTML = pingMs + "ms"

      const bleStatus = window.TaraBridge.isBluetoothConnected() == true ? "UP" : "X";
      tara.oId("blestatus_id").innerHTML = `${bleStatus}`;

      tara.oId("battery_id").innerHTML = batteryLevel + "%";
      tara.oId("refresh_id").innerHTML = displayRefreshRate + "hz";
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


function getShades(hex, lightPercent = 95, darkPercent = 5, darkerPercent = 95) {
  // Clean the hex string
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);

  // Extract RGB components
  const r = (num >> 16);
  const g = ((num >> 8) & 0x00FF);
  const b = (num & 0x0000FF);

  // Helper to calculate new channel value mixed with white or black
  function mix(channel, percent, target) {
    const amount = Math.round(target * (percent / 100));
    const newVal = channel + (amount - channel) * (percent / 100) + (target === 255 ? (255 - channel) * (percent / 100) : -(channel * (percent / 100)));
    // Simpler direct blend
    let res = target === 255 ? Math.round(channel + (255 - channel) * (percent / 100)) : Math.round(channel * (1 - percent / 100));
    return Math.min(255, Math.max(0, res));
  }

  // Cleaner adjustment method
  function adjust(pR, pG, pB, percent, widen) {
    const f = (x) => {
      const val = widen ? x + Math.round((x) * percent) : x - Math.round(x * percent);
      return Math.min(255, Math.max(0, val));
    };
    return "#" + ((1 << 24) + (f(pR) << 16) + (f(pG) << 8) + f(pB)).toString(16).slice(1);
  }

  function adjustOrig(pR, pG, pB, percent, widen) {
    const f = (x) => {
      const val = widen ? x + Math.round((127 - x) * percent) : x - Math.round(x * percent);
      return Math.min(255, Math.max(0, val));
    };
    return "#" + ((1 << 24) + (f(pR) << 16) + (f(pG) << 8) + f(pB)).toString(16).slice(1);
  }

  return {
    original: adjustOrig(r, g, b, 10 / 100, true),
    light: adjust(r, g, b, lightPercent / 100, true),
    dark: adjust(r, g, b, darkPercent / 100, false),
    darker: adjust(r, g, b, darkerPercent / 100, false)
  };
}


function getHexPalette(base64Str, colorCount = 1) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorCounts = new Map();

      // Define how far from pure white a color must be (higher = stricter filter)
      const whiteTolerance = 15;

      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // 1. Skip fully transparent pixels
        if (a < 128) continue;

        // 2. Skip white and shades of white
        // Checks if all channels are close to 255
        if (r > (255 - whiteTolerance) && g > (255 - whiteTolerance) && b > (255 - whiteTolerance)) {
          continue;
        }

        // Convert RGB to Hex string
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
      }

      const sortedColors = Array.from(colorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

      resolve(sortedColors.slice(0, colorCount));
    };
    img.onerror = reject;
    img.src = base64Str;
  });
}


let lastIndex3 = null;

var swiper3 = new Swiper('.xsmall-swiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  spaceBetween: 10,
  slidesPerView: 10,
  coverflowEffect: {
    rotate: 0,
    stretch: 10,
    depth: 0,
    modifier: 1,
    slideShadows: true,
  },
  loop: true,
  on: {
    slideChangeTransitionEnd: function () {
      if (this.realIndex === lastIndex3) return;
      lastIndex3 = this.realIndex;
      console.log('ABCD changed to index: ', this.realIndex);
      slide_select.pause();
      slide_select.currentTime = 0;
      slide_select.play();
    }
  }
});