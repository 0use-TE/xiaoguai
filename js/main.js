/**
 * 小乖的网站 - 主脚本
 */

// Theme configurations
const themes = {
    pink: { name: '粉色', icon: '🌸' },
    mint: { name: '薄荷', icon: '🌿' },
    lavender: { name: '薰衣草', icon: '🪻' },
    cream: { name: '奶油', icon: '🌻' },
    mocha: { name: '摩卡', icon: '🧸' }
};

// Pet reactions
const petReactions = [
    '小乖开心地拱起小身子 💕',
    '小乖发出呼噜呼噜的声音 ~',
    '小乖用小鼻子碰碰你 🤎',
    '小乖舒服地眯起眼睛 ✨',
    '小乖扭扭小屁股 😸',
    '小乖舔舔你的手指头 👅',
    '小乖在你怀里打滚 ~',
    '小乖露出甜甜的笑容 😊'
];

// Click effects
const clickEmojis = ['💗', '💖', '💕', '💓', '⭐', '✨', '🦋', '🎀', '🌸'];

document.addEventListener('DOMContentLoaded', function() {
    // ===== Loading Animation =====
    setTimeout(function() {
        document.querySelector('.loading').classList.add('hidden');
    }, 500);

    // ===== Initialize Theme System =====
    initThemeSystem();

    // ===== Scroll Animations =====
    initScrollAnimations();

    // ===== Stats Counter Animation =====
    initStatsCounter();

    // ===== Lightbox =====
    initLightbox();

    // ===== Gallery Hover Effects =====
    initGalleryEffects();

    // ===== Pet Button =====
    initPetButton();

    // ===== Click Effects =====
    initClickEffects();

    // ===== Cookie Consent =====
    initCookieConsent();
});

/**
 * 主题系统初始化
 */
function initThemeSystem() {
    const savedTheme = localStorage.getItem('xiaoguai-theme') || 'pink';
    document.body.setAttribute('data-theme', savedTheme);

    // Create theme switcher UI
    createThemeSwitcher(savedTheme);

    // Update current theme indicator
    updateThemeIndicator(savedTheme);
}

function createThemeSwitcher(currentTheme) {
    // Remove existing switcher if any
    const existingSwitcher = document.querySelector('.theme-switcher');
    if (existingSwitcher) existingSwitcher.remove();

    // Create new switcher
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';

    Object.keys(themes).forEach(themeKey => {
        const btn = document.createElement('button');
        btn.className = `theme-btn ${themeKey === currentTheme ? 'active' : ''}`;
        btn.setAttribute('data-theme', themeKey);
        btn.setAttribute('title', themes[themeKey].name);
        btn.addEventListener('click', () => switchTheme(themeKey));
        switcher.appendChild(btn);
    });

    document.body.appendChild(switcher);
}

function switchTheme(themeName) {
    if (!themes[themeName]) return;

    // Save to localStorage
    localStorage.setItem('xiaoguai-theme', themeName);

    // Apply theme
    document.body.setAttribute('data-theme', themeName);

    // Update active state
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        }
    });

    // Update indicator
    updateThemeIndicator(themeName);

    // Create celebration effect
    createThemeSwitchEffect();
}

function updateThemeIndicator(themeName) {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.current-theme');
    if (existingIndicator) existingIndicator.remove();

    const indicator = document.createElement('div');
    indicator.className = 'current-theme';
    indicator.innerHTML = `${themes[themeName].icon} ${themes[themeName].name}`;
    document.body.appendChild(indicator);

    // Animate indicator
    setTimeout(() => {
        indicator.style.transform = 'scale(1.1)';
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
        }, 150);
    }, 50);

    // Remove after 2 seconds
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }, 2000);
}

function createThemeSwitchEffect() {
    const container = document.querySelector('.click-effect') || createClickEffectContainer();
    const emoji = document.createElement('div');
    emoji.className = 'effect-emoji';
    emoji.innerHTML = '🎨';
    emoji.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        font-size: 3rem;
        transform: translate(-50%, -50%);
        animation: rainbow 1s ease;
        z-index: 1001;
    `;
    container.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
}

/**
 * 滚动淡入动画
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

/**
 * 数字计数动画
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');

    if (stats.length === 0) return;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateCounter(el);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element) {
    const target = element.textContent;

    // 跳过无限符号
    if (target === '∞') return;

    const num = parseInt(target);
    if (isNaN(num)) return;

    let current = 0;
    const duration = 1500;
    const steps = 60;
    const increment = Math.ceil(num / steps);
    const stepTime = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
            current = num;
            clearInterval(timer);
        }
        element.textContent = current;
    }, stepTime);
}

/**
 * Lightbox 功能
 */
function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    // Open Lightbox
    function openLightbox(element) {
        const img = element.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update counter
        updateLightboxCounter(currentIndex);
    }

    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Show image
    function showImage(index) {
        const img = galleryItems[index].querySelector('img');
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.opacity = '1';
            updateLightboxCounter(index);
        }, 200);
    }

    // Update counter
    function updateLightboxCounter(index) {
        const counter = lightbox.querySelector('.lightbox-counter');
        if (counter) {
            counter.textContent = `${index + 1} / ${galleryItems.length}`;
        }
    }

    // Click events
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox(item);
        });
    });

    // Close button
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

    // Click background to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation buttons
    document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(currentIndex);
    });

    document.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showImage(currentIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                showImage(currentIndex);
                break;
            case 'ArrowRight':
                currentIndex = (currentIndex + 1) % galleryItems.length;
                showImage(currentIndex);
                break;
        }
    });
}

/**
 * 画廊悬停效果
 */
function initGalleryEffects() {
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

/**
 * 撸小乖按钮
 */
function initPetButton() {
    const petBtn = document.querySelector('.pet-button');
    if (!petBtn) {
        createPetButton();
    }
}

function createPetButton() {
    const btn = document.createElement('button');
    btn.className = 'pet-button';
    btn.innerHTML = '<span class="emoji">🐾</span> 撸小乖';
    document.body.appendChild(btn);

    // Create reaction popup
    const reaction = document.createElement('div');
    reaction.className = 'pet-reaction';
    document.body.appendChild(reaction);

    btn.addEventListener('click', () => {
        // Random reaction
        const randomReaction = petReactions[Math.floor(Math.random() * petReactions.length)];
        reaction.innerHTML = randomReaction;
        reaction.classList.add('show');

        // Create effect
        createPetEffect();

        // Hide after 2 seconds
        setTimeout(() => {
            reaction.classList.remove('show');
        }, 2000);
    });
}

function createPetEffect() {
    const container = document.querySelector('.click-effect') || createClickEffectContainer();

    // Create multiple hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'effect-emoji';
            emoji.innerHTML = '💗';
            emoji.style.cssText = `
                position: fixed;
                left: ${30 + Math.random() * 40}%;
                bottom: 80px;
                font-size: ${1 + Math.random()}rem;
                animation: floatUp 1.5s ease-out forwards;
                pointer-events: none;
                z-index: 1001;
            `;
            container.appendChild(emoji);
            setTimeout(() => emoji.remove(), 1500);
        }, i * 100);
    }
}

/**
 * 点击效果
 */
function initClickEffects() {
    // Create container if not exists
    createClickEffectContainer();

    // Add click listener to body
    document.body.addEventListener('click', (e) => {
        // Ignore clicks on interactive elements
        if (e.target.closest('.theme-btn') ||
            e.target.closest('.pet-button') ||
            e.target.closest('.gallery-item') ||
            e.target.closest('.lightbox') ||
            e.target.closest('button')) {
            return;
        }

        createClickEffect(e.clientX, e.clientY);
    });
}

function createClickEffectContainer() {
    const container = document.createElement('div');
    container.className = 'click-effect';
    document.body.appendChild(container);
    return container;
}

function createClickEffect(x, y) {
    const container = document.querySelector('.click-effect') || createClickEffectContainer();

    // Random emoji
    const emoji = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];

    const effect = document.createElement('span');
    effect.className = 'effect';
    effect.innerHTML = emoji;
    effect.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        font-size: 1.5rem;
        animation: floatUp 1s ease-out forwards;
        pointer-events: none;
        z-index: 999;
    `;

    container.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

/**
 * Cookie Consent
 */
function initCookieConsent() {
    const consentKey = 'xiaoguai-cookie-consent';

    if (localStorage.getItem(consentKey)) {
        return;
    }

    // Create consent banner
    const consent = document.createElement('div');
    consent.className = 'cookie-consent';
    consent.innerHTML = `
        <span>🍪</span>
        <p>这个网站使用 cookies 来保存主题偏好</p>
        <button onclick="acceptCookies()">好的!</button>
    `;
    document.body.appendChild(consent);

    window.acceptCookies = function() {
        localStorage.setItem(consentKey, 'accepted');
        consent.classList.add('hidden');
        setTimeout(() => consent.remove(), 500);
    };
}

/**
 * 添加闪烁装饰到指定元素
 */
function addSparklesToElement(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    for (let i = 0; i < 4; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        element.appendChild(sparkle);
    }
}

// Initialize sparkle effects
addSparklesToElement('.gallery-item');
