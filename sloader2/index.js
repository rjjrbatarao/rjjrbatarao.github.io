
const tara = new ObraJS();
const beep_sound = new Audio("beep.mp3");
const overlay = document.querySelector('.loading-overlay');


window.onKioskLockscreenShown = function () {
  // Called function when webview is shown
  if (taraBridge) {
    if (taraBridge.isLockscreen() == true) {
      const remainingTime = taraBridge.getTimerRemainingSeconds();
      if (remainingTime > 0) {
        taraBridge.pauseBackgroundTimer();
        tara.oId("screen_status_id").innerHTML = "PAUSED 🔒";
        tara.oId("button_resume_id").style.display = "block";
        tara.oId("button_insert_id").style.display = "none";
        tara.oId("remaining_time_id").innerHTML = formatSeconds(remainingTime);
      } else {
        tara.oId("remaining_time_id").innerHTML = "00:00:00";
        tara.oId("screen_status_id").innerHTML = "LOCKED 🔒";
        tara.oId("button_resume_id").style.display = "none";
        tara.oId("button_insert_id").style.display = "block";
      }
      taraBridge.setGameDoNotDisturb(false);
      taraBridge.setKeepScreenAwake(true);
    }
    setTimeout(() => {
      if (taraBridge.isLockscreen() == true) {
        const remainingTime = taraBridge.getTimerRemainingSeconds();
        if (remainingTime > 0) {

        } else {
          clearAllAppCache();
          removeAccounts();
          clearAllMedia();
          taraBridge.setScreenBrightness(4);
          tara.oId("button_resume_id").style.display = "none";
          tara.oId("button_insert_id").style.display = "block";
        }
      } else {
        taraBridge.showToast("Resuming Session");
      }
    }, 1000 * 20); // clear after 1 minute
  }
}



window.onKioskLockscreenBle = function (data) {
  //console.log("got coin: ", data);
  const creditAmount = parseInt(data.replace("DATA:", ""));
  const paymentType = "COIN"; // e.g., "COIN", "BILL", "GCASH", "MAYA"
  if (creditAmount > 0) {
    totalCoin += creditAmount;
    const isSuccess = taraBridge.addSale("", creditAmount, paymentType);
    // if (isSuccess) {
    //   console.log("Sale recorded successfully with auto-generated UUIDv7!");
    // }
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

function onLoadEvent() {
  if (taraBridge) {

    // 1. Get tablet info
    // const info = {
    //   osVersion: taraBridge.getOsVersion(),
    //   sdkVersion: taraBridge.getSdkInt(),
    //   deviceModel: taraBridge.getDeviceModel(),
    //   manufacturer: taraBridge.getManufacturer(),
    //   appVersion: taraBridge.getAppVersion(),
    //   batteryLevel: taraBridge.getBatteryLevel() + "%",
    //   isCharging: taraBridge.isCharging(),
    //   isMenu: taraBridge.isMenu(),
    //   isLockscreen: taraBridge.isLockscreen(),
    //   wifiIp: taraBridge.getWifiIpAddress(),
    //   ethIp: taraBridge.getEthernetIpAddress(),
    //   deviceSerial: taraBridge.getDeviceSerial(),
    //   displayRefreshRate: taraBridge.getScreenRefreshRate(),
    // };
    //console.log("Device System Info:", info);
    // test to clear the packages
    tara.oHtml("coinModal", "./templates/coin_modal.html", {
      button_start_id: "button_start_id",
      button_insert_close_event: (event) => {
        if (coinTimer != null) {
          clearTimeout(coinTimer);
        }
        tara.oId('coinModal').close();
        taraBridge.sendBleCommand("DATA:OFF");
      },
      button_start_time_event: (event) => {
        if (totalTime > 0) {
          if (coinTimer != null) {
            clearTimeout(coinTimer);
          }
          taraBridge.sendBleCommand("DATA:OFF");
          taraBridge.startBackgroundTimer(totalTime + 1, true); // setting this to true calls lockscreen natively
          taraBridge.moveToMenuWebview();
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
      button_resume_id: "button_resume_id",
      button_insert_show_event: (event) => {
        //console.log(event.currentTarget.id);
        if (coinTimer != null) {
          clearTimeout(coinTimer);
        }
        const bluetoothState = taraBridge.isBluetoothConnected();
        if (bluetoothState) {
          coinFunc();
          tara.oId('coinModal').show();
          taraBridge.sendBleCommand("DATA:ON");
        } else {
          taraBridge.showToast("Credit Terminal not connected!");
        }
      },
      button_resume_event: (event) => {
        taraBridge.moveToMenuWebview();
      }
    });

    // tara.oHtml("settings_id", "./templates/settings.html", {
    // });

    /**
     * if we still have time move to game menu
     */
    const remainingTime = taraBridge.getTimerRemainingSeconds();
    if (remainingTime > 0) {
      // show resume button
      taraBridge.pauseBackgroundTimer();
      tara.oId("screen_status_id").innerHTML = "PAUSED 🔒";
      tara.oId("button_resume_id").style.display = "block";
      tara.oId("button_insert_id").style.display = "none";
      tara.oId("remaining_time_id").innerHTML = formatSeconds(remainingTime);
    }
  }
}


onLoadEvent();

//  Remove Google Accounts
function removeAccounts() {
  if (taraBridge && taraBridge.removeGoogleAccount) {
    const isSuccess = taraBridge.removeGoogleAccount();
    // has issue showing no accounts exist
    if (isSuccess) {
      taraBridge.showToast("All accounts cleared!");
    } else {
      //taraBridge.showToast("No account exist");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}

//  Clear Standard Media Folders (Downloads, DCIM, Pictures, Videos)
function clearAllMedia() {
  if (taraBridge && taraBridge.clearDefaultMediaFolders) {
    const isSuccess = taraBridge.clearDefaultMediaFolders();
    if (isSuccess) {
      taraBridge.showToast("All default media folders cleared!");
    } else {
      taraBridge.showToast("Some files could not be deleted.");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}


//  Clear all app cache
function clearAllAppCache() {
  if (taraBridge && taraBridge.clearAllGameCache) {
    const isSuccess = taraBridge.clearAllGameCache();
    taraBridge.clearAllAppCacheExcludingGames();
    if (isSuccess) {
      taraBridge.showToast("All package cache cleared!");
    } else {
      taraBridge.showToast("No packages exist");
    }
  } else {
    console.warn("TaraBridge interface not available.");
  }
}

const coinFunc = () => {
  coinTimer = setTimeout(() => {
    //console.log("data, total:", totalCoin);
    if (saved.rates.length > 0) {
      totalTime = converterCreditToTime(totalCoin, saved.rates) * 60;
    } else {
      totalTime = totalCoin * 60 * 3;
    }

    convertTime(totalTime);
    tara.oId("coins_id").innerHTML = "₱" + totalCoin;
    tara.oId("button_start_id").style.display = "block";
    coinFunc();
  }, 1000);
}

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


function converterCreditToTime(credit, rates) {
  let totalMinutes = 0;
  let remainingCredit = credit;

  // Sort rates from highest price to lowest to guarantee largest tier selection first
  const sortedRates = [...rates].sort((a, b) => b.price - a.price);

  for (const rate of sortedRates) {
    if (remainingCredit <= 0) break;

    if (remainingCredit >= rate.price) {
      const multiplier = Math.floor(remainingCredit / rate.price);

      totalMinutes += multiplier * rate.minutes;
      remainingCredit -= multiplier * rate.price;
    }
  }

  return totalMinutes;
}
