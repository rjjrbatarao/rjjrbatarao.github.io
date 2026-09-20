const LOCAL_STORAGE_KEY = 'midori_demo_settings_v4';
const taraBridge = new KioskService();

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

const saved = JSON.parse(taraBridge.getSecureData("orbit-device-settings", JSON.stringify(state)));
console.log("persistent data: ", saved);


const DEFAULT_IMAGE_URLS = [
    "./wallpapers/ml/0.jpeg",
    "./wallpapers/ml/1.jpeg",
    "./wallpapers/ml/2.jpeg",
    "./wallpapers/ml/3.jpeg",
];
// JSON Default Configuration
const DEFAULTS = {
    imageUrls: [...DEFAULT_IMAGE_URLS],
    // camera: {
    //     sway: 0.02,
    //     panRange: 0.15,
    //     zoomRange: 0.30,
    //     panDuration: 8.0,
    //     rotation: 1.5,
    //     wobble: 0.01
    // },
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
let images = []; // Cached preloaded image textures
let imageIndex = 0;

let autoTimer = null;
let isTransitioning = false;
const transitionTypes = ['blend', 'wipe', 'blur', 'slide', 'glitch'];

document.addEventListener("DOMContentLoaded", async () => {
    midori = window.midori;
    const canvas = document.getElementById('canvas');
    renderer = new midori.BackgroundRenderer(canvas);


    loadSettingsFromNativeStorage();

    await loadAllImageTextures();

    if (images.length > 0) {
        await renderer.setBackground(images[0]);
    }

    // applyDemoCameraEffects();

    if (settings.autoTransition.enabled) {
        scheduleNextAutoTransition();
    }

});

// --- DYNAMIC IMAGE MANAGEMENT ---
async function loadAllImageTextures() {
    images = [];
    if (isDeepEqual(saved, state)) {
        for (const url of settings.imageUrls) {
            try {
                const texture = await midori.loadImage(url);
                images.push(texture);
            } catch (err) {
                //console.warn("Failed to load image texture from URL:", url, err);
            }
        }
    } else {
        if (saved.game.images.length > 0) {
            for (const url of saved.game.images) {
                try {
                    const texture = await midori.loadImage(url.src);
                    //console.log(url.name);
                    images.push(texture);
                } catch (err) {
                    //console.warn("Failed to load image texture from URL:", url, err);
                }
            }
        } else {
            for (const url of settings.imageUrls) {
                try {
                    const texture = await midori.loadImage(url);
                    images.push(texture);
                } catch (err) {
                    //console.warn("Failed to load image texture from URL:", url, err);
                }
            }
        }
    }
}



// --- LOCALSTORAGE & DEFAULTS MANAGEMENT ---
function loadSettingsFromNativeStorage() {
    try {
        // IF true then advance settings is not set
        if (isDeepEqual(saved, state)) {
            //console.log("Settings is default: ");
            settings = { ...DEFAULTS }
        } else {
            //console.log("loading transition: ");
            settings = {
                ...DEFAULTS, autoTransition: {
                    enabled: saved.game.auto,
                    random: saved.game.random,
                    interval: saved.game.interval
                }
            }
        }

    } catch (e) {
        console.warn("Unable to load settings from localStorage:", e);
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

// function applyDemoCameraEffects() {
//     const background = renderer.background;
//     if (!background || !background.camera) return;

//     const camera = background.camera;
//     const quadEasing = resolveEasing('Quadratic', 'InOut');
//     const cubicEasing = resolveEasing('Cubic', 'InOut');
//     const elasticEasing = resolveEasing('Elastic', 'Out');

//     const { sway, panRange, zoomRange, panDuration, rotation, wobble } = settings.camera;

//     // 1. DEFAULT: Ambient Swaying
//     if (typeof camera.sway === 'function') {
//         camera.sway(
//             { x: sway, y: sway * 0.7, z: 0, zr: rotation * 0.1 },
//             { duration: 6.0, easing: quadEasing, loop: true }
//         );
//     }

//     // 2. RANDOMIZED PANNING, RANDOMIZED ROTATION & RANDOMIZED ZOOM
//     if ((panRange > 0 || zoomRange > 0) && typeof camera.move === 'function') {
//         function cameraToRandomTarget() {
//             if (!renderer.background || renderer.background.camera !== camera) return;

//             const randomX = 0.5 + (Math.random() * 2 - 1) * panRange;
//             const randomY = 0.5 + (Math.random() * 2 - 1) * panRange;
//             const randomZ = 0.5 + (Math.random() * 2 - 1) * (zoomRange * 0.5);
//             const randomAngle = (Math.random() * 2 - 1) * rotation;

//             camera.move(
//                 { x: randomX, y: randomY, z: randomZ },
//                 { duration: panDuration, easing: cubicEasing, onComplete: cameraToRandomTarget }
//             );

//             if (typeof camera.rotate === 'function') {
//                 camera.rotate(randomAngle, { duration: panDuration, easing: cubicEasing });
//             }
//         }
//         cameraToRandomTarget();
//     } else if (typeof camera.move === 'function') {
//         camera.move({ x: 0.5, y: 0.5, z: 0.5 }, { duration: 1.0, easing: cubicEasing });

//         const randomAngle = (Math.random() * 2 - 1) * rotation;
//         if (typeof camera.rotate === 'function') {
//             camera.rotate(randomAngle, { duration: panDuration, easing: cubicEasing });
//         }
//     }

//     // 3. WOBBLE EFFECT (Multi-Axis Jitter Offset)
//     if (wobble > 0 && typeof camera.offset === 'function') {
//         function wobbleLoop() {
//             if (!renderer.background || renderer.background.camera !== camera) return;

//             const wobbleX = (Math.random() * 2 - 1) * wobble;
//             const wobbleY = (Math.random() * 2 - 1) * wobble;
//             const wobbleZ = (Math.random() * 2 - 1) * (wobble * 0.5);
//             const wobbleRot = (Math.random() * 2 - 1) * (wobble * 2.0);

//             camera.offset(
//                 { x: wobbleX, y: wobbleY, z: wobbleZ, zr: wobbleRot },
//                 { duration: 0.8 + Math.random() * 0.4, easing: elasticEasing, onComplete: wobbleLoop }
//             );
//         }
//         wobbleLoop();
//     } else if (typeof camera.offset === 'function') {
//         camera.offset({ x: 0, y: 0, z: 0, zr: 0 });
//     }
// }


// --- Track the previous transition globally ---
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
                    duration: 1.5,
                    easing: resolveEasing('Cubic', 'InOut')
                }
            };
            break;

        case 'wipe':
            transitionConfig = {
                type: TransitionType.Wipe,
                config: {
                    gradient: 0.5,
                    duration: 1.5,
                    easing: resolveEasing('Cubic', 'Out'),
                    direction: WipeDirection.Right
                }
            };
            break;

        case 'blur':
            transitionConfig = {
                type: TransitionType.Blur,
                config: {
                    intensity: 8,
                    duration: 1.8,
                    easing: resolveEasing('Quadratic', 'InOut')
                }
            };
            break;

        case 'slide':
            transitionConfig = {
                type: TransitionType.Slide,
                config: {
                    slides: 2,
                    intensity: 5,
                    duration: 1.5,
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
                    amount: 0.8,
                    duration: 1.2,
                    easing: resolveEasing('Bounce', 'Out')
                }
            };
            break;
    }

    await renderer.setBackground(nextTexture, transitionConfig);

    //applyDemoCameraEffects();
    syncEffects();
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

    //saveSettingsToLocalStorage();
    syncEffects();
}

function isDeepEqual(obj1, obj2) {
    // If both are the exact same primitive or reference
    if (obj1 === obj2) return true;

    // If either is not an object, or is null, they aren't equal
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    // Get keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Must have the same number of properties
    if (keys1.length !== keys2.length) return false;

    // Recursively verify every key and value
    for (const key of keys1) {
        if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

function convertMilitaryToStandard(militaryTime) {
    // Split the string into hours and minutes
    const [hoursStr, minutesStr] = militaryTime.split(':');
    let hours = parseInt(hoursStr, 10);

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Return formatted string
    return `${hours}:${minutesStr} ${ampm}`;
}