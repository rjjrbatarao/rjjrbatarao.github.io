
const taraBridge = new KioskService();

taraBridge.showToast("Action completed successfully!");

const todaySalesJson = taraBridge.getTodaySalesList();
const tatalCount = taraBridge.getTotalSalesCount();
const tatalSum = taraBridge.getTotalSalesSum();
const todayGrouped = taraBridge.getGroupedByCredit();
const dailySales = taraBridge.getDailySalesSummary();
const weeklySales = taraBridge.getWeeklySalesSummary();
const monthSales = taraBridge.getMonthlySalesSummary();

// console.log("Latest sale:", todaySalesJson);
// console.log("count:", tatalCount);
// console.log("sum:", tatalSum);
// console.log("grouped:", todayGrouped);
// console.log("dailySales:", dailySales);
// console.log("weeklySales:", weeklySales);
// console.log("monthlySales:", monthSales);

console.log("flatten: ", convertKeys(todaySalesJson, ['credit', 'timestamp']));


const menuItems = (menu) => {
    console.log(menu);
    if (menu == "dashboard") {
        obrajs.oHtml("app-root", `./templates/${menu}.html`, {
            init: () => {
                metrics();
                renderCharts();
            }
        });
    } else {
        selectPage(menu);
    }
}


const renderApp = () => {
    obrajs.oHtml("app-root", "./templates/dashboard.html", {
        init: () => {
            metrics();
            renderCharts();
        }
    });
}


renderApp();

var swiper3 = new Swiper('.xsmall-swiper', {
    grabCursor: true,
    slidesPerView: 4,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    on: {
        slideChange: function () {
            console.log('ABCD changed to index: ', this.realIndex);

        }
    }
});

let factor = 1,
    interval = "weekly",
    revenueChart,
    trafficChart,
    expanded = false;
// const customers = [
//     ["Olivia Rhye", "olivia@acme.co", "Completed", "Sep 30, 2026", 249],
//     ["Phoenix Baker", "phoenix@studio.io", "Completed", "Sep 30, 2026", 129],
//     ["Lana Steiner", "lana@design.co", "Pending", "Sep 29, 2026", 349],
//     ["Demi Wilkinson", "demi@layers.com", "Completed", "Sep 29, 2026", 199],
//     ["Drew Cano", "drew@orbit.co", "Completed", "Sep 28, 2026", 499],
//     ["Natali Craig", "natali@studio.io", "Pending", "Sep 28, 2026", 89],
//     ["Andi Lane", "andi@acme.co", "Completed", "Sep 27, 2026", 249],
// ];
function metrics() {
    const cards = [
        [
            "Today Total",
            "₱" + taraBridge.getTotalCreditToday().toLocaleString(),
            "100",
            "chart",
        ],
        [
            "Yesterday Total",
            "₱" + taraBridge.getTotalCreditYesterday().toLocaleString(),
            "100",
            "users",
        ],
        ["Weekly Total ", "₱" + taraBridge.getTotalCreditWeekly().toLocaleString(), "100", "bag"],
        ["Monthly Total", "₱" + taraBridge.getTotalCreditMonthly().toLocaleString(), "100", "arrow"],
    ];
    obrajs.oId("metrics").innerHTML = cards
        .map(([label, value, change, icon], i) =>
            OrbitUI.render("metricCard", {
                value0: label,
                value1: icon,
                value2: value,
                value3: change,
                value4: i % 2 ? 11 : 15,
            }),
        )
        .join("");
    obrajs.oId("sales").textContent = Math.round(
        taraBridge.getTotalSalesSum() * factor,
    ).toLocaleString();
}

let timer;
function toast(text) {
    obrajs.oId("toast").textContent = text;
    obrajs.oId("toast").style.display = "block";
    clearTimeout(timer);
    timer = setTimeout(() => (obrajs.oId("toast").style.display = "none"), 3500);
}
function chartData() {
    const dailyCredit = convertKeys(dailySales, ['coinAmount']).coinAmount;
    const dailyTimestampEpoch = convertKeys(dailySales, ['day']).day;
    const dailyTimestampDate = dailyTimestampEpoch.map(function (num) {
        return epochToMMDD(num);
    });

    const weeklyCredit = convertKeys(weeklySales, ['coinAmount']).coinAmount;
    // const weeklyTimestampEpoch = convertKeys(weeklySales, ['week']).week;
    // const weeklyTimestampDate = weeklyTimestampEpoch.map(function (num) {
    //     return num;
    // });

    const monthlyCredit = convertKeys(monthSales, ['coinAmount']).coinAmount;
    const monthlyTimestampEpoch = convertKeys(monthSales, ['month']).month;
    const monthlyTimestampDate = monthlyTimestampEpoch.map(function (num) {
        return epochToMM(num);
    });

    const base =
        interval === "daily"
            ? [
                ...dailyCredit
            ]
            : interval === "monthly"
                ? [...monthlyCredit]
                : [...weeklyCredit];
    const labels =
        interval === "daily"
            ? [...dailyTimestampDate]
            : interval === "monthly"
                ? [...monthlyTimestampDate]
                : Array.from({ length: weeklyCredit.length }, (_, i) => "Week " + (i + 1));
    return { base: base.map((v) => Math.round(v * factor)), labels };
}
function updateChart() {
    if (!revenueChart) return;
    const { base, labels } = chartData();
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = base;
    // revenueChart.data.datasets[1].data = base.map((v, i) =>
    //     Math.round(v * (i % 2 ? 0.72 : 0.8)),
    // );
    revenueChart.update();


}



function renderCharts() {
    if (window.Chart) {
        Chart.defaults.color = "#c5d3ee";
        Chart.defaults.font.family = "'DM Sans', sans-serif";
        Chart.defaults.font.size = 10;
        Chart.defaults.plugins.legend.display = false;
        const ctx = obrajs.oId("revenue").getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, "rgba(183,186,255,.24)");
        gradient.addColorStop(1, "rgba(183,186,255,0)");
        revenueChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Sales: ",
                        data: [],
                        borderColor: "#b7baff",
                        borderWidth: 2.5,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                    },
                    // {
                    //     label: "Previous period",
                    //     data: [],
                    //     borderColor: "#40c4ff",
                    //     borderDash: [5, 5],
                    //     borderWidth: 1.5,
                    //     tension: 0.4,
                    //     pointRadius: 0,
                    // },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: "index" },
                plugins: {
                    tooltip: {
                        backgroundColor: "#110e34",
                        padding: 12,
                        callbacks: {
                            label: (c) => c.dataset.label + ": ₱" + c.parsed.y.toLocaleString(),
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { maxRotation: 0 },
                    },
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: "#35415c" },
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: (v) => "₱" + v,
                        },
                    },
                },
            },
        });
        updateChart();
        const ringData = convertPercent(todayGrouped);

        trafficChart = new Chart(obrajs.oId("traffic"), {
            type: "doughnut",
            data: {
                labels: [...ringData.credit],
                datasets: [
                    {
                        data: [...ringData.percent],
                        backgroundColor: [...getRandomColorArray(ringData.credit.length)],
                        borderColor: "#151c30",
                        borderWidth: 5,
                        borderRadius: 5,
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "79%",
                plugins: {
                    tooltip: {
                        callbacks: { label: (c) => c.label + ": " + c.parsed + "%" },
                    },
                },
            },
        });
    } else {
        obrajs.oId("revenue").parentElement.innerHTML =
            '<div class="fallback">Revenue chart requires Chart.js.<br>Open this file in a browser with internet access.</div>';
        obrajs.oId("traffic").style.visibility = "hidden";
    }
}


obrajs.oId("period").addEventListener("change", (e) => {
    factor = e.target.value === "7" ? 0.26 : e.target.value === "90" ? 2.85 : 1;
    metrics();
    updateChart();
    toast("Summary updated. Transactions and goals show September sample data.");
});
document.querySelectorAll("[data-interval]").forEach((b) =>
    b.addEventListener("click", () => {
        document.querySelectorAll("[data-interval]").forEach((tab) => {
            tab.classList.toggle("selected", tab === b);
        });
        interval = b.dataset.interval;
        updateChart();
    }),
);


document.querySelectorAll("[data-nav]").forEach((b) =>
    b.addEventListener("click", () => {
        const n = b.dataset.nav;
        if (n === "Overview") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (n === "Analytics")
            obrajs.oId("analytics-charts").scrollIntoView({ behavior: "smooth" });
        else if (n === "Transactions" || n === "Customers") {
            obrajs.oId("transactions").scrollIntoView({ behavior: "smooth" });
            expanded = true;
            rows();
            obrajs.oId("view-all").textContent = "Show less ↑";
        } else if (n === "Reports") obrajs.oId("export").click();
        else toast(n + " is not connected in this static demo.");
    }),
);
document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        obrajs.oId("search").focus();
    }
});
// obrajs.oId("export").addEventListener("click", () => {
//     const csv =
//         "Orbit analytics — sample data\r\nPeriod," +
//         obrajs.oId("period").selectedOptions[0].text +
//         "\r\nRevenue," +
//         Math.round(48295 * factor) +
//         "\r\nNew customers," +
//         Math.round(1248 * factor) +
//         "\r\nOrders," +
//         Math.round(1842 * factor) +
//         "\r\nConversion rate,3.62%\r\n\r\nCustomer,Email,Status,Date,Amount\r\n" +
//         customers
//             .map((c) =>
//                 c.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
//             )
//             .join("\r\n");
//     const url = URL.createObjectURL(
//         new Blob([csv], { type: "text/csv;charset=utf-8;" }),
//     );
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "orbit-analytics-report.csv";
//     a.click();
//     setTimeout(() => URL.revokeObjectURL(url), 1000);
//     toast("Your report has been exported.");
// });





//------------------------------------------------------------

const root = obrajs.oId("app-root");
const defaults = () => ({
    game: { images: [], random: false, auto: true, interval: 10 },
    lockscreen: { images: [], random: false, auto: true, interval: 15 },
    rates: [],
    others: {
        from: "22:00",
        to: "06:00",
        restart: "04:00",
        email: "",
        token: "",
        messaging: false,
    },
});
let state = defaults();
try {
    //const saved = JSON.parse(localStorage.getItem("orbit-device-settings"));
    const saved = JSON.parse(taraBridge.getSecureData("orbit-device-settings", JSON.stringify(state)));
    console.log("persistent data: ", saved);
    if (saved) state = { ...state, ...saved };
} catch (_) { }
let page = "",
    editing = null;
const escape = (text) =>
    String(text).replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c],
    );

const notify = (text) => toast(text);
/**
 * 
 * 
 */
const persist = () => {
    try {
        // Tokens remain in memory only: do not persist credentials to localStorage.
        // localStorage.setItem(
        //     "orbit-device-settings",
        //     JSON.stringify({ ...state, others: { ...state.others, token: "" } }),
        // );
        taraBridge.setSecureData("orbit-device-settings", JSON.stringify({ ...state, others: { ...state.others, token: "" } }));
        return true;
    } catch (_) {
        notify(
            "Could not save: browser storage is unavailable or full. Remove some images and try again.",
        );
        return false;
    }
};
/**
 * 
 * 
 */
const toggle = (id, title, description, checked) =>
    OrbitUI.render("toggleSwitch", {
        value0: id,
        value1: title,
        value2: description,
        value3: id,
        value4: checked ? "checked" : "",
    });
/**
 * 
 * 
 */
function shell(title, description, content) {
    OrbitUI.mount("app-root", "pageShell", {
        value0: title,
        value1: description,
        value2: content,
    });
}
/**
 * 
 * 
 */
function selectPage(key) {
    page = key;

    document
        .querySelectorAll("aside button.active")
        .forEach((el) => el.classList.remove("active"));
    //obrajs.oId(`nav-${key}`).classList.add("active");
    // obrajs.oId("page-breadcrumb").textContent =
    //     key === "lockscreen" ? "Lockscreen" : key[0].toUpperCase() + key.slice(1);
    if (key === "game" || key === "lockscreen") renderImages();
    if (key === "rates") renderRates();
    if (key === "others") renderOthers();
    window.scrollTo({ top: 0, behavior: "smooth" });
}
document
    .querySelectorAll("[data-page]")
    .forEach((button) =>
        button.addEventListener("click", () => selectPage(button.dataset.page)),
    );
document.querySelectorAll("[data-nav]").forEach((button) =>
    button.addEventListener("click", () => {
        root.innerHTML = "";
        page = "";

        document
            .querySelectorAll("aside button.active")
            .forEach((el) => el.classList.remove("active"));
        button.classList.add("active");
        //obrajs.oId("page-breadcrumb").textContent = "Overview";
        if (["Customers", "Transactions"].includes(button.dataset.nav))
            obrajs.oId("transactions").scrollIntoView({ behavior: "smooth" });
        if (button.dataset.nav === "Analytics")
            obrajs.oId("analytics-charts").scrollIntoView({ behavior: "smooth" });
    }),
);
/**
 * 
 * 
 */
function renderImages() {
    const key = page,
        data = state[key];
    shell(
        key === "game" ? "Game Menu" : "Lockscreen",
        "Manage your image library and slideshow preferences.",
        OrbitUI.render("imageSettings", {
            value0: data.images.length,
            value1: data.images.length
                ? data.images
                    .map((img, i) =>
                        OrbitUI.render("imageCard", {
                            value0: img.src,
                            value1: escape(img.name),
                            value2: escape(img.name),
                            value3: i,
                        }),
                    )
                    .join("")
                : '<div class="empty">No images yet.<br><br>Add images to build your slideshow.</div>',
            value2: toggle(
                "randomize",
                "Randomize images",
                "Play images in a shuffled order.",
                data.random,
            ),
            value3: toggle(
                "auto-transition",
                "Auto transition",
                "Automatically advance to the next image.",
                data.auto,
            ),
            value4: data.interval,
            value5: data.interval,
        }),
    );
    const capture = () => {
        data.random = obrajs.oId("randomize").checked;
        data.auto = obrajs.oId("auto-transition").checked;
        data.interval = Number(obrajs.oId("interval").value);
    };
    obrajs
        .oId("interval")
        .addEventListener(
            "input",
            (e) =>
            (obrajs.oId("interval-value").textContent =
                `${e.target.value} seconds`),
        );
    obrajs.oId("save-images").onclick = () => {
        capture();
        if (persist()) notify("Playback preferences saved.");
    };
    obrajs.oId("clear-images").onclick = () => {
        if (!data.images.length) return notify("Image cache is already empty.");
        //if (!confirm(`Remove all ${key} images from this browser?`)) return;
        capture();
        data.images = [];
        if (persist()) notify("Image cache cleared.");
        renderImages();
    };
    // obrajs.oId("clear-web-cache").onclick = () => {
    //     if (!data.images.length) return notify("Web cache is already empty.");
    //     //if (!confirm(`Remove all ${key} images from this browser?`)) return;
    //     if (persist()) notify("Web cache cleared.");
    // };
    document.querySelectorAll("[data-remove]").forEach(
        (button) =>
        (button.onclick = () => {
            capture();
            data.images.splice(Number(button.dataset.remove), 1);
            persist();
            renderImages();
        }),
    );
    obrajs.oId("image-upload").addEventListener("change", async (e) => {
        capture();
        const files = Array.from(e.target.files);
        e.target.disabled = true;
        for (const file of files) {
            if (
                !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
                    file.type,
                ) ||
                file.size > 2 * 1024 * 1024
            ) {
                notify(`${file.name}: use a supported image under 2 MB.`);
                continue;
            }
            try {
                const src = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                data.images.push({ name: file.name, src });
                if (!persist()) {
                    data.images.pop();
                    break;
                }
            } catch (_) {
                notify(`Could not read ${file.name}.`);
            }
        }
        if (page === key) renderImages();
    });
}
/**
 * 
 * 
 */
function renderRates() {
    const rate = state.rates.find((r) => r.id === editing);
    shell(
        "Rates",
        "Create and manage pricing options for your customers.",
        '<div id="rates-content"></div>',
    );
    OrbitUI.mount("rates-content", "ratesPage", {
        rateCount: state.rates.length,
        rateRows: state.rates.length
            ? state.rates
                .map((r) =>
                    OrbitUI.render("rateRow", {
                        value0: escape(r.name),
                        value1: r.minutes,
                        value2: Number(r.price).toFixed(2),
                        value3: r.id,
                        value4: r.id,
                    }),
                )
                .join("")
            : '<tr><td colspan="4" style="padding:35px;text-align:center">No rates yet. Add your first plan.</td></tr>',
        formTitle: rate ? "Edit rate" : "Add a new rate",
        rateName: escape(rate?.name || ""),
        durationMinutes: rate?.minutes || 60,
        price: rate?.price ?? "",
        cancelButton: rate
            ? '<button class="btn" type="button" id="cancel-rate">Cancel</button>'
            : "",
    });
    obrajs.oId("new-rate").onclick = () => {
        editing = null;
        renderRates();
        obrajs.oId("rate-name").focus();
    };
    obrajs.oId("cancel-rate")?.addEventListener("click", () => {
        editing = null;
        renderRates();
    });
    document.querySelectorAll("[data-edit]").forEach(
        (b) =>
        (b.onclick = () => {
            editing = b.dataset.edit;
            renderRates();
            obrajs.oId("rate-name").focus();
        }),
    );
    document.querySelectorAll("[data-delete]").forEach(
        (b) =>
        (b.onclick = () => {
            //if (!confirm("Delete this rate plan?")) return;
            state.rates = state.rates.filter((r) => r.id !== b.dataset.delete);
            if (editing === b.dataset.delete) editing = null;
            if (persist()) notify("Rate deleted.");
            renderRates();
        }),
    );
    obrajs.oId("rate-form").onsubmit = (e) => {
        e.preventDefault();
        const name = obrajs.oId("rate-name").value.trim();
        if (!name) return notify("Enter a rate name.");
        const item = {
            id:
                editing ||
                Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            name,
            minutes: Number(obrajs.oId("rate-minutes").value),
            price: Number(obrajs.oId("rate-price").value),
        };
        const index = state.rates.findIndex((r) => r.id === editing);
        if (index >= 0) state.rates[index] = item;
        else state.rates.push(item);
        if (persist()) {
            editing = null;
            notify("Rate saved.");
            renderRates();
        }
    };
}
/**
 * 
 * 
 */
function renderOthers() {
    const data = state.others;
    shell(
        "Others",
        "Set operating hours, restart schedules and messaging preferences.",
        OrbitUI.render("otherSettings", {
            value0: escape(data.from),
            value1: escape(data.to),
            value2: escape(data.restart),
            value3: toggle(
                "messaging-enabled",
                "Enable messaging",
                "Use email and a token for notifications.",
                data.messaging,
            ),
            value4: escape(data.email),
            value5: escape(data.token),
        }),
    );
    const update = () => {
        const enabled = obrajs.oId("messaging-enabled").checked;
        ["message-email", "message-token"].forEach((id) => {
            obrajs.oId(id).disabled = !enabled;
            obrajs.oId(id).required = enabled;
        });
    };
    update();
    obrajs.oId("messaging-enabled").onchange = update;
    obrajs.oId("others-form").onsubmit = (e) => {
        e.preventDefault();
        const from = obrajs.oId("curfew-from").value,
            to = obrajs.oId("curfew-to").value;
        if (from === to)
            return notify("Choose different curfew start and end times.");
        state.others = {
            from,
            to,
            restart: obrajs.oId("restart-time").value,
            messaging: obrajs.oId("messaging-enabled").checked,
            email: obrajs.oId("message-email").value.trim(),
            token: obrajs.oId("message-token").value,
        };
        if (persist())
            notify("Settings saved. Device integration is not connected.");
    };
    obrajs.oId("clear-sales").onclick = () => {
        //if (!data.images.length) return notify("Sales Database is already empty.");
        //if (!confirm(`Remove all ${key} images from this browser?`)) return;
        //capture();
        //data.images = [];
        taraBridge.deleteAllSales();
        if (persist()) notify("Sales database cleared.");
    };
}



const epochToMMDD = (epochTime) => {
    const date = new Date(epochTime);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

const epochToMM = (epochTime) => {
    const date = new Date(epochTime);
    return date.toLocaleDateString('en-US', {
        month: 'short',
    });
}

function convertKeys(arr, keysToExtract) {
    let result = {};
    // Initialize empty arrays for each requested key
    keysToExtract.forEach(key => result[key] = []);
    // Populate the arrays
    arr.forEach(item => {
        keysToExtract.forEach(key => {
            if (item.hasOwnProperty(key)) {
                result[key].push(item[key]);
            }
        });
    });

    return result;
}


const convertPercent = (arr) => {
    // 1. Calculate the total sum of counts
    const totalCount = arr.reduce((sum, item) => sum + item.count, 0);

    // 2. Map the data into the target object structure
    return {
        credit: arr.map(item => item.credit),
        count: arr.map(item => item.count),
        percent: arr.map(item => Number(((item.count / totalCount) * 100).toFixed(2)))
    };
};

const getRandomColorArray = (count) => {
    const colors = [];
    // Golden ratio conjugate ensures maximum hue distance between consecutive items
    const goldenRatioConjugate = 0.618033988749895;

    // Randomize the starting point on the color wheel
    let hue = Math.random();

    for (let i = 0; i < count; i++) {
        hue = (hue + goldenRatioConjugate) % 1;
        const h = hue * 360;

        // Fixed high saturation & balanced lightness for a vibrant pastel look
        const saturation = 85;
        const lightness = 65;

        // Convert HSL to Hex
        const s = saturation / 100;
        const l = lightness / 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

        const toHex = (val) => {
            const hex = Math.round((val + m) * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        colors.push(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
    }

    return colors;
};