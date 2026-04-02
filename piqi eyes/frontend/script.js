function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

const logo = document.querySelector(".nav-logo");
if (logo) {
    logo.addEventListener("click", () => {
        logo.style.opacity = "0.7";
        setTimeout(() => {
            logo.style.opacity = "1";
        }, 200);
    });
}

const demoBtn = document.querySelector(".btn-secondary");
if (demoBtn) {
    demoBtn.addEventListener("click", () => {
        alert(
            "📺 Demo coming soon! A calm, focused reading experience awaits."
        );
    });
}

const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const wordsCount = document.getElementById("wordsCount");
            const kidsCount = document.getElementById("kidsCount");
            const starsCount = document.getElementById("starsCount");

            if (wordsCount && kidsCount && starsCount) {
                animateCounter(wordsCount, 1234, 2000);
                animateCounter(kidsCount, 567, 2000);
                animateCounter(starsCount, 8901, 2000);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector(".stats-preview");
if (statsSection) {
    statsObserver.observe(statsSection);
}

function addScrollEffects() {
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(255, 255, 255, 0.98)";
            navbar.style.boxShadow = "var(--shadow)";
        } else {
            navbar.style.background = "rgba(255, 255, 255, 0.95)";
            navbar.style.boxShadow = "none";
        }
    });
}
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        ".feature-card, .floating-card, .stat-card"
    );
    animateElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});
const greetings = [
    "Welcome to your focused reading space",
    "Ready to practice at your own pace? 📖",
    "A calm place to build your reading skills ✨",
    "Your reading journey starts here 📚",
];

console.log(greetings[Math.floor(Math.random() * greetings.length)]);
window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

// Auth0 configuration and initialization
let auth0Client = null;

const configureClient = async () => {
    const response = await fetch("./auth_config.json");
    const config = await response.json();

    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin + "/frontend/profile.html",
        },
    });
};

const login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin + "/frontend/profile.html",
        },
    });
};

document.addEventListener("DOMContentLoaded", function () {
    addScrollEffects();
    animateOnScroll();

    // Initialize Auth0
    configureClient();

    const loginBtn = document.getElementById("loginBtn");
    const startReadingBtn = document.getElementById("startReadingBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }

    if (startReadingBtn) {
        startReadingBtn.addEventListener("click", login);
    }

    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            const icon = this.querySelector(".feature-icon");
            if (icon) {
                icon.style.transform = "scale(1.1)";
                icon.style.transition = "transform 0.3s ease";
            }
        });

        card.addEventListener("mouseleave", function () {
            const icon = this.querySelector(".feature-icon");
            if (icon) {
                icon.style.transform = "scale(1)";
            }
        });
    });

    // Eye tracking is now only initialized in practice.html
    // initializeEyeTracking(); // REMOVED - only starts during practice session
});

// WebGazer Eye Tracking Implementation
let isCalibrated = false;
let gazeData = [];
let calibrationStarted = false;

function initializeEyeTracking() {
    console.log("🦊 Initializing eye tracking...");

    // Initialize webgazer with proper settings
    webgazer
        .setRegression("ridge") // Use ridge regression
        .setTracker("TFFacemesh") // Use TensorFlow Facemesh for better accuracy
        .setGazeListener(function (data, elapsedTime) {
            if (data == null) {
                return;
            }

            // Only process gaze data after calibration
            if (!isCalibrated) {
                return;
            }

            const x = data.x;
            const y = data.y;

            // Store recent gaze data for smoothing
            gazeData.push({ x, y, time: Date.now() });

            // Keep only last 10 points
            if (gazeData.length > 10) {
                gazeData.shift();
            }

            // Calculate smoothed position (average of recent points)
            const smoothedX =
                gazeData.reduce((sum, d) => sum + d.x, 0) / gazeData.length;
            const smoothedY =
                gazeData.reduce((sum, d) => sum + d.y, 0) / gazeData.length;

            // Find the element at the gaze position
            const element = document.elementFromPoint(smoothedX, smoothedY);

            if (element) {
                // Get the text content of the element being looked at
                const textContent = element.textContent.trim();

                // Only log if there's actual text content and it's not too long
                if (
                    textContent &&
                    textContent.length > 0 &&
                    textContent.length < 100
                ) {
                    // Split into words and find the closest word to the gaze point
                    const words = extractWordsFromElement(
                        element,
                        smoothedX,
                        smoothedY
                    );

                    if (words && words.length > 0) {
                        console.log("👁️ Looking at word:", words);
                    }
                }
            }
        })
        .saveDataAcrossSessions(true)
        .begin();

    // Configure webgazer settings
    webgazer
        .showVideoPreview(true) // Show video preview for calibration
        .showPredictionPoints(true) // Show where the user is looking
        .applyKalmanFilter(true); // Smoothing filter for better accuracy

    // Wait for video to initialize, then show calibration
    setTimeout(() => {
        if (!calibrationStarted) {
            showCalibrationScreen();
            calibrationStarted = true;
        }
    }, 2000);
}

function showCalibrationScreen() {
    console.log("📋 Showing calibration screen...");

    // Create calibration overlay
    const calibrationDiv = document.createElement("div");
    calibrationDiv.id = "calibrationScreen";
    calibrationDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0, 0, 0, 0.9); z-index: 10000; color: white;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        text-align: center; max-width: 600px; padding: 20px;">
                <h2 style="font-size: 2em; margin-bottom: 20px;">🎯 Eye Tracking Calibration</h2>
                <p style="font-size: 1.2em; margin-bottom: 15px;">
                    Click on each dot that appears and STARE at it for 2 seconds.<br>
                    Keep your head still and only move your eyes.
                </p>
                <p style="font-size: 1em; margin-bottom: 30px; color: #aaa;">
                    Make sure your face is visible in the video preview in the corner.
                </p>
                <div id="calibrationProgress" style="font-size: 1.5em; margin-bottom: 20px;">
                    Point <span id="currentPoint">0</span> of 9
                </div>
                <button id="startCalibration" style="padding: 15px 30px; font-size: 1.2em; 
                        background: #4CAF50; color: white; border: none; border-radius: 5px; 
                        cursor: pointer;">
                    Start Calibration
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(calibrationDiv);

    document
        .getElementById("startCalibration")
        .addEventListener("click", startCalibration);
}

function startCalibration() {
    const calibrationScreen = document.getElementById("calibrationScreen");
    const startButton = document.getElementById("startCalibration");
    startButton.style.display = "none";

    // Define 9 calibration points (3x3 grid)
    const points = [
        { x: 10, y: 10 }, // Top-left
        { x: 50, y: 10 }, // Top-center
        { x: 90, y: 10 }, // Top-right
        { x: 10, y: 50 }, // Middle-left
        { x: 50, y: 50 }, // Center
        { x: 90, y: 50 }, // Middle-right
        { x: 10, y: 90 }, // Bottom-left
        { x: 50, y: 90 }, // Bottom-center
        { x: 90, y: 90 }, // Bottom-right
    ];

    let currentPointIndex = 0;

    function showNextPoint() {
        if (currentPointIndex >= points.length) {
            finishCalibration();
            return;
        }

        // Update progress
        document.getElementById("currentPoint").textContent =
            currentPointIndex + 1;

        const point = points[currentPointIndex];

        // Create calibration dot
        const dot = document.createElement("div");
        dot.className = "calibration-dot";
        dot.style.cssText = `
            position: fixed;
            left: ${point.x}%;
            top: ${point.y}%;
            width: 30px;
            height: 30px;
            background: red;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            animation: pulse 1s infinite;
        `;

        calibrationScreen.appendChild(dot);

        // Click handler
        dot.addEventListener("click", function () {
            // Change color to indicate recording
            this.style.background = "yellow";

            // Record gaze data for this point
            const startTime = Date.now();
            const recordDuration = 2000; // 2 seconds

            const recordInterval = setInterval(() => {
                const rect = dot.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Manually add calibration point to webgazer
                webgazer.recordScreenPosition(centerX, centerY);

                if (Date.now() - startTime >= recordDuration) {
                    clearInterval(recordInterval);
                    dot.style.background = "green";

                    setTimeout(() => {
                        dot.remove();
                        currentPointIndex++;
                        showNextPoint();
                    }, 300);
                }
            }, 100);
        });
    }

    showNextPoint();
}

function finishCalibration() {
    console.log("✅ Calibration complete!");
    isCalibrated = true;

    const calibrationScreen = document.getElementById("calibrationScreen");
    calibrationScreen.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0, 0, 0, 0.9); z-index: 10000; color: white; 
                    display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <h2 style="font-size: 2.5em; margin-bottom: 20px;">✅ Calibration Complete!</h2>
                <p style="font-size: 1.3em; margin-bottom: 30px;">
                    Eye tracking is now active.<br>
                    Check the console (F12) to see which words you're looking at.
                </p>
                <button id="closeCalibration" style="padding: 15px 30px; font-size: 1.2em; 
                        background: #4CAF50; color: white; border: none; border-radius: 5px; 
                        cursor: pointer; margin-bottom: 20px;">
                    Start Reading
                </button>
                <br>
                <button id="toggleVideoBtn" style="padding: 10px 20px; font-size: 1em; 
                        background: #2196F3; color: white; border: none; border-radius: 5px; 
                        cursor: pointer;">
                    Hide Video Preview
                </button>
            </div>
        </div>
    `;

    document
        .getElementById("closeCalibration")
        .addEventListener("click", () => {
            calibrationScreen.remove();

            // Add floating toggle button for video preview
            addVideoToggleButton();

            console.log(
                "👁️ Eye tracking active. Looking at words will be logged to console."
            );
        });

    document.getElementById("toggleVideoBtn").addEventListener("click", () => {
        const currentlyShowing = webgazer.params.showVideo;
        webgazer.showVideoPreview(!currentlyShowing);
        document.getElementById("toggleVideoBtn").textContent = currentlyShowing
            ? "Show Video Preview"
            : "Hide Video Preview";
    });
}

// Add a floating button to toggle video preview
function addVideoToggleButton() {
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "floatingVideoToggle";
    toggleBtn.innerHTML = `
        <span id="toggleBtnText">👁️ Hide Video</span>
    `;
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 20px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;

    toggleBtn.addEventListener("mouseenter", () => {
        toggleBtn.style.transform = "scale(1.05)";
        toggleBtn.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
    });

    toggleBtn.addEventListener("mouseleave", () => {
        toggleBtn.style.transform = "scale(1)";
        toggleBtn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    });

    let videoVisible = true;
    toggleBtn.addEventListener("click", () => {
        videoVisible = !videoVisible;
        webgazer.showVideoPreview(videoVisible);
        document.getElementById("toggleBtnText").textContent = videoVisible
            ? "👁️ Hide Video"
            : "👁️ Show Video";

        console.log(
            videoVisible ? "📹 Video preview shown" : "📹 Video preview hidden"
        );
    });

    document.body.appendChild(toggleBtn);
}

// Add CSS animation for calibration dots
const style = document.createElement("style");
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
    }
`;
document.head.appendChild(style);

// Extract words from an element based on gaze position
function extractWordsFromElement(element, x, y) {
    const text = element.textContent.trim();

    // If it's a short text node (likely a single word or phrase), return it
    if (text.split(/\s+/).length <= 5) {
        return text;
    }

    // For longer text, try to find the specific word being looked at
    // This is a simplified approach - could be enhanced with more precise text positioning
    const rect = element.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;

    // Get words from the element
    const words = text.split(/\s+/).filter((word) => word.length > 0);

    // Calculate approximate word position (simplified)
    // In a production app, you'd want to use Range and getBoundingClientRect for each word
    const estimatedWordIndex = Math.floor(
        (relativeX / rect.width) * words.length
    );
    const wordIndex = Math.max(
        0,
        Math.min(estimatedWordIndex, words.length - 1)
    );

    return words[wordIndex] || text;
}

// Function to pause/resume eye tracking
function toggleEyeTracking(pause = true) {
    if (pause) {
        webgazer.pause();
        console.log("⏸️ Eye tracking paused");
    } else {
        webgazer.resume();
        console.log("▶️ Eye tracking resumed");
    }
}

// Function to hide/show video preview
function toggleVideoPreview(show = true) {
    webgazer.showVideoPreview(show);
}

// Function to hide/show prediction points
function togglePredictionPoints(show = true) {
    webgazer.showPredictionPoints(show);
}
