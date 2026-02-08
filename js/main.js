/**
 * 小乖的网站 - 主脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Loading Animation =====
    setTimeout(function() {
        document.querySelector('.loading').classList.add('hidden');
    }, 500);

    // ===== Scroll Animations =====
    initScrollAnimations();

    // ===== Stats Counter Animation =====
    initStatsCounter();

    // ===== Lightbox =====
    initLightbox();

    // ===== Gallery Hover Effects =====
    initGalleryEffects();
});

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
    const duration = 1500; // 动画时长(ms)
    const steps = 60; // 动画步数
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

    // 打开 Lightbox
    function openLightbox(element) {
        const img = element.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 关闭 Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 显示图片
    function showImage(index) {
        const img = galleryItems[index].querySelector('img');
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    // 点击事件
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox(item);
        });
    });

    // 关闭按钮
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

    // 点击背景关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // 导航按钮
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

    // 键盘导航
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

// 初始化闪烁效果
addSparklesToElement('.gallery-item');
