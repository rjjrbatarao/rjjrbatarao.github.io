function triggerToast() {
            // Check if running inside our Android WebView container
            if (window.taraBridge) {
                window.taraBridge.showToast("Hello from Webview JS!");
            } else {
                console.log("Not running inside Android WebView container");
            }
        }

        function fetchVersion() {
            if (window.taraBridge) {
                const version = window.taraBridge.getAppVersion();
                alert("Native App Version: " + version);
            }
        }