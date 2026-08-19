
//TEst

const tara = new ObraJS();

const ps4_select = new Audio("ps4-select-button.mp3");
const slide_select = new Audio("slide.mp3");
const beep_sound = new Audio("beep.mp3");
const overlay = document.querySelector('.loading-overlay');




window.onKioskMenuShown = function () {
  // Called function when webview is shown
  if (window.TaraBridge) {

    if (window.TaraBridge.isMenu() == true) {
      const remainingTime = window.TaraBridge.getTimerRemainingSeconds();
      if (remainingTime > 0) {
        //window.TaraBridge.resumeBackgroundTimer();
      } else {
        window.TaraBridge.setGameDoNotDisturb(false);
      }
      window.TaraBridge.setKeepScreenAwake(true);
      window.TaraBridge.playNotificationSound("notification");
      setTimeout(() => {
        renderUserTime();
      }, 500);
    } else {

    }

  }
}

window.onKioskMenuBle = function (data) {
  console.log("got coin: ", data);
  const user_coin = parseInt(data.replace("DATA:", ""));
  if (user_coin > 0) {
    totalCoin += user_coin;
  }
  if (beep_sound) {
    try {
      beep_sound.pause();
      beep_sound.currentTime = 0;
      beep_sound.play();
    } catch (e) {

    }
  }

}


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

//9. set App performance
function setGameMode(appName, gameMode) {
  window.TaraBridge.setGameMode(appName, gameMode);
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
      cpuHz: window.TaraBridge.getCpuHz(),
      ramMb: window.TaraBridge.getRamMb(),
      cpuTemp: window.TaraBridge.getCpuTemp(),
      displayRefreshRate: window.TaraBridge.getScreenRefreshRate(),
      isBleConnected: window.TaraBridge.isBluetoothConnected()
    };


    tara.oHtml("info_id", "./templates/app_info.html", {
      app_version: window.TaraBridge.getAppVersion(),
      device_model: window.TaraBridge.getDeviceModel(),
      device_serial: window.TaraBridge.getDeviceSerial(),
      device_manufacturer: window.TaraBridge.getManufacturer(),
      os_version: window.TaraBridge.getOsVersion(),
      sdk_version: window.TaraBridge.getSdkInt(),
      cpu_brand: window.TaraBridge.getCpuBrand(),
      cpu_cores: window.TaraBridge.getCpuCount(),
      cpu_model: window.TaraBridge.getCpuModel(),
      ip_address: window.TaraBridge.getWifiIpAddress(),
    })

    //console.log("Device System Info:", info);



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
let filter_character = "A-Z : " + filtered_apps.length;
//console.log("all apps:", filtered_apps);


const taraFilter = (alphabet) => {
  icon_index = 0;

  filtered_apps = filterByStartingLetter(JSON.parse(white_listed_apps), 'appName', alphabet);
  filter_character = alphabet + " : " + filtered_apps.length;
  renderAllApps();
}

const taraAllApps = () => {
  icon_index = 0;

  filtered_apps = JSON.parse(white_listed_apps);
  filter_character = "A-Z : " + filtered_apps.length;
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
      app_performance_id: app.packageName + "_app_performance",
      app_battery_id: app.packageName + "_app_battery",
      app_icon: app.icon,
      app_category: "Category: " + app.category,
      app_icon_id: "icon_id_" + icon_index,
      app_is_system: app.isSystemApp == true ? "System App" : "User Apps",
      app_is_online: "",//app.isOnline == true ? "Online: ✅" : "Online: ❌",
      app_is_offline: "", //app.isOffline == true ? "Offline: ✅" : "Offline: ❌",
      app_button_performance: (event) => {
        //console.log(event.currentTarget.id);
        let appName = event.currentTarget.dataset.name;
        console.log("app name", appName);
        setGameMode(event.currentTarget.id.replaceAll("_app_performance", ""), "performance");
        renderTurboModal(event.currentTarget.id.replaceAll("_app_performance", ""), appName);
      },
      app_button_battery: (event) => {
        //console.log(event.currentTarget.id);
        let appName = event.currentTarget.dataset.name;
        console.log("app name", appName);
        setGameMode(event.currentTarget.id.replaceAll("_app_battery", ""), "battery");
        renderBatteryModal(event.currentTarget.id.replaceAll("_app_battery", ""), appName);
      },
    });
    icon_index++;
  });
  return app_map;
};

const recentApps = () => {
  const apps = JSON.parse(window.TaraBridge.getRunningBackgroundAppsDetails());
  let app_map = "";
  apps.map((app) => {
    app_map += tara.oString("./templates/app_recents_item.html", {
      app_title: app.appName,
      app_icon: app.icon,
      app_clear_id: app.packageName + "_icon_clear_recents",
      app_play_id: app.packageName + "_icon_play_recents",
      app_category: app.category,
      app_clear_button: (event) => {
        console.log(event.currentTarget.id.replaceAll("_icon_clear_recents", ""));
        window.TaraBridge.stopRunningBackgroundApp(event.currentTarget.id.replaceAll("_icon_clear_recents", ""));
        window.TaraBridge.clearAppCacheByPackage(event.currentTarget.id.replaceAll("_icon_clear_recents", ""));
        renderRecentApps();
      },
      app_play_button: (event) => {
        console.log(event.currentTarget.id.replaceAll("_icon_play_recents", ""));
        openApp(event.currentTarget.id.replaceAll("_icon_play_recents", ""));
      }
    });
  });
  return app_map;
}

let recent_apps_timer = null;

const renderRecentApps = () => {
  tara.oHtml("recent_apps", "./templates/app_recents_layout.html", {
    recent_button_clear_all: "recent_button_clear_all",
    clear_all_button: (event) => {
      let recentAppCount = window.TaraBridge.getRunningBackgroundAppsCount();
      window.TaraBridge.showToast("Stopping " + recentAppCount + " background apps");
      const apps = JSON.parse(window.TaraBridge.getRunningBackgroundAppsDetails());
      let app_map = "";
      apps.map((app) => {
        window.TaraBridge.stopRunningBackgroundApp(app.packageName);
      })
      setTimeout(() => {
        renderRecentApps();
        window.TaraBridge.playNotificationSound("notification");
      }, 2000);
    },
    init: () => {
      if (recent_apps_timer != null) {
        clearInterval(recent_apps_timer);
      }
      recent_apps_timer = setInterval(() => {
        recentAppCount = window.TaraBridge.getRunningBackgroundAppsCount();
        console.log("apps count: ", recentAppCount);
        if (recentAppCount) {
          tara.oId("recent_app_count").innerHTML = recentAppCount;
          tara.oId("recent_app_count").style.display = "block";
        } else {
          tara.oId("recent_app_count").style.display = "none";
        }
      }, 5000);
    }
  });
}

const renderTurboModal = (appPackage, appName) => {
  let info = "App running " + appName + " in Turbo Mode"
  tara.oHtml("turbo_mode_id", "./templates/modal_turbo.html", {
    turbo_info: info,
    init: () => {
      tara.oId('turboModal').showModal();
    }
  })
  window.TaraBridge.clearGameCacheByPackage(appPackage);
  const apps = JSON.parse(window.TaraBridge.getRunningBackgroundAppsDetails());
  let app_map = "";
  apps.map((app) => {
    window.TaraBridge.stopRunningBackgroundApp(app.packageName);
  })
  setTimeout(() => {
    openApp(appPackage);
    tara.oId('turboModal').close();
  }, 2000)
}

const renderBatteryModal = (appPackage, appName) => {
  let info = "App running " + appName + " in Battery Mode"
  tara.oHtml("battery_mode_id", "./templates/modal_battery.html", {
    battery_info: info,
    init: () => {
      tara.oId('batteryModal').showModal();
    }
  })
  setTimeout(() => {
    openApp(appPackage);
    tara.oId('batteryModal').close();
  }, 2000)
}


let userInterval = null;

const renderUserTime = () => {
  tara.oHtml("user_time_id", "./templates/user_time.html", {
    timer_id: "timer_id",
    timer_value: "00:00:00",
    button_insert_id: "button_insert_id",
    init: () => {
      if (userInterval != null) {
        clearInterval(userInterval);
      }
      userInterval = setInterval(() => {
        let rawUserSecondsTime = window.TaraBridge.getTimerRemainingSeconds();
        console.log("remaining time", rawUserSecondsTime)
        let currentUserTime = formatSeconds(rawUserSecondsTime);
        tara.oId("timer_id").innerHTML = currentUserTime;
        if (rawUserSecondsTime <= 15) {
          if (beep_sound) {
            try {
              beep_sound.pause();
              beep_sound.currentTime = 0;
              beep_sound.play();
            } catch (e) {

            }

          }
        }
        if (rawUserSecondsTime <= 0) {
          clearInterval(userInterval);
        }
      }, 1000);
    },
    button_insert_show_event: (event) => {
      console.log(event.currentTarget.id);
      if (coinTimer != null) {
        clearTimeout(coinTimer);
      }
      coinFunc();
      tara.oId('coinModal').show();
      window.TaraBridge.sendBleCommand("DATA:ON");
    }
  });
}

renderUserTime();
renderRecentApps();

const openRecentAppModal = () => {
  renderRecentApps();
  let recentAppCount = window.TaraBridge.getRunningBackgroundAppsCount();
  if (recentAppCount) {
    tara.oId("recent_button_clear_all").style.display = "block";
  } else {
    tara.oId("recent_button_clear_all").style.display = "none";
  }
  tara.oId('recentModal').showModal()
}

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


showLoading();

const triggerSlideAnimation = (activeSlide) => {
  if (!activeSlide) return;
  const animatedElements = activeSlide.querySelectorAll('[data-anim]');
  animatedElements.forEach((el) => {
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = '';
  });
}

const renderAllApps = () => {
  let lastIndex2 = null;
  const loader = tara.oId('loader');
  loader.classList.remove('hidden');
  tara.oHtml("app_id", "./templates/app_layout.html", {
    filter_text: filter_character,
    swiper1: () => {
      var swiper1 = new Swiper(".large-swiper", {
        centeredSlides: true,
        initialSlide: 1,
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
          init: function () {
            // Trigger animation on load for the initial active slide (Index 1)
            triggerSlideAnimation(this.slides[this.activeIndex]);
          },
          slideChange: function () {
            if (this.realIndex === lastIndex2) return;
            lastIndex2 = this.realIndex;

            let icon_image = "";
            console.log('Slide changed to index: ', this.realIndex, icon_index);
            try {
              icon_image = tara.oId("icon_id_" + this.realIndex).src;
              getHexPalette(icon_image).then(color => {
                console.log("pallete changed: ", color);
                const pallete = getShades(color[0]);
                document.documentElement.style.setProperty("--pallete-body", pallete.original);
                document.documentElement.style.setProperty("--pallete-light", pallete.light);
                document.documentElement.style.setProperty("--pallete-dark", pallete.dark);
                document.documentElement.style.setProperty("--pallete-darker", pallete.darker);
              })
              if (ps4_select) {
                try {
                  ps4_select.pause();
                  ps4_select.currentTime = 0;
                  ps4_select.play();
                } catch (e) {

                }
              }
            } catch (error) {
              console.log("Error", error);
              window.TaraBridge.showToast("No Apps Installed");
            }
          },
          // Reset and trigger animation on slide transition
          slideChangeTransitionStart: function () {
            // Re-trigger animation on slide change
            triggerSlideAnimation(this.slides[this.activeIndex]);
          }
        }
      });


      setTimeout(() => {
        hideLoading();
        loader.classList.add('hidden');
      }, 300);
    }
  });
}

renderAllApps();

tara.oHtml("marqueue_id", "./templates/marqueue_layout.html", {
  swiper2: () => {
    var swiper2 = new Swiper('.small-swiper', {
      slidesPerView: 5,
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
  temp_id: "temp_id",
  initialize: () => {
    setInterval(() => {
      const batteryLevel = window.TaraBridge.getBatteryLevel();
      const displayRefreshRate = window.TaraBridge.getScreenRefreshRate();
      const pingMs = window.TaraBridge.getNetworkLatency("8.8.8.8");
      const bleStatus = window.TaraBridge.isBluetoothConnected() == true ? "UP" : "X";
      const temperatureStatus = window.TaraBridge.getCpuTemp();
      tara.oId("ping_id").innerHTML = pingMs + "ms";
      tara.oId("blestatus_id").innerHTML = `${bleStatus}`;
      tara.oId("battery_id").innerHTML = batteryLevel + "%";
      tara.oId("refresh_id").innerHTML = displayRefreshRate + "hz";
      tara.oId("temp_id").innerHTML = ~~temperatureStatus + "°C";
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

function convertTime(totalSeconds) {
  const hoursDisplay = document.getElementById('hours');
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');

  // Validation: check if empty or negative
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    hoursDisplay.textContent = "00";
    minutesDisplay.textContent = "00";
    secondsDisplay.textContent = "00";
    return;
  }

  // Calculations
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format to 2 digits (e.g., '05' instead of '5')
  hoursDisplay.textContent = String(hours).padStart(2, '0');
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

let totalCoin = 0;
let totalTime = 0;
let coinTimer = null;

const coinFunc = () => {
  coinTimer = setTimeout(() => {
    console.log("data, total:", totalCoin);
    totalTime = totalCoin * 60 * 1;
    convertTime(totalTime);
    tara.oId("coins_id").innerHTML = "₱" + totalCoin;
    tara.oId("button_start_id").style.display = "block";
    coinFunc();
  }, 1000);
}

tara.oHtml("coinModal", "./templates/coin_modal.html", {
  button_start_id: "button_start_id",
  button_insert_close_event: (event) => {
    if (coinTimer != null) {
      clearTimeout(coinTimer);
    }
    tara.oId('coinModal').close();
    window.TaraBridge.sendBleCommand("DATA:OFF");
  },
  button_start_time_event: (event) => {
    if (totalTime > 0) {
      if (coinTimer != null) {
        clearTimeout(coinTimer);
      }
      totalTime = totalTime + window.TaraBridge.getTimerRemainingSeconds();
      window.TaraBridge.sendBleCommand("DATA:OFF");
      window.TaraBridge.startBackgroundTimer(totalTime + 1, true); // setting this to true calls lockscreen natively
      tara.oId('coinModal').close();
      totalCoin = 0;
      totalTime = 0;
      //tara.oId("time_convert_id").innerHTML = formatSeconds(totalTime);
      convertTime(totalTime);
      tara.oId("coins_id").innerHTML = "₱" + totalCoin;
      tara.oId("button_start_id").style.display = "none";
    }
  }
})

function formatSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pads single digits with a leading zero
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

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
    slideChange: function () {
      console.log('ABCD changed to index: ', this.realIndex);
      if (slide_select) {
        try {
          slide_select.pause();
          slide_select.currentTime = 0;
          slide_select.play();
        } catch (e) {

        }
      }
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // 1. Reference elements
  const brightnessInput = tara.oId("brightnessSlider");
  const brightnessText = tara.oId("brightnessValue");

  const audioInput = tara.oId("audioSlider");
  const audioText = tara.oId("audioValue");

  // 2. Define custom logic callbacks
  function onBrightnessChange(value) {
    // UI Update
    brightnessText.textContent = `${value}%`;

    window.TaraBridge.setScreenBrightness(parseInt(value, 10));
    // Custom logic placeholder (e.g., updating a CSS filter or saving settings)
    console.log(`System Brightness updated to: ${value}%`);
    if (slide_select) {
      slide_select.pause();
      slide_select.currentTime = 0;
      slide_select.play();
    }
  }

  function onAudioChange(value) {
    // UI Update
    audioText.textContent = `${value}%`;
    window.TaraBridge.setAudioLevel(parseInt(value, 10));
    // Custom logic placeholder (e.g., mapping to a media player audio gain node)
    console.log(`System Audio volume updated to: ${value}%`);
    if (slide_select) {
      slide_select.pause();
      slide_select.currentTime = 0;
      slide_select.play();
    }
  }


  // 3. Inject initial values programmatically 
  // (This overrides any 'value="..."' attribute hardcoded in your HTML)
  brightnessInput.value = window.TaraBridge.getScreenBrightness();
  audioInput.value = window.TaraBridge.getAudioLevel();

  // 4. Fire callbacks immediately on mount to sync text readouts
  onBrightnessChange(brightnessInput.value);
  onAudioChange(audioInput.value);

  // 3. Attach real-time event listeners ('input' registers instant drag states)
  brightnessInput.addEventListener("input", (event) => {
    onBrightnessChange(event.target.value);
  });

  audioInput.addEventListener("input", (event) => {
    onAudioChange(event.target.value);
  });
});