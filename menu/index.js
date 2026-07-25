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


/**
 *
 * @returns template rendered from users array
 * count is global variable
 */
const allApps = () => {
  const apps = JSON.parse(window.TaraBridge.getWhitelistedAppsDetails());
  let app_map = "";
  apps.map((app) => {
    app_map += tara.oString("./templates/app_item.html", {
      app_name: app.appName,
      app_id: app.packageName,
      app_icon: app.icon,
      app_button: (event) => {
        console.log(event.currentTarget);
        openChrome(app.packageName);
      }
    });
  });
  return app_map;
};


tara.oHtml("app", "./templates/app_layout.html", {
  swiper: () => {
    var swiper = new Swiper(".x-slider", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      //slidesPerView: "auto",
      slidesPerView: 3,
      spaceBetween: 0,
      loop: true,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 50,
        modifier: 2.0,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
      keyboard: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      },
    });

    swiper.on("keyPress", (swiper, keyCode) => {
      console.log(keyCode);
      switch (keyCode) {
        case 38:
          swiper.slidePrev();
          break;
        case 40:
          swiper.slideNext();
          break;
      }
    });

    swiper.on("slideChange", function () {
      //console.log(this.realIndex);
      const index_currentSlide = this.realIndex;
      const index_activeSlide = this.activeIndex;
      const currentSlide = this.slides[index_activeSlide];
      const totalSlides = this.slides.length;
      this.slides.forEach((element, idx) => {
        element.classList.remove("contrast");
        element.classList.add("blur");
        ps4_select.play();
        //element.classList.remove("scale-up-center");
        //element.classList.add("scale-down-center");
      });
      console.log(index_activeSlide);
      currentSlide.classList.remove("blur");
      currentSlide.classList.add("contrast");
      //currentSlide.classList.remove("scale-down-center");
      //currentSlide.classList.add("scale-up-center");
    });

  }
});