
const tara = new ObraJS();

window.onKioskLockscreenShown = function () {
  // Called function when webview is shown
  if (window.TaraBridge) {
    setTimeout(() => {
      if (window.TaraBridge.isLockscreen() == true) {
        clearAllAppCache();
        removeAccounts();
      } else {
        window.TaraBridge.showToast("Resuming Session");
      }
    }, 1000 * 20); // clear after 1 minute
  }
}

let totalCoin = 0;
let totalTime = 0;
let coinTimer = null;


// Main Conversion Logic
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


const coinFunc = () => {
  coinTimer = setTimeout(() => {
    const user_coin = parseInt(window.TaraBridge.getEspData());
    console.log("data, total:", user_coin, totalCoin);
    if (user_coin > 0) {
      totalCoin += user_coin;
      totalTime = totalCoin * 60 * 1;
      window.TaraBridge.setEspData("0000"); // set back to zero if read successful
      //tara.oId("time_convert_id").innerHTML = formatSeconds(totalTime);
      convertTime(totalTime);
      tara.oId("coins_id").innerHTML = "₱" + totalCoin;
      tara.oId("button_start_id").style.display = "block";
    }
    coinFunc();
  }, 1000);
}

function onLoadEvent() {
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
      isMenu: window.TaraBridge.isMenu(),
      isLockscreen: window.TaraBridge.isLockscreen(),
      wifiIp: window.TaraBridge.getWifiIpAddress(),
      ethIp: window.TaraBridge.getEthernetIpAddress(),
      deviceSerial: window.TaraBridge.getDeviceSerial(),
      displayRefreshRate: window.TaraBridge.getScreenRefreshRate(),
    };
    console.log("Device System Info:", info);
    // test to clear the packages
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
          window.TaraBridge.sendBleCommand("DATA:OFF");
          window.TaraBridge.startBackgroundTimer(totalTime + 1, true); // setting this to true calls lockscreen natively
          window.TaraBridge.pauseBackgroundTimer();
          window.TaraBridge.moveToMenuWebview();
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

    tara.oHtml("user_time_id", "./templates/user_timer.html", {
      button_insert_id: "button_insert_id",
      button_insert_show_event: (event) => {
        console.log(event.currentTarget.id);
        if (coinTimer != null) {
          clearTimeout(coinTimer);
        }
        coinFunc();
        tara.oId('coinModal').show();
        window.TaraBridge.sendBleCommand("DATA:ON");
      }
    })
  }
}

//  Remove Google Accounts
function removeAccounts() {
  if (window.TaraBridge && window.TaraBridge.removeGoogleAccount) {
    const isSuccess = window.TaraBridge.removeGoogleAccount();
    // has issue showing no accounts exist
    if (isSuccess) {
      window.TaraBridge.showToast("All accounts cleared!");
    } else {
      //window.TaraBridge.showToast("No account exist");
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
  if (window.TaraBridge && window.TaraBridge.clearAllGameCache) {
    const isSuccess = window.TaraBridge.clearAllGameCache();
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




