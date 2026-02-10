/**
 * 浮动装饰模块
 * 功能：花瓣、泡泡、星星等动态背景装饰
 */

import { randomInt, randomFloat, randomItem } from './utils.js';

// 花瓣emoji列表
const PETALS = ['🌸', '🌺', '🌻', '🌼', '🌷', '💮', '🏵️', '💐'];

// 星星emoji列表
const STARS = ['✨', '⭐', '💫', '🌟', '💥'];

// 游走emoji列表
const WANDERING_EMOJIS = ['🦔', '🐾', '💕', '💗', '💖', '🌸', '🎀', '⭐'];

// 泡泡颜色
const BUBBLE_COLORS = [
    'rgba(255, 182, 193, 0.4)',
    'rgba(255, 105, 180, 0.3)',
    'rgba(255, 255, 255, 0.5)',
    'rgba(248, 200, 220, 0.4)',
    'rgba(255, 192, 203, 0.3)'
];

let petalInterval = null;
let bubbleInterval = null;
let starInterval = null;
let wanderInterval = null;
let sparkleInterval = null;

/**
 * 初始化所有浮动装饰
 */
export function initFloating() {
    createContainer();
    startPetalSystem();
    startBubbleSystem();
    startStarSystem();
    startSparkleSystem();
    startWanderingEmoji();
}

/**
 * 创建装饰容器
 */
function createContainer() {
    // 检查是否已存在
    if (document.getElementById('floatingContainer')) return;

    const container = document.createElement('div');
    container.id = 'floatingContainer';
    container.className = 'floating-container';
    document.body.appendChild(container);
}

/**
 * 启动花瓣飘落系统
 */
function startPetalSystem() {
    const container = document.getElementById('floatingContainer');
    if (!container) return;

    // 创建初始花瓣
    for (let i = 0; i < 10; i++) {
        createPetal(container);
    }

    // 定时添加新花瓣
    petalInterval = setInterval(() => {
        if (document.getElementById('floatingContainer')) {
            createPetal(container);
        }
    }, 800);
}

/**
 * 创建单个花瓣
 */
function createPetal(container) {
    const petal = document.createElement('span');
    petal.className = 'floating-petal';
    petal.textContent = randomItem(PETALS);

    // 随机位置和动画参数
    const left = randomInt(2, 98);
    const duration = randomFloat(8, 15);
    const delay = randomFloat(0, 2);
    const size = randomInt(15, 30);

    petal.style.cssText = `
        left: ${left}%;
        font-size: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    container.appendChild(petal);

    // 动画结束后移除
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
    }, (duration + delay) * 1000);
}

/**
 * 启动泡泡上升系统
 */
function startBubbleSystem() {
    const container = document.getElementById('floatingContainer');
    if (!container) return;

    // 创建初始泡泡
    for (let i = 0; i < 5; i++) {
        createBubble(container);
    }

    // 定时添加新泡泡
    bubbleInterval = setInterval(() => {
        if (document.getElementById('floatingContainer')) {
            createBubble(container);
        }
    }, 1500);
}

/**
 * 创建单个泡泡
 */
function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'floating-bubble';

    const size = randomInt(15, 35);
    const left = randomInt(5, 95);
    const duration = randomFloat(6, 12);
    const delay = randomFloat(0, 1);

    bubble.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    container.appendChild(bubble);

    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, (duration + delay) * 1000);
}

/**
 * 启动星星闪烁系统
 */
function startStarSystem() {
    const container = document.getElementById('floatingContainer');
    if (!container) return;

    // 创建初始星星
    for (let i = 0; i < 8; i++) {
        createStar(container);
    }

    // 定时添加新星星
    starInterval = setInterval(() => {
        if (document.getElementById('floatingContainer')) {
            createStar(container);
        }
    }, 2000);
}

/**
 * 创建单个星星
 */
function createStar(container) {
    const star = document.createElement('span');
    star.className = 'floating-star';
    star.textContent = randomItem(STARS);

    const left = randomInt(5, 95);
    const top = randomInt(10, 80);
    const duration = randomFloat(2, 4);
    const delay = randomFloat(0, 1);

    star.style.cssText = `
        left: ${left}%;
        top: ${top}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    container.appendChild(star);

    setTimeout(() => {
        if (star.parentNode) {
            star.parentNode.removeChild(star);
        }
    }, (duration + delay) * 1000);
}

/**
 * 启动闪光效果系统
 */
function startSparkleSystem() {
    sparkleInterval = setInterval(() => {
        if (document.getElementById('floatingContainer')) {
            createSparkle();
        }
    }, 1000);
}

/**
 * 创建单个闪光
 */
function createSparkle() {
    const container = document.getElementById('floatingContainer');
    if (!container) return;

    const sparkle = document.createElement('span');
    sparkle.className = 'floating-sparkle';
    sparkle.textContent = randomItem(STARS);

    const left = randomInt(5, 95);
    const top = randomInt(10, 70);

    sparkle.style.cssText = `
        left: ${left}%;
        top: ${top}%;
    `;

    container.appendChild(sparkle);

    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1500);
}

/**
 * 启动游走emoji
 */
function startWanderingEmoji() {
    const container = document.getElementById('floatingContainer');
    if (!container) return;

    // 创建游走emoji
    const wanderer = document.createElement('span');
    wanderer.className = 'wandering-emoji';
    wanderer.textContent = randomItem(WANDERING_EMOJIS);
    wanderer.id = 'wanderingEmoji';
    container.appendChild(wanderer);

    // 定时更换emoji
    wanderInterval = setInterval(() => {
        const el = document.getElementById('wanderingEmoji');
        if (el) {
            el.textContent = randomItem(WANDERING_EMOJIS);
        }
    }, 5000);
}

/**
 * 停止所有浮动装饰
 */
export function stopFloating() {
    const intervals = [petalInterval, bubbleInterval, starInterval, wanderInterval, sparkleInterval];
    intervals.forEach(interval => {
        if (interval) clearInterval(interval);
    });

    const container = document.getElementById('floatingContainer');
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * 添加一次性爱心特效
 */
export function createHeartEffect(x, y) {
    const container = document.getElementById('floatingContainer');
    if (!container) return;

    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = '💕';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    container.appendChild(heart);

    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 3000);
}
