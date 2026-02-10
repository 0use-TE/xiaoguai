/**
 * 工具函数模块
 */

// 格式化数字，补零
export function padZero(num) {
    return num.toString().padStart(2, '0');
}

// 获取当前星期几
export function getDayName() {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[new Date().getDay()];
}

// 随机整数
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机浮点数
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// 随机数组元素
export function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 延迟函数
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 格式化日期
export function formatDate(date) {
    return `${date.getFullYear()}年${padZero(date.getMonth() + 1)}月${padZero(date.getDate())}日`;
}

// 判断是否在某个日期范围内
export function isInRange(month, day, startMonth, startDay, endMonth, endDay) {
    const current = new Date(new Date().getFullYear(), month - 1, day);
    const start = new Date(new Date().getFullYear(), startMonth - 1, startDay);
    const end = new Date(new Date().getFullYear(), endMonth - 1, endDay);
    return current >= start && current <= end;
}

// 添加CSS动画类
export function addAnimationClass(element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener('animationend', () => {
        element.classList.remove(animationClass);
    }, { once: true });
}

// 本地存储操作
export const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    }
};
