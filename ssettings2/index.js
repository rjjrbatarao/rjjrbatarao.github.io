
const tara = new ObraJS();


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
  }
}


onLoadEvent();


