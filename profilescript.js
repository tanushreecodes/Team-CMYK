// Auth0 configuration and client
let auth0Client = null;
let currentUser = null;

const configureClient = async () => {
    try {
        const response = await fetch("./auth_config.json");
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.status}`);
        }
        const config = await response.json();

        auth0Client = await auth0.createAuth0Client({
            domain: config.domain,
            clientId: config.clientId,
            authorizationParams: {
                redirect_uri: window.location.origin + "/frontend/profile.html",
            },
        });
        console.log("Auth0 client configured successfully");
    } catch (error) {
        console.error("Error configuring Auth0 client:", error);
        throw error;
    }
};

const handleRedirectCallback = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
    ) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }

    if (await auth0Client.isAuthenticated()) {
        currentUser = await auth0Client.getUser();
        loadUserData();
    } else {
        // Redirect to login if not authenticated
        window.location.href = "index.html";
    }
};

const logout = async () => {
    try {
        if (auth0Client) {
            await auth0Client.logout({
                logoutParams: {
                    returnTo: window.location.origin + "/frontend/index.html",
                },
            });
        } else {
            // Fallback if Auth0 client is not available
            console.warn("Auth0 client not available, performing simple logout");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error during logout:", error);
        // Fallback to simple redirect
        window.location.href = "index.html";
    }
};

const userData = {
    name: "Sahas",
    fullName: "Sahas sharma",
    grade: "Grade 3",
    avatar: "ss",
    totalWords: 248,
    totalTime: 12.5,
    accuracy: 87,
    level: "🏆 Gold",
    stars: 156,
    streakDays: 0, // Will be calculated dynamically
    todayProgress: 75, // percentage
    wordsRemaining: 15,
};

// Streak tracking system
const streakData = {
    lastPracticeDate: null,
    practiceHistory: [], // Array of date strings in YYYY-MM-DD format
    currentStreak: 0,
    
    // Initialize from localStorage or create new
    init() {
        const savedData = localStorage.getItem('dyslexicjit_streak_data');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.lastPracticeDate = parsed.lastPracticeDate;
            this.practiceHistory = parsed.practiceHistory || [];
            this.currentStreak = parsed.currentStreak || 0;
        } else {
            // Initialize with some sample data for demo purposes
            const today = new Date();
            this.practiceHistory = [];
            
            // Add practice days for the last 6 days (not including today)
            for (let i = 6; i >= 1; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                this.practiceHistory.push(this.formatDate(date));
            }
            
            this.lastPracticeDate = this.formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000)); // Yesterday
            this.calculateStreak();
            this.save();
        }
        
        // Always recalculate streak on init to handle date changes
        this.calculateStreak();
    },
    
    // Save to localStorage
    save() {
        localStorage.setItem('dyslexicjit_streak_data', JSON.stringify({
            lastPracticeDate: this.lastPracticeDate,
            practiceHistory: this.practiceHistory,
            currentStreak: this.currentStreak
        }));
    },
    
    // Format date as YYYY-MM-DD
    formatDate(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    },
    
    // Add a practice session for today
    addPracticeToday() {
        const today = this.formatDate(new Date());
        if (!this.practiceHistory.includes(today)) {
            this.practiceHistory.push(today);
            this.practiceHistory.sort(); // Keep dates sorted
            this.lastPracticeDate = today;
            this.calculateStreak();
            this.save();
        }
    },
    
    // Calculate current streak
    calculateStreak() {
        if (this.practiceHistory.length === 0) {
            this.currentStreak = 0;
            return;
        }
        
        const today = new Date();
        const todayStr = this.formatDate(today);
        const yesterdayStr = this.formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000));
        
        // Sort practice history in ascending order
        const sortedHistory = [...this.practiceHistory].sort();
        
        let streak = 0;
        
        // Check if streak is still alive (practiced today or yesterday)
        const hasToday = sortedHistory.includes(todayStr);
        const hasYesterday = sortedHistory.includes(yesterdayStr);
        
        if (!hasToday && !hasYesterday) {
            // Streak is broken
            this.currentStreak = 0;
            return;
        }
        
        // Start from the most recent practice day and count backwards
        let currentDate = new Date(today);
        
        // If they haven't practiced today, start from yesterday
        if (!hasToday) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // Count consecutive days backwards
        while (true) {
            const currentDateStr = this.formatDate(currentDate);
            if (sortedHistory.includes(currentDateStr)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        this.currentStreak = streak;
    },
    
    // Check if user practiced on a specific date
    hasPracticedOn(date) {
        const dateStr = this.formatDate(date);
        return this.practiceHistory.includes(dateStr);
    },
    
    // Get streak for display
    getStreak() {
        this.calculateStreak();
        return this.currentStreak;
    }
};

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Initialize systems
        settingsData.init();
        streakData.init();
        
        await configureClient();
        await handleRedirectCallback();
        generateCalendar();
        animateStats();
        initializeEventListeners();
        animateProgressBar();
    } catch (error) {
        console.error("Error initializing Auth0:", error);
        window.location.href = "index.html";
    }
});

function loadUserData() {
    // Use Auth0 user data if available, otherwise use default userData
    const displayName = currentUser
        ? currentUser.name || currentUser.nickname || currentUser.email
        : userData.name;
    const fullName = currentUser ? currentUser.name : userData.fullName;
    const avatar = currentUser
        ? currentUser.picture
            ? `<img src="${currentUser.picture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
            : userData.avatar
        : userData.avatar;

    // Load user information
    document.getElementById("userName").textContent = displayName;
    document.getElementById("profileName").textContent = fullName;
    document.getElementById("userAvatar").innerHTML =
        typeof avatar === "string" && avatar.includes("<img")
            ? avatar
            : `<span>${avatar}</span>`;

    // Load stats
    document.getElementById("totalWords").textContent = userData.totalWords;
    document.getElementById("totalTime").textContent = userData.totalTime;
    document.getElementById("accuracy").textContent = userData.accuracy + "%";
    
    // Update streak with dynamic data
    const currentStreak = streakData.getStreak();
    document.getElementById("streakDays").textContent = currentStreak;
    userData.streakDays = currentStreak; // Update userData for other functions

    // Load progress
    const progressPercent = userData.todayProgress + "%";
    document.getElementById("progressPercent").textContent = progressPercent;
    document.getElementById("progressFill").style.width = "0%"; // Start at 0 for animation

    // Update progress text
    const progressText = document.querySelector(".progress-text");
    if (userData.todayProgress >= 100) {
        progressText.textContent = "🎉 Daily goal completed! Great job!";
        progressText.style.color = "var(--accent-coral)";
        progressText.style.fontWeight = "700";
    } else {
        progressText.textContent = `${userData.wordsRemaining} more words to complete today!`;
    }
}

function animateStats() {
    const currentStreak = streakData.getStreak();
    
    const stats = [
        {
            element: document.getElementById("totalWords"),
            target: userData.totalWords,
        },
        {
            element: document.getElementById("totalTime"),
            target: userData.totalTime,
            decimal: true,
        },
        {
            element: document.getElementById("streakDays"),
            target: currentStreak,
        },
    ];

    stats.forEach((stat) => {
        animateCounter(stat.element, stat.target, stat.decimal);
    });
}

function animateCounter(element, target, isDecimal = false) {
    const duration = 1500;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : target;
            clearInterval(timer);
        } else {
            element.textContent = isDecimal
                ? current.toFixed(1)
                : Math.floor(current);
        }
    }, 16);
}

function animateProgressBar() {
    setTimeout(() => {
        const progressFill = document.getElementById("progressFill");
        progressFill.style.width = userData.todayProgress + "%";
    }, 500);
}

function generateCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = ""; // Clear existing content
    
    const today = new Date();
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    
    // Show 4 weeks (28 days) - 3 weeks in the past + current week
    const totalDays = 28;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 21); // Start 3 weeks ago
    
    // Find the start of the week for the start date (Sunday)
    const startOfCalendar = new Date(startDate);
    startOfCalendar.setDate(startDate.getDate() - startDate.getDay());

    // Generate calendar days for 4 weeks
    for (let i = 0; i < totalDays; i++) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";

        const dayLabel = document.createElement("div");
        dayLabel.className = "calendar-day-label";
        dayLabel.textContent = daysOfWeek[i % 7];

        const dayNumber = document.createElement("div");
        dayNumber.className = "calendar-day-number";

        // Calculate date for this day
        const date = new Date(startOfCalendar);
        date.setDate(startOfCalendar.getDate() + i);
        dayNumber.textContent = date.getDate();

        // Add month indicator for first day of month or if different from previous day
        if (i > 0) {
            const prevDate = new Date(startOfCalendar);
            prevDate.setDate(startOfCalendar.getDate() + i - 1);
            if (date.getMonth() !== prevDate.getMonth() || date.getDate() === 1) {
                const monthLabel = document.createElement("div");
                monthLabel.className = "calendar-month-label";
                monthLabel.textContent = date.toLocaleDateString('en-US', { month: 'short' });
                dayElement.appendChild(monthLabel);
            }
        } else if (date.getDate() === 1 || i === 0) {
            const monthLabel = document.createElement("div");
            monthLabel.className = "calendar-month-label";
            monthLabel.textContent = date.toLocaleDateString('en-US', { month: 'short' });
            dayElement.appendChild(monthLabel);
        }

        // Determine status based on real practice data
        const hasPracticed = streakData.hasPracticedOn(date);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        const isFuture = date > today;

        if (isToday) {
            dayElement.classList.add("today");
            // If user has completed today's goal, mark as completed
            if (userData.todayProgress >= 100 || hasPracticed) {
                dayElement.classList.add("completed");
            }
            // Scroll to today on initial load
            setTimeout(() => {
                dayElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest', 
                    inline: 'center' 
                });
            }, 100);
        } else if (isPast) {
            if (hasPracticed) {
                dayElement.classList.add("completed");
            } else {
                dayElement.classList.add("inactive");
            }
        } else {
            // Future days
            dayElement.classList.add("inactive");
        }

        dayElement.appendChild(dayLabel);
        dayElement.appendChild(dayNumber);
        calendarGrid.appendChild(dayElement);
    }
}

function initializeEventListeners() {
    const homeBtn = document.getElementById("homeBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const editProfileBtn = document.getElementById("editProfileBtn");

    homeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    settingsBtn.addEventListener("click", () => {
        showSettingsModal();
    });

    logoutBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to logout?")) {
            try {
                await logout();
            } catch (error) {
                console.error("Error during logout:", error);
                // Force redirect as fallback
                window.location.href = "index.html";
            }
        }
    });

    editProfileBtn.addEventListener("click", () => {
        alert("✏️ Profile editing coming soon!");
    });

    const badges = document.querySelectorAll(".badge");
    badges.forEach((badge) => {
        badge.addEventListener("click", function () {
            const title = this.getAttribute("title");
            showNotification(`🎉 ${title} badge earned!`);
        });
    });

    const logo = document.querySelector(".nav-logo");
    logo.addEventListener("click", () => {
        window.location.href = "foxmode.html";
    });

    // Initialize goals functionality
    initializeGoals();
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border: 2px solid var(--primary-orange);
        z-index: 10000;
        font-weight: 600;
        color: var(--text-primary);
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

const actionButtons = document.querySelectorAll(".action-btn");
actionButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px)";
    });

    btn.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
    });
});

const avatar = document.getElementById("userAvatar");
avatar.addEventListener("click", function () {
    this.style.animation = "none";
    setTimeout(() => {
        this.style.animation = "spin 0.6s ease";
    }, 10);
});

const avatarStyles = document.createElement("style");
avatarStyles.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(avatarStyles);

// Function to complete today's practice
function completeTodaysPractice() {
    // Mark today as completed
    streakData.addPracticeToday();
    userData.todayProgress = 100;
    userData.wordsRemaining = 0;
    
    // Update UI
    document.getElementById("progressPercent").textContent = "100%";
    document.getElementById("progressFill").style.width = "100%";
    
    const progressText = document.querySelector(".progress-text");
    progressText.textContent = "🎉 Daily goal completed! Great job!";
    progressText.style.color = "var(--accent-coral)";
    progressText.style.fontWeight = "700";
    
    // Recalculate and update streak display
    streakData.calculateStreak();
    const newStreak = streakData.getStreak();
    document.getElementById("streakDays").textContent = newStreak;
    userData.streakDays = newStreak;
    
    // Regenerate calendar to show today as completed
    generateCalendar();
    
    // Show celebration notification
    showNotification("🎉 Daily goal completed! Your streak is now " + newStreak + " days!");
    
    // Add fire animation if streak is 7 or more
    if (newStreak >= 7) {
        setTimeout(() => {
            const streakIcon = document.querySelector(".streak-icon");
            if (streakIcon) {
                streakIcon.style.animation = "fire 0.5s ease infinite";
            }
        }, 500);
    }
}

// Debug function to add practice for previous days (for testing)
function addPracticeForDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = streakData.formatDate(date);
    
    if (!streakData.practiceHistory.includes(dateStr)) {
        streakData.practiceHistory.push(dateStr);
        streakData.practiceHistory.sort();
        streakData.calculateStreak(); // Recalculate streak
        streakData.save();
        generateCalendar(); // Refresh calendar
        
        const newStreak = streakData.getStreak();
        document.getElementById("streakDays").textContent = newStreak;
        userData.streakDays = newStreak;
        
        showNotification(`✅ Added practice for ${daysAgo} days ago. Streak: ${newStreak}`);
    } else {
        showNotification(`⚠️ Practice already recorded for ${daysAgo} days ago`);
    }
}

// Check if streak should have fire animation
if (streakData.getStreak() >= 7) {
    setTimeout(() => {
        const streakIcon = document.querySelector(".streak-icon");
        if (streakIcon) {
            streakIcon.style.animation = "fire 0.5s ease infinite";
        }
    }, 1000);
}

const fireAnimation = document.createElement("style");
fireAnimation.textContent = `
    @keyframes fire {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(fireAnimation);

// ==================== CALENDAR DAY CLICK ====================
document.addEventListener("click", function (e) {
    if (
        e.target.closest(".calendar-day") &&
        !e.target.closest(".calendar-day.empty")
    ) {
        const day = e.target.closest(".calendar-day");
        const dayNumber = day.querySelector(".calendar-day-number").textContent;

        if (day.classList.contains("completed")) {
            if (day.classList.contains("today")) {
                showNotification(`🎉 Today (${dayNumber}) - Practice completed!`);
            } else {
                showNotification(`✅ Day ${dayNumber} - Practice completed!`);
            }
        } else if (day.classList.contains("today")) {
            const remaining = userData.todayProgress < 100 ? userData.wordsRemaining : 0;
            if (remaining > 0) {
                showNotification(
                    `📅 Today (${dayNumber}): ${userData.todayProgress}% complete! ${remaining} words remaining.`
                );
            } else {
                showNotification(`🎯 Today (${dayNumber}): Ready to practice!`);
            }
        } else if (day.classList.contains("inactive")) {
            const today = new Date();
            const currentDay = today.getDay();
            const dayIndex = Array.from(day.parentNode.children).indexOf(day);
            
            if (dayIndex < currentDay) {
                showNotification(`📅 Day ${dayNumber} - No practice recorded`);
            } else {
                showNotification(`📆 Day ${dayNumber} - Future date`);
            }
        } else {
            showNotification(
                `📆 Day ${dayNumber} - Keep building your streak!`
            );
        }
    }
});

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

const motivationalMessages = [
    "🌟 You're doing great! Keep practicing!",
    "🚀 Every word you learn is progress!",
    "💪 Your hard work is paying off!",
    "🎯 Focus and patience - you've got this!",
    "⭐ Reading champion in the making!",
];

setTimeout(() => {
    const randomMessage =
        motivationalMessages[
            Math.floor(Math.random() * motivationalMessages.length)
        ];
    showNotification(randomMessage);
}, 2000);

document.addEventListener("keydown", function (e) {
    // Press 'P' for practice
    if (e.key === "p" || e.key === "P") {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            window.location.href = "practice.html";
        }
    }

    // Press 'S' for struggle words
    if (e.key === "s" || e.key === "S") {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            window.location.href = "struggle.html";
        }
    }
    
    // Press 'C' to complete today's practice (for testing)
    if (e.key === "c" || e.key === "C") {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            if (userData.todayProgress < 100) {
                completeTodaysPractice();
            } else {
                showNotification("📅 Today's practice already completed!");
            }
        }
    }
    
    // Press 'R' to reset streak data (for testing)
    if (e.key === "r" || e.key === "R") {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && e.shiftKey) {
            if (confirm("Are you sure you want to reset all streak data? This cannot be undone.")) {
                localStorage.removeItem('dyslexicjit_streak_data');
                streakData.init();
                location.reload();
            }
        }
    }
});

window.addEventListener("load", () => {
    const cards = document.querySelectorAll(
        ".welcome-card, .profile-card, .streak-card"
    );
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {
            card.style.transition = "all 0.6s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 150);
    });
});

// Debug functions available in console
window.debugStreak = {
    complete: completeTodaysPractice,
    addPractice: addPracticeForDate,
    reset: () => {
        localStorage.removeItem('dyslexicjit_streak_data');
        location.reload();
    },
    show: () => {
        console.log('Current streak:', streakData.getStreak());
        console.log('Practice history:', streakData.practiceHistory);
        console.log('Last practice:', streakData.lastPracticeDate);
    }
};

// Settings System
const settingsData = {
    settings: {
        theme: 'light',
        notifications: true,
        soundEffects: true,
        dailyGoal: 20,
        difficulty: 'medium',
        fontSize: 'medium',
        autoSave: true,
        practiceReminder: true,
        streakNotifications: true,
        celebrationAnimations: true
    },
    
    init() {
        const savedSettings = localStorage.getItem('dyslexicjit_settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        this.applySettings();
    },
    
    save() {
        localStorage.setItem('dyslexicjit_settings', JSON.stringify(this.settings));
        this.applySettings();
    },
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.save();
    },
    
    resetToDefaults() {
        this.settings = {
            theme: 'light',
            notifications: true,
            soundEffects: true,
            dailyGoal: 20,
            difficulty: 'medium',
            fontSize: 'medium',
            autoSave: true,
            practiceReminder: true,
            streakNotifications: true,
            celebrationAnimations: true
        };
        this.save();
    },
    
    applySettings() {
        // Apply theme
        document.body.setAttribute('data-theme', this.settings.theme);
        
        // Apply font size
        document.body.setAttribute('data-font-size', this.settings.fontSize);
        
        // Update progress goal if needed
        if (userData.todayProgress !== undefined) {
            const progressText = document.querySelector('.progress-text');
            if (progressText && this.settings.dailyGoal) {
                const remaining = Math.max(0, this.settings.dailyGoal - (userData.totalWords || 0));
                if (remaining > 0) {
                    progressText.textContent = `${remaining} more words to complete today's goal!`;
                } else {
                    progressText.textContent = "🎉 Daily goal completed! Great job!";
                }
            }
        }
    }
};

function showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <div class="settings-modal-content">
            <div class="settings-modal-header">
                <h3><i class="fas fa-cog"></i> Settings</h3>
                <button class="close-modal" onclick="this.closest('.settings-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="settings-modal-body">
                <div class="settings-tabs">
                    <button class="settings-tab active" data-tab="general">General</button>
                    <button class="settings-tab" data-tab="practice">Practice</button>
                    <button class="settings-tab" data-tab="notifications">Notifications</button>
                    <button class="settings-tab" data-tab="accessibility">Accessibility</button>
                </div>
                
                <div class="settings-content">
                    <div class="settings-panel active" data-panel="general">
                        <div class="setting-group">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Theme</label>
                                    <span class="setting-description">Choose your preferred color theme</span>
                                </div>
                                <select class="setting-control" data-setting="theme">
                                    <option value="light" ${settingsData.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                                    <option value="dark" ${settingsData.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                    <option value="auto" ${settingsData.settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
                                </select>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Sound Effects</label>
                                    <span class="setting-description">Play sounds for interactions and achievements</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="soundEffects" ${settingsData.settings.soundEffects ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Auto Save Progress</label>
                                    <span class="setting-description">Automatically save your reading progress</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="autoSave" ${settingsData.settings.autoSave ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-panel" data-panel="practice">
                        <div class="setting-group">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Daily Words Goal</label>
                                    <span class="setting-description">Number of words to practice each day</span>
                                </div>
                                <input type="number" class="setting-control" data-setting="dailyGoal" 
                                       value="${settingsData.settings.dailyGoal}" min="5" max="100" step="5">
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Reading Difficulty</label>
                                    <span class="setting-description">Adjust the complexity of reading materials</span>
                                </div>
                                <select class="setting-control" data-setting="difficulty">
                                    <option value="easy" ${settingsData.settings.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
                                    <option value="medium" ${settingsData.settings.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
                                    <option value="hard" ${settingsData.settings.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
                                </select>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Practice Reminders</label>
                                    <span class="setting-description">Get reminded when it's time to practice</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="practiceReminder" ${settingsData.settings.practiceReminder ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-panel" data-panel="notifications">
                        <div class="setting-group">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Enable Notifications</label>
                                    <span class="setting-description">Receive notifications for achievements and reminders</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="notifications" ${settingsData.settings.notifications ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Streak Notifications</label>
                                    <span class="setting-description">Get notified about your reading streaks</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="streakNotifications" ${settingsData.settings.streakNotifications ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Celebration Animations</label>
                                    <span class="setting-description">Show animations when completing goals</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="celebrationAnimations" ${settingsData.settings.celebrationAnimations ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-panel" data-panel="accessibility">
                        <div class="setting-group">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>Font Size</label>
                                    <span class="setting-description">Adjust text size for better readability</span>
                                </div>
                                <select class="setting-control" data-setting="fontSize">
                                    <option value="small" ${settingsData.settings.fontSize === 'small' ? 'selected' : ''}>Small</option>
                                    <option value="medium" ${settingsData.settings.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                                    <option value="large" ${settingsData.settings.fontSize === 'large' ? 'selected' : ''}>Large</option>
                                    <option value="extra-large" ${settingsData.settings.fontSize === 'extra-large' ? 'selected' : ''}>Extra Large</option>
                                </select>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>High Contrast Mode</label>
                                    <span class="setting-description">Improve visibility with higher contrast</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="highContrast" ${settingsData.settings.highContrast ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="settings-modal-actions">
                <button class="btn-secondary" onclick="resetSettings()">Reset to Defaults</button>
                <button class="btn-primary" onclick="this.closest('.settings-modal').remove()">Done</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupSettingsEventListeners();
}

function setupSettingsEventListeners() {
    // Tab switching
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active panel
            document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
            document.querySelector(`[data-panel="${tabName}"]`).classList.add('active');
        });
    });
    
    // Setting controls
    document.querySelectorAll('[data-setting]').forEach(control => {
        const settingName = control.dataset.setting;
        
        control.addEventListener('change', () => {
            let value;
            if (control.type === 'checkbox') {
                value = control.checked;
            } else if (control.type === 'number') {
                value = parseInt(control.value);
            } else {
                value = control.value;
            }
            
            settingsData.updateSetting(settingName, value);
            showNotification(`✅ ${settingName.charAt(0).toUpperCase() + settingName.slice(1)} updated!`);
        });
    });
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to their default values?')) {
        settingsData.resetToDefaults();
        document.querySelector('.settings-modal').remove();
        showNotification('🔄 Settings reset to defaults!');
    }
}

// Weekly Goals System
const goalsData = {
    goals: [],
    
    init() {
        const savedGoals = localStorage.getItem('dyslexicjit_goals');
        if (savedGoals) {
            this.goals = JSON.parse(savedGoals);
        } else {
            // Initialize with default goals
            this.goals = [
                {
                    id: 1,
                    title: "Read 50 words",
                    description: "Practice reading 50 words this week",
                    target: 50,
                    current: 50,
                    type: "words",
                    completed: true,
                    createdAt: Date.now()
                },
                {
                    id: 2,
                    title: "Practice 5 days",
                    description: "Complete reading practice for 5 days",
                    target: 5,
                    current: 3,
                    type: "days",
                    completed: false,
                    createdAt: Date.now()
                },
                {
                    id: 3,
                    title: "Master 10 hard words",
                    description: "Successfully read 10 challenging words",
                    target: 10,
                    current: 2,
                    type: "words",
                    completed: false,
                    createdAt: Date.now()
                }
            ];
            this.save();
        }
    },
    
    save() {
        localStorage.setItem('dyslexicjit_goals', JSON.stringify(this.goals));
    },
    
    addGoal(title, target, type = 'words') {
        const newGoal = {
            id: Date.now(),
            title: title,
            description: `Complete ${target} ${type} this week`,
            target: target,
            current: 0,
            type: type,
            completed: false,
            createdAt: Date.now()
        };
        this.goals.push(newGoal);
        this.save();
        return newGoal;
    },
    
    updateProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal && !goal.completed) {
            goal.current = Math.min(progress, goal.target);
            if (goal.current >= goal.target) {
                goal.completed = true;
                showNotification(`🎉 Goal completed: ${goal.title}!`);
            }
            this.save();
            return goal;
        }
        return null;
    },
    
    deleteGoal(goalId) {
        this.goals = this.goals.filter(g => g.id !== goalId);
        this.save();
    },
    
    getProgress(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        return goal ? (goal.current / goal.target) * 100 : 0;
    }
};

function initializeGoals() {
    goalsData.init();
    renderGoals();
    setupGoalEventListeners();
}

function renderGoals() {
    const goalsList = document.querySelector('.goals-list');
    if (!goalsList) return;
    
    goalsList.innerHTML = '';
    
    goalsData.goals.forEach(goal => {
        const goalElement = createGoalElement(goal);
        goalsList.appendChild(goalElement);
    });
}

function createGoalElement(goal) {
    const progressPercent = Math.round((goal.current / goal.target) * 100);
    const isCompleted = goal.completed;
    const isActive = !isCompleted && goal.current > 0;
    
    const goalDiv = document.createElement('div');
    goalDiv.className = `goal-item ${isCompleted ? 'completed' : (isActive ? 'active' : '')}`;
    goalDiv.dataset.goalId = goal.id;
    
    let checkContent = '';
    if (isCompleted) {
        checkContent = '<i class="fas fa-check"></i>';
    } else {
        checkContent = `
            <div class="goal-progress-ring">
                <div class="goal-progress-fill" style="width: ${progressPercent}%"></div>
            </div>
        `;
    }
    
    goalDiv.innerHTML = `
        <div class="goal-check">
            ${checkContent}
        </div>
        <div class="goal-content">
            <div class="goal-title">${goal.title}</div>
            <div class="goal-progress">${goal.current}/${goal.target} ${isCompleted ? 'completed' : 'done'}</div>
        </div>
        <button class="goal-action-btn" data-action="${isCompleted ? 'reset' : 'increment'}" title="${isCompleted ? 'Reset goal' : 'Add progress'}">
            <i class="fas fa-${isCompleted ? 'redo' : 'plus'}"></i>
        </button>
    `;
    
    return goalDiv;
}

function setupGoalEventListeners() {
    // Add new goal button
    const addGoalBtn = document.querySelector('.goals-action-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', showAddGoalModal);
    }
    
    // Goal action buttons (increment/reset)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.goal-action-btn')) {
            const btn = e.target.closest('.goal-action-btn');
            const goalItem = btn.closest('.goal-item');
            const goalId = parseInt(goalItem.dataset.goalId);
            const action = btn.dataset.action;
            
            if (action === 'increment') {
                incrementGoalProgress(goalId);
            } else if (action === 'reset') {
                resetGoal(goalId);
            }
        }
    });
    
    // Goal settings button
    const settingsBtn = document.querySelector('.goals-settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showGoalsSettings);
    }
}

function incrementGoalProgress(goalId) {
    const goal = goalsData.goals.find(g => g.id === goalId);
    if (goal && !goal.completed) {
        const newProgress = goal.current + 1;
        goalsData.updateProgress(goalId, newProgress);
        renderGoals();
    }
}

function resetGoal(goalId) {
    const goal = goalsData.goals.find(g => g.id === goalId);
    if (goal) {
        goal.current = 0;
        goal.completed = false;
        goalsData.save();
        renderGoals();
        showNotification(`🔄 Goal "${goal.title}" has been reset!`);
    }
}

function showAddGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'goal-modal';
    modal.innerHTML = `
        <div class="goal-modal-content">
            <div class="goal-modal-header">
                <h3>Add New Goal</h3>
                <button class="close-modal" onclick="this.closest('.goal-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="goal-modal-body">
                <div class="form-group">
                    <label for="goalTitle">Goal Title:</label>
                    <input type="text" id="goalTitle" placeholder="e.g., Read 100 words" maxlength="50">
                </div>
                <div class="form-group">
                    <label for="goalTarget">Target:</label>
                    <input type="number" id="goalTarget" placeholder="e.g., 100" min="1" max="1000">
                </div>
                <div class="form-group">
                    <label for="goalType">Type:</label>
                    <select id="goalType">
                        <option value="words">Words</option>
                        <option value="days">Days</option>
                        <option value="minutes">Minutes</option>
                        <option value="stories">Stories</option>
                    </select>
                </div>
            </div>
            <div class="goal-modal-actions">
                <button class="btn-secondary" onclick="this.closest('.goal-modal').remove()">Cancel</button>
                <button class="btn-primary" onclick="createNewGoal()">Add Goal</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('goalTitle').focus();
}

function createNewGoal() {
    const title = document.getElementById('goalTitle').value.trim();
    const target = parseInt(document.getElementById('goalTarget').value);
    const type = document.getElementById('goalType').value;
    
    if (!title || !target || target < 1) {
        alert('Please fill in all fields with valid values.');
        return;
    }
    
    goalsData.addGoal(title, target, type);
    renderGoals();
    document.querySelector('.goal-modal').remove();
    showNotification(`✨ New goal "${title}" added!`);
}

function showGoalsSettings() {
    const modal = document.createElement('div');
    modal.className = 'goal-modal';
    modal.innerHTML = `
        <div class="goal-modal-content">
            <div class="goal-modal-header">
                <h3>Goals Settings</h3>
                <button class="close-modal" onclick="this.closest('.goal-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="goal-modal-body">
                <div class="goals-settings-list">
                    ${goalsData.goals.map(goal => `
                        <div class="goal-setting-item">
                            <div class="goal-info">
                                <strong>${goal.title}</strong>
                                <span class="goal-meta">${goal.current}/${goal.target} ${goal.type}</span>
                            </div>
                            <button class="delete-goal-btn" onclick="deleteGoal(${goal.id})" title="Delete goal">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="goal-modal-actions">
                <button class="btn-primary" onclick="this.closest('.goal-modal').remove()">Done</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function deleteGoal(goalId) {
    const goal = goalsData.goals.find(g => g.id === goalId);
    if (goal && confirm(`Are you sure you want to delete "${goal.title}"?`)) {
        goalsData.deleteGoal(goalId);
        renderGoals();
        document.querySelector('.goal-modal').remove();
        showNotification(`🗑️ Goal "${goal.title}" deleted!`);
    }
}

// Add CSS for goal modals
const goalModalStyles = document.createElement('style');
goalModalStyles.textContent = `
.goal-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.goal-modal-content {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.goal-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--light-orange);
}

.goal-modal-header h3 {
    color: var(--primary-orange);
    margin: 0;
}

.close-modal {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-modal:hover {
    background: var(--light-orange);
    color: var(--primary-orange);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--light-orange);
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--primary-orange);
}

.goal-modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid var(--light-orange);
}

.btn-primary,
.btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn-primary {
    background: var(--primary-orange);
    color: white;
}

.btn-primary:hover {
    background: var(--dark-orange);
}

.btn-secondary {
    background: var(--light-orange);
    color: var(--text-primary);
}

.btn-secondary:hover {
    background: var(--secondary-orange);
}

.goal-action-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.goal-action-btn:hover {
    background: var(--light-orange);
    color: var(--primary-orange);
}

.goal-item.completed .goal-action-btn {
    color: rgba(255, 255, 255, 0.7);
}

.goal-item.completed .goal-action-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.goals-settings-list {
    max-height: 300px;
    overflow-y: auto;
}

.goal-setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 10px;
    background: var(--light-orange);
    margin-bottom: 0.5rem;
}

.goal-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.goal-meta {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.delete-goal-btn {
    background: var(--accent-coral);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delete-goal-btn:hover {
    background: var(--dark-coral);
    transform: scale(1.1);
}
`;
document.head.appendChild(goalModalStyles);

    console.log(
        "%c Welcome to DyslexicJit!",
        "color: #FF6B35; font-size: 24px; font-weight: bold;"
    );
console.log(
    "%cKeep practicing and you'll become a reading champion! 📚",
    "color: #5A5A5A; font-size: 14px;"
);
console.log(
    '%cKeyboard shortcuts: Press "C" to Complete Today\'s Practice, "Shift+R" to Reset Streak Data',
    "color: #FF8C42; font-size: 12px;"
);
console.log(
    '%cDebug commands: debugStreak.complete(), debugStreak.reset(), debugStreak.show()',
    "color: #00A86B; font-size: 12px;"
);
