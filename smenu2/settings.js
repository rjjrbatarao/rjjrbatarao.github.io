const LOCAL_STORAGE_KEY = 'midori_demo_settings_v4';

const DEFAULT_IMAGE_URLS = [
    "./wallpapers/ml/0.jpeg",
    "./wallpapers/ml/1.jpeg",
    "./wallpapers/ml/2.jpeg",
    "./wallpapers/ml/3.jpeg",
];

const DEFAULTS = {
    imageUrls: [...DEFAULT_IMAGE_URLS],
    autoTransition: {
        enabled: false,
        random: false,
        interval: 5.0
    },
    effects: {
        bloom: false,
        blur: false,
        motionBlur: false,
        rgbShift: false,
        vignette: false,
        vignetteBlur: false
    }
};

let settings = JSON.parse(JSON.stringify(DEFAULTS));

let renderer;
let midori;
let images = [];
let imageIndex = 0;

let autoTimer = null;
let isTransitioning = false;
const transitionTypes = ['blend', 'wipe', 'blur', 'slide', 'glitch'];

document.addEventListener("DOMContentLoaded", async () => {
    midori = window.midori;
    const canvas = document.getElementById('canvas');
    renderer = new midori.BackgroundRenderer(canvas);

    loadSettingsFromLocalStorage();
    await loadAllImageTextures();

    if (images.length > 0) {
        await renderer.setBackground(images[0]);
    }

    applySettingsToUI();
    resetCameraToStatic();
    // NOTE: syncEffects() removed from init loop to prevent redundant background recalculations.

    if (settings.autoTransition.enabled) {
        scheduleNextAutoTransition();
    }


});

toggleSettingsUI(false);
// --- UI TOGGLE MANAGEMENT ---
function toggleSettingsUI(show) {
    const panel = document.getElementById('settings_id');
    const openBtn = document.getElementById('open-ui-btn');

    if (show) {
        panel.classList.remove('hidden');
        openBtn.classList.remove('visible');
    } else {
        panel.classList.add('hidden');
        openBtn.classList.add('visible');
    }
}

// --- DYNAMIC IMAGE MANAGEMENT ---
async function loadAllImageTextures() {
    images = [];
    for (const url of settings.imageUrls) {
        try {
            const texture = await midori.loadImage(url);
            images.push(texture);
        } catch (err) {
            console.warn("Failed to load image texture from URL:", url, err);
        }
    }
}

async function addImageUrlFromInput() {
    const input = document.getElementById('input-image-url');
    const url = input.value.trim();

    if (!url) return;

    if (settings.imageUrls.includes(url)) {
        window.TaraBridge.showToast("This URL is already in your image list.");
        return;
    }

    try {
        const texture = await midori.loadImage(url);
        settings.imageUrls.push(url);
        images.push(texture);
        input.value = '';
        renderImageList();
        saveSettingsToLocalStorage();
    } catch (e) {
        window.TaraBridge.showToast("Failed to load image. Please verify the URL and CORS headers.");
    }
}

async function removeImageUrl(index) {
    if (settings.imageUrls.length <= 1) {
        window.TaraBridge.showToast("You must keep at least one image in the list.");
        return;
    }

    settings.imageUrls.splice(index, 1);
    images.splice(index, 1);

    if (imageIndex >= images.length) {
        imageIndex = 0;
    }

    renderImageList();
    saveSettingsToLocalStorage();

    if (images[imageIndex]) {
        await renderer.setBackground(images[imageIndex]);
        resetCameraToStatic();
    }
}

function renderImageList() {
    const container = document.getElementById('image-list-container');
    container.innerHTML = '';

    settings.imageUrls.forEach((url, idx) => {
        const item = document.createElement('div');
        item.className = 'image-item';

        const text = document.createElement('span');
        text.innerText = `${idx + 1}. ${url}`;
        text.title = url;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn s-button';
        removeBtn.innerText = 'Remove';
        removeBtn.onclick = () => removeImageUrl(idx);

        item.appendChild(text);
        item.appendChild(removeBtn);
        container.appendChild(item);
    });
}

// --- LOCALSTORAGE & DEFAULTS MANAGEMENT ---
function loadSettingsFromLocalStorage() {
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            settings = { ...DEFAULTS, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn("Unable to load settings from localStorage:", e);
    }
}

function saveSettingsToLocalStorage() {
    try {
        readSettingsFromUI();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.warn("Unable to save settings to localStorage:", e);
    }
}

async function resetSettingsToDefaults() {
    settings = JSON.parse(JSON.stringify(DEFAULTS));
    await loadAllImageTextures();
    renderImageList();
    applySettingsToUI();
    saveSettingsToLocalStorage();

    if (images.length > 0) {
        imageIndex = 0;
        await renderer.setBackground(images[0]);
    }

    resetCameraToStatic();
    syncEffects(); // Explicit button click action

    if (autoTimer) clearTimeout(autoTimer);
    if (settings.autoTransition.enabled) {
        scheduleNextAutoTransition();
    }
}

function applySettingsToUI() {
    document.getElementById('check-random').checked = settings.autoTransition.random;
    document.getElementById('slider-interval').value = settings.autoTransition.interval;

    const autoBtn = document.getElementById('btn-autoTransition');
    if (settings.autoTransition.enabled) {
        autoBtn.innerText = 'Auto Transitions: ON';
        autoBtn.classList.add('active');
    } else {
        autoBtn.innerText = 'Auto Transitions: OFF';
        autoBtn.classList.remove('active');
    }

    Object.keys(settings.effects).forEach(effectKey => {
        const btn = document.getElementById(`btn-${effectKey}`);
        if (btn) btn.classList.toggle('active', settings.effects[effectKey]);
    });

    renderImageList();
    updateReadouts();
}

function readSettingsFromUI() {
    settings.autoTransition.random = document.getElementById('check-random').checked;
    settings.autoTransition.interval = parseFloat(document.getElementById('slider-interval').value);
}

function updateReadouts() {
    document.getElementById('val-interval').innerText = settings.autoTransition.interval.toFixed(1) + 's';
}

function onSettingsChanged() {
    readSettingsFromUI();
    updateReadouts();
    saveSettingsToLocalStorage();

    if (settings.autoTransition.enabled) {
        if (autoTimer) clearTimeout(autoTimer);
        scheduleNextAutoTransition();
    }
}

function resolveEasing(category, mode) {
    if (!midori || !midori.Easings) return (t) => t;

    const targetCat = midori.Easings[category];
    if (!targetCat) return (t) => t;

    let easingCandidate = targetCat[mode] || targetCat;

    if (typeof easingCandidate === 'function') {
        try {
            const instance = new easingCandidate();
            if (typeof instance[mode] === 'function') return instance[mode].bind(instance);
            if (typeof instance.evaluate === 'function') return instance.evaluate.bind(instance);
        } catch (e) {
            return easingCandidate;
        }
    }

    if (typeof easingCandidate === 'object' && easingCandidate !== null) {
        if (typeof easingCandidate.evaluate === 'function') return easingCandidate.evaluate.bind(easingCandidate);
        if (typeof easingCandidate[mode] === 'function') return easingCandidate[mode].bind(easingCandidate);
    }

    return (t) => t;
}

function resetCameraToStatic() {
    const background = renderer.background;
    if (!background || !background.camera) return;

    const camera = background.camera;

    if (typeof camera.move === 'function') {
        camera.move({ x: 0.5, y: 0.5, z: 0.5 }, { duration: 0 });
    }
    if (typeof camera.rotate === 'function') {
        camera.rotate(0, { duration: 0 });
    }
    if (typeof camera.offset === 'function') {
        camera.offset({ x: 0, y: 0, z: 0, zr: 0 }, { duration: 0 });
    }
    if (typeof camera.sway === 'function') {
        camera.sway({ x: 0, y: 0, z: 0, zr: 0 }, { duration: 0, loop: false });
    }
}

function toggleAutoTransition() {
    settings.autoTransition.enabled = !settings.autoTransition.enabled;

    const btn = document.getElementById('btn-autoTransition');
    if (settings.autoTransition.enabled) {
        btn.innerText = 'Auto Transitions: ON';
        btn.classList.add('active');
        scheduleNextAutoTransition();
    } else {
        btn.innerText = 'Auto Transitions: OFF';
        btn.classList.remove('active');
        if (autoTimer) clearTimeout(autoTimer);
    }

    saveSettingsToLocalStorage();
}

let lastTransitionType = null;

function scheduleNextAutoTransition() {
    if (!settings.autoTransition.enabled) return;

    const intervalMs = settings.autoTransition.interval * 1000;
    autoTimer = setTimeout(async () => {
        if (!settings.autoTransition.enabled) return;

        let selectedType;
        if (settings.autoTransition.random) {
            // Exclude the last used transition from the pool
            const availableTypes = transitionTypes.filter(t => t !== lastTransitionType);
            selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        } else {
            const currentTypeIndex = transitionTypes.indexOf(lastTransitionType || 'blend');
            selectedType = transitionTypes[(currentTypeIndex + 1) % transitionTypes.length];
        }

        await triggerTransition(selectedType, settings.autoTransition.random);
        scheduleNextAutoTransition();
    }, intervalMs);
}

async function triggerTransition(typeKey, forceRandomImage = false) {
    if (!renderer || images.length === 0 || isTransitioning) return;
    isTransitioning = true;
    lastTransitionType = typeKey;
    const isRandom = settings.autoTransition.random || forceRandomImage;

    if (isRandom && images.length > 1) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * images.length);
        } while (nextIndex === imageIndex);
        imageIndex = nextIndex;
    } else {
        imageIndex = (imageIndex + 1) % images.length;
    }

    const nextTexture = images[imageIndex];
    const { TransitionType, SlideDirection, WipeDirection } = midori;
    let transitionConfig = {};

    switch (typeKey) {
        case 'blend':
            transitionConfig = {
                type: TransitionType.Blend,
                config: {
                    duration: 1.0,
                    easing: resolveEasing('Cubic', 'InOut')
                }
            };
            break;

        case 'wipe':
            transitionConfig = {
                type: TransitionType.Wipe,
                config: {
                    gradient: 0.5,
                    duration: 1.0,
                    easing: resolveEasing('Cubic', 'Out'),
                    direction: WipeDirection.Right
                }
            };
            break;

        case 'blur':
            transitionConfig = {
                type: TransitionType.Blur,
                config: {
                    intensity: 6,
                    duration: 1.0,
                    easing: resolveEasing('Quadratic', 'InOut')
                }
            };
            break;

        case 'slide':
            transitionConfig = {
                type: TransitionType.Slide,
                config: {
                    slides: 1,
                    intensity: 3,
                    duration: 1.0,
                    easing: resolveEasing('Quintic', 'InOut'),
                    direction: SlideDirection.Left
                }
            };
            break;

        case 'glitch':
            transitionConfig = {
                type: TransitionType.Glitch,
                config: {
                    seed: Math.random(),
                    amount: 0.5,
                    duration: 0.8,
                    easing: resolveEasing('Bounce', 'Out')
                }
            };
            break;
    }

    await renderer.setBackground(nextTexture, transitionConfig);

    resetCameraToStatic();
    syncEffects(); // Applied during transition
    isTransitioning = false;
}

function syncEffects() {
    if (!renderer.background || !renderer.background.effects) return;

    const effects = renderer.background.effects;
    const { EffectType } = midori;

    if (settings.effects.bloom) {
        effects.set(EffectType.Bloom, { radius: 1.5, strength: 1.2, threshold: 0.1 });
    } else {
        effects.remove(EffectType.Bloom);
    }

    if (settings.effects.blur) {
        effects.set(EffectType.Blur, { radius: 6 });
    } else {
        effects.remove(EffectType.Blur);
    }

    if (settings.effects.motionBlur) {
        effects.set(EffectType.MotionBlur, { intensity: 2.0, samples: 32 });
    } else {
        effects.remove(EffectType.MotionBlur);
    }

    const rgbType = EffectType.RgbShift || EffectType.RGBShift;
    if (settings.effects.rgbShift) {
        effects.set(rgbType, { amount: 0.015, angle: 45 });
    } else {
        effects.remove(rgbType);
    }

    if (settings.effects.vignette) {
        effects.set(EffectType.Vignette, { offset: 1.0, darkness: 1.5 });
    } else {
        effects.remove(EffectType.Vignette);
    }

    if (settings.effects.vignetteBlur) {
        effects.set(EffectType.Vignette, { offset: 1.0, darkness: 1.5 });
        effects.set(EffectType.VignetteBlur, { size: 2.0, radius: 10.0 });
    } else {
        effects.remove(EffectType.VignetteBlur);
    }
}

function toggleEffect(effectKey) {
    if (!renderer || !renderer.background) return;

    settings.effects[effectKey] = !settings.effects[effectKey];

    const btn = document.getElementById(`btn-${effectKey}`);
    if (btn) btn.classList.toggle('active', settings.effects[effectKey]);

    saveSettingsToLocalStorage();
    syncEffects(); // Applied explicitly on button click
}