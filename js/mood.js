/**
 * 小乖心情系统模块
 * 功能：根据喂食次数和时间显示不同心情
 */

import { storage } from './utils.js';

// 心情配置
const MOODS = {
    happy: {
        icon: '🦔💕',
        emoji: '🥰',
        text: '超级开心！',
        messages: ['小乖好爱你！', '今天是小乖最幸福的一天！', '小乖要亲亲！'],
        className: 'happy'
    },
    content: {
        icon: '🦔✨',
        emoji: '😊',
        text: '很满足~',
        messages: ['小乖吃得饱饱的', '小乖现在很开心', '小乖的状态很好'],
        className: 'content'
    },
    normal: {
        icon: '🦔🐾',
        emoji: '🙂',
        text: '还不错',
        messages: ['小乖一切都好', '小乖在等你哦', '小乖很乖'],
        className: 'normal'
    },
    hungry: {
        icon: '🦔🥺',
        emoji: '🥺',
        text: '饿饿的...',
        messages: ['小乖想吃猫粮了', '小乖肚子咕咕叫', '给小乖吃点东西吧'],
        className: 'hungry'
    },
    sleepy: {
        icon: '🦔💤',
        emoji: '😴',
        text: '想睡觉...',
        messages: ['小乖困困的', '小乖要休息了', '晚安，小乖'],
        className: 'sleepy'
    }
};

// 心情阈值配置
const HUNGER_THRESHOLD = 70; // 饱食度阈值
const SLEEPY_HOURS = [22, 23, 0, 1, 2, 3, 4, 5]; // 睡觉时间（小时）

let moodInterval = null;

/**
 * 初始化心情系统
 */
export function initMood() {
    createMoodWidget();
    updateMood();
    startMoodUpdater();
}

/**
 * 创建心情小组件
 */
function createMoodWidget() {
    const widget = document.createElement('div');
    widget.id = 'moodWidget';
    widget.className = 'mood-widget';
    widget.innerHTML = `
        <div class="mood-bubble" id="moodBubble">
            <span class="mood-avatar" id="moodAvatar">🦔</span>
            <div class="hunger-bar-container">
                <div class="hunger-bar" id="hungerBar"></div>
            </div>
            <div class="mood-speech" id="moodSpeech"></div>
        </div>
    `;
    document.body.appendChild(widget);

    // 点击显示随机消息
    const bubble = document.getElementById('moodBubble');
    bubble.addEventListener('click', showRandomMessage);
}

/**
 * 获取当前心情
 */
export function getCurrentMood() {
    const feedCount = parseInt(storage.get('feedCount', 0));
    const lastFeedTime = parseInt(storage.get('lastFeedTime', 0));
    const currentHour = new Date().getHours();

    // 计算饱食度（基于喂食次数，随时间递减）
    let hunger = Math.min(100, feedCount * 15); // 每次喂食增加15%
    const hoursSinceLastFeed = (Date.now() - lastFeedTime) / (1000 * 60 * 60);
    hunger = Math.max(0, hunger - hoursSinceLastFeed * 10); // 每小时减少10%

    // 判断心情
    let mood;
    if (SLEEPY_HOURS.includes(currentHour)) {
        mood = MOODS.sleepy;
    } else if (hunger >= HUNGER_THRESHOLD) {
        mood = MOODS.happy;
    } else if (hunger >= 40) {
        mood = MOODS.content;
    } else if (hunger >= 20) {
        mood = MOODS.normal;
    } else {
        mood = MOODS.hungry;
    }

    return { mood, hunger };
}

/**
 * 更新心情显示
 */
export function updateMood() {
    const { mood, hunger } = getCurrentMood();

    const bubble = document.getElementById('moodBubble');
    const avatar = document.getElementById('moodAvatar');
    const speech = document.getElementById('moodSpeech');
    const hungerBar = document.getElementById('hungerBar');

    if (!bubble || !avatar) return;

    // 移除旧的心情类
    Object.values(MOODS).forEach(m => {
        bubble.classList.remove(m.className);
    });

    // 添加新的心情类
    bubble.classList.add(mood.className);
    avatar.textContent = mood.icon;

    // 更新说话内容
    if (speech) {
        speech.textContent = mood.messages[0];
    }

    // 更新饱食度条
    if (hungerBar) {
        hungerBar.style.width = `${hunger}%`;
        hungerBar.classList.remove('full', 'medium');
        if (hunger >= 70) {
            hungerBar.classList.add('full');
        } else if (hunger >= 40) {
            hungerBar.classList.add('medium');
        }
    }

    // 保存当前心情状态
    storage.set('currentMood', mood.className);
}

/**
 * 显示随机消息
 */
function showRandomMessage() {
    const { mood } = getCurrentMood();
    const speech = document.getElementById('moodSpeech');
    const notification = document.getElementById('moodNotification');

    if (speech) {
        const randomMsg = mood.messages[Math.floor(Math.random() * mood.messages.length)];
        speech.textContent = randomMsg;
    }

    // 显示通知
    if (notification) {
        notification.querySelector('.mood-icon').textContent = mood.emoji;
        notification.querySelector('.mood-text').textContent = mood.text;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

/**
 * 启动心情更新器
 */
function startMoodUpdater() {
    // 每5分钟更新一次心情
    moodInterval = setInterval(updateMood, 5 * 60 * 1000);
}

/**
 * 获取饱食度
 */
export function getHunger() {
    const feedCount = parseInt(storage.get('feedCount', 0));
    const lastFeedTime = parseInt(storage.get('lastFeedTime', 0));
    const hoursSinceLastFeed = (Date.now() - lastFeedTime) / (1000 * 60 * 60);
    return Math.max(0, Math.min(100, feedCount * 15 - hoursSinceLastFeed * 10));
}

/**
 * 设置心情通知HTML
 */
export function setMoodNotificationHTML() {
    const container = document.createElement('div');
    container.id = 'moodNotification';
    container.className = 'mood-notification';
    container.innerHTML = `
        <span class="mood-icon">🥰</span>
        <span class="mood-text"></span>
    `;
    document.body.appendChild(container);
}

/**
 * 销毁心情系统
 */
export function destroyMood() {
    if (moodInterval) {
        clearInterval(moodInterval);
    }
    const widget = document.getElementById('moodWidget');
    const notification = document.getElementById('moodNotification');
    if (widget) widget.remove();
    if (notification) notification.remove();
}
