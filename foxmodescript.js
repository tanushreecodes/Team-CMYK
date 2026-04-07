
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupSmoothScroll();
    addHoverEffects();
    logVisit();
});

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addHoverEffects() {
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const number = this.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const number = this.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1)';
            }
        });
    });
}

function logVisit() {
    const visitTime = new Date().toLocaleString();
    console.log('%c🦊 Fox Mode Activated', 'color: #8FA18C; font-size: 18px; font-weight: bold;');
    console.log('%cWelcome to the parent resource center', 'color: #6B6B6B; font-size: 14px;');
    console.log(`Visit time: ${visitTime}`);
    
    trackFoxModeVisit();
}

function trackFoxModeVisit() {
    const visits = localStorage.getItem('foxModeVisits') || 0;
    localStorage.setItem('foxModeVisits', parseInt(visits) + 1);
    
}

function addCitationCopy() {
    const statSources = document.querySelectorAll('.stat-source');
    
    statSources.forEach(source => {
        source.style.cursor = 'pointer';
        source.title = 'Click to copy citation';
        
        source.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Citation copied to clipboard!');
            });
        });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: white;
        padding: 1.25rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        border: 2px solid var(--sage);
        z-index: 10000;
        font-weight: 600;
        color: var(--text-primary);
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
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

document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="http"]');
    if (link && !link.hasAttribute('data-confirmed')) {
        e.preventDefault();
        
        const confirmed = confirm('This link will open in a new tab. Continue?');
        if (confirmed) {
            link.setAttribute('data-confirmed', 'true');
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.click();
        }
    }
});

function calculateReadingTime() {
    const content = document.querySelector('.foxmode-main');
    const text = content.textContent;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    // Add reading time indicator to hero
    const hero = document.querySelector('.hero-content');
    const readingIndicator = document.createElement('p');
    readingIndicator.style.cssText = `
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin-top: 1rem;
        font-style: italic;
    `;
    readingIndicator.textContent = `📖 ${readingTime} minute read`;
    hero.appendChild(readingIndicator);
}

function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--sage), var(--accent-green));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

window.addEventListener('load', () => {
    calculateReadingTime();
    addScrollProgress();
    addCitationCopy();
    
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'b' || e.key === 'B') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            window.location.href = 'profile.html';
        }
    }
    
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

function setupPrintButton() {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i> Print Resources';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 1rem 1.5rem;
        background: var(--sage);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    printBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.background = 'var(--accent-green)';
    });
    
    printBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = 'var(--sage)';
    });
    
    document.body.appendChild(printBtn);
}

setupPrintButton();

console.log('%cFox Mode Tips:', 'color: #8FA18C; font-size: 16px; font-weight: bold;');
console.log('%c• Press "B" to go back to profile', 'color: #6B6B6B; font-size: 12px;');
console.log('%c• Press "T" to scroll to top', 'color: #6B6B6B; font-size: 12px;');
console.log('%c• Click on citations to copy them', 'color: #6B6B6B; font-size: 12px;');