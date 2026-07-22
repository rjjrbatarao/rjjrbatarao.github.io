function triggerToast() {
            // Check if running inside our Android WebView container
            if (window.TaraBridge) {
                window.TaraBridge.showToast("Hello from Webview JS!");
            } else {
                console.log("Not running inside Android WebView container");
            }
        }

        function fetchVersion() {
            if (window.TaraBridge) {
                const version = window.TaraBridge.getAppVersion();
                alert("Native App Version: " + version);
            }
        }