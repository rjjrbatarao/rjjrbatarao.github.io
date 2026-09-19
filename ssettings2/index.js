
const tara = new ObraJS();



const taraFilter = (menu) => {
    console.log(menu);
    if (menu == "dashboard") {
        tara.oHtml("app-root", `./templates/${menu}.html`, {
            init: () => {
                metrics();
                if (window.Chart) {
                    Chart.defaults.color = "#c5d3ee";
                    Chart.defaults.font.family = "'DM Sans', sans-serif";
                    Chart.defaults.font.size = 10;
                    Chart.defaults.plugins.legend.display = false;
                    const ctx = $("#revenue").getContext("2d");
                    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
                    gradient.addColorStop(0, "rgba(183,186,255,.24)");
                    gradient.addColorStop(1, "rgba(183,186,255,0)");
                    revenueChart = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: [],
                            datasets: [
                                {
                                    label: "Current period",
                                    data: [],
                                    borderColor: "#b7baff",
                                    borderWidth: 2.5,
                                    backgroundColor: gradient,
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    pointHoverRadius: 5,
                                },
                                {
                                    label: "Previous period",
                                    data: [],
                                    borderColor: "#40c4ff",
                                    borderDash: [5, 5],
                                    borderWidth: 1.5,
                                    tension: 0.4,
                                    pointRadius: 0,
                                },
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
                                        label: (c) => c.dataset.label + ": $" + c.parsed.y.toLocaleString(),
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
                                        callback: (v) => "$" + v / 1000 + "k",
                                    },
                                },
                            },
                        },
                    });
                    updateChart();
                    trafficChart = new Chart($("#traffic"), {
                        type: "doughnut",
                        data: {
                            labels: ["Direct", "Organic search", "Referral", "Social"],
                            datasets: [
                                {
                                    data: [42, 28, 18, 12],
                                    backgroundColor: ["#b7baff", "#40c4ff", "#64ffda", "#ffd740"],
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
                    $("#revenue").parentElement.innerHTML =
                        '<div class="fallback">Revenue chart requires Chart.js.<br>Open this file in a browser with internet access.</div>';
                    $("#traffic").style.visibility = "hidden";
                }

            }
        });
    } else {
        selectPage(menu);
    }


}


const renderApp = () => {
    tara.oHtml("app-root", "./templates/dashboard.html", {

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


const $ = (s) => document.querySelector(s);
let factor = 1,
    interval = "weekly",
    revenueChart,
    trafficChart,
    expanded = false;
const customers = [
    ["Olivia Rhye", "olivia@acme.co", "Completed", "Sep 30, 2026", 249],
    ["Phoenix Baker", "phoenix@studio.io", "Completed", "Sep 30, 2026", 129],
    ["Lana Steiner", "lana@design.co", "Pending", "Sep 29, 2026", 349],
    ["Demi Wilkinson", "demi@layers.com", "Completed", "Sep 29, 2026", 199],
    ["Drew Cano", "drew@orbit.co", "Completed", "Sep 28, 2026", 499],
    ["Natali Craig", "natali@studio.io", "Pending", "Sep 28, 2026", 89],
    ["Andi Lane", "andi@acme.co", "Completed", "Sep 27, 2026", 249],
];
function metrics() {
    const cards = [
        [
            "Total revenue",
            "$" + Math.round(48295 * factor).toLocaleString(),
            "12.8",
            "chart",
        ],
        [
            "New customers",
            Math.round(1248 * factor).toLocaleString(),
            "8.2",
            "users",
        ],
        ["Total orders", Math.round(1842 * factor).toLocaleString(), "16.4", "bag"],
        ["Conversion rate", "3.62%", "2.1", "arrow"],
    ];
    $("#metrics").innerHTML = cards
        .map(
            ([label, value, change, icon], i) =>
                `<div class="card metric"><div class="metric-top">${label}<svg class="icon"><use href="#${icon}"/></svg></div><div class="value">${value}</div><div class="change">↗ ${change}%<span>vs. previous period</span></div><svg class="spark" viewBox="0 0 80 32"><path d="M1 29 10 22 19 25 29 16 38 20 48 ${i % 2 ? 11 : 15} 58 17 68 7 79 3" fill="none" stroke="#b6b1ff" stroke-width="1.7"/></svg></div>`,
        )
        .join("");
    $("#visitors").textContent = Math.round(24892 * factor).toLocaleString();
}
function rows() {
    const term = $("#search").value.toLowerCase();
    const list = customers.filter((c) =>
        c.join(" ").toLowerCase().includes(term),
    );
    $("#rows").innerHTML =
        list
            .slice(0, expanded ? 99 : 4)
            .map(
                (c) =>
                    `<tr><td><div class="customer"><span class="initials">${c[0]
                        .split(" ")
                        .map((n) => n[0])
                        .join(
                            "",
                        )}</span><div>${c[0]}<small>${c[1]}</small></div></div></td><td><span class="status ${c[2] === "Pending" ? "pending" : ""}">${c[2]}</span></td><td>${c[3]}</td><td class="amount">$${c[4].toFixed(2)}</td></tr>`,
            )
            .join("") || '<tr><td colspan="4">No matching transactions.</td></tr>';
}
let timer;
function toast(text) {
    $("#toast").textContent = text;
    $("#toast").style.display = "block";
    clearTimeout(timer);
    timer = setTimeout(() => ($("#toast").style.display = "none"), 3500);
}
function chartData() {
    const base =
        interval === "daily"
            ? [
                3200, 4100, 3650, 5200, 4400, 6100, 5700, 7400, 6200, 8300, 7600,
                10200,
            ]
            : interval === "monthly"
                ? [8200, 11200, 9400]
                : [4200, 6300, 4900, 7900, 6600, 10200];
    const labels =
        interval === "daily"
            ? Array.from({ length: 12 }, (_, i) => "Day " + (i + 1))
            : interval === "monthly"
                ? ["Jul", "Aug", "Sep"]
                : ["Sep 1", "Sep 6", "Sep 12", "Sep 18", "Sep 24", "Sep 30"];
    return { base: base.map((v) => Math.round(v * factor)), labels };
}
function updateChart() {
    if (!revenueChart) return;
    const { base, labels } = chartData();
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = base;
    revenueChart.data.datasets[1].data = base.map((v, i) =>
        Math.round(v * (i % 2 ? 0.72 : 0.8)),
    );
    revenueChart.update();
}

metrics();
//rows();
if (window.Chart) {
    Chart.defaults.color = "#c5d3ee";
    Chart.defaults.font.family = "'DM Sans', sans-serif";
    Chart.defaults.font.size = 10;
    Chart.defaults.plugins.legend.display = false;
    const ctx = $("#revenue").getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, "rgba(183,186,255,.24)");
    gradient.addColorStop(1, "rgba(183,186,255,0)");
    revenueChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Current period",
                    data: [],
                    borderColor: "#b7baff",
                    borderWidth: 2.5,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                },
                {
                    label: "Previous period",
                    data: [],
                    borderColor: "#40c4ff",
                    borderDash: [5, 5],
                    borderWidth: 1.5,
                    tension: 0.4,
                    pointRadius: 0,
                },
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
                        label: (c) => c.dataset.label + ": $" + c.parsed.y.toLocaleString(),
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
                        callback: (v) => "$" + v / 1000 + "k",
                    },
                },
            },
        },
    });
    updateChart();
    trafficChart = new Chart($("#traffic"), {
        type: "doughnut",
        data: {
            labels: ["Direct", "Organic search", "Referral", "Social"],
            datasets: [
                {
                    data: [42, 28, 18, 12],
                    backgroundColor: ["#b7baff", "#40c4ff", "#64ffda", "#ffd740"],
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
    $("#revenue").parentElement.innerHTML =
        '<div class="fallback">Revenue chart requires Chart.js.<br>Open this file in a browser with internet access.</div>';
    $("#traffic").style.visibility = "hidden";
}
$("#period").addEventListener("change", (e) => {
    factor = e.target.value === "7" ? 0.26 : e.target.value === "90" ? 2.85 : 1;
    metrics();
    updateChart();
    toast("Summary updated. Transactions and goals show September sample data.");
});
document.querySelectorAll("[data-interval]").forEach((b) =>
    b.addEventListener("click", () => {
        document.querySelector(".tabs .selected").classList.remove("selected");
        b.classList.add("selected");
        interval = b.dataset.interval;
        updateChart();
    }),
);
//$("#search").addEventListener("input", rows);
$("#view-all").addEventListener("click", () => {
    expanded = !expanded;
    rows();
    $("#view-all").textContent = expanded ? "Show less ↑" : "View all ↗";
});
// $("#notifications").addEventListener("click", () =>
//     toast("You’re all caught up. No new notifications."),
// );
// $("#upgrade").addEventListener("click", () =>
//     toast("You’re exploring a demo. Pro subscriptions are not connected."),
// );
document.querySelectorAll("[data-nav]").forEach((b) =>
    b.addEventListener("click", () => {
        const n = b.dataset.nav;
        if (n === "Overview") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (n === "Analytics")
            $(".charts").scrollIntoView({ behavior: "smooth" });
        else if (n === "Transactions" || n === "Customers") {
            $("#transactions").scrollIntoView({ behavior: "smooth" });
            expanded = true;
            rows();
            $("#view-all").textContent = "Show less ↑";
        } else if (n === "Reports") $("#export").click();
        else toast(n + " is not connected in this static demo.");
    }),
);
document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        $("#search").focus();
    }
});





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
    const saved = JSON.parse(localStorage.getItem("orbit-device-settings"));
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
const persist = () => {
    try {
        // Tokens remain in memory only: do not persist credentials to localStorage.
        localStorage.setItem(
            "orbit-device-settings",
            JSON.stringify({ ...state, others: { ...state.others, token: "" } }),
        );
        return true;
    } catch (_) {
        notify(
            "Could not save: browser storage is unavailable or full. Remove some images and try again.",
        );
        return false;
    }
};
const toggle = (id, title, description, checked) =>
    OrbitUI.render("toggleSwitch", {
        value0: id,
        value1: title,
        value2: description,
        value3: id,
        value4: checked ? "checked" : "",
    });
function shell(title, description, content) {
    OrbitUI.mount("app-root", "pageShell", {
        value0: title,
        value1: description,
        value2: content,
    });
}
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
function renderImages() {
    const key = page,
        data = state[key];
    shell(
        key === "game" ? "Game" : "Lockscreen",
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
        if (!confirm(`Remove all ${key} images from this browser?`)) return;
        capture();
        data.images = [];
        if (persist()) notify("Image cache cleared.");
        renderImages();
    };
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
}
