/**
 * 实时时钟模块
 * 功能：显示可爱的小乖主题实时时钟
 */

import { padZero } from './utils.js';

let clockInterval = null;

/**
 * 初始化时钟
 */
export function initClock() {
    const clockContainer = document.getElementById('clockContainer');
    if (!clockContainer) return;

    // 创建时钟HTML
    clockContainer.innerHTML = `
        <div class="clock-face">
            <div class="clock-decoration">
                <span class="clock-star">✨</span>
                <span class="clock-star">⭐</span>
                <span class="clock-star">✨</span>
            </div>
            <span class="clock-time" id="clockTime">00:00</span>
            <span class="clock-period" id="clockPeriod">AM</span>
        </div>
    `;

    // 更新时间
    updateClock();

    // 每秒更新
    clockInterval = setInterval(updateClock, 1000);
}

/**
 * 更新时钟显示
 */
function updateClock() {
    const timeElement = document.getElementById('clockTime');
    const periodElement = document.getElementById('clockPeriod');

    if (!timeElement || !periodElement) return;

    // 使用东八区时间 (北京时间 UTC+8)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const beijingTime = new Date(utc + (8 * 3600000));

    const hours = beijingTime.getHours();
    const minutes = beijingTime.getMinutes();

    // 判断上午/下午
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    // 更新时间
    timeElement.textContent = `${padZero(displayHours)}:${padZero(minutes)}`;
    periodElement.textContent = period;

    // 添加跳动效果（每秒）
    timeElement.classList.add('bounce');
    setTimeout(() => {
        timeElement.classList.remove('bounce');
    }, 300);
}

/**
 * 获取当前时间信息
 */
export function getCurrentTime() {
    const now = new Date();
    return {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        period: now.getHours() >= 12 ? 'PM' : 'AM',
        displayHours: now.getHours() % 12 || 12
    };
}

/**
 * 销毁时钟
 */
export function destroyClock() {
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}
