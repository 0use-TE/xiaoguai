/**
 * 天气联动模块
 * 功能：根据天气显示不同背景和装饰
 */

import { randomInt } from './utils.js';

// 天气配置
const WEATHER_TYPES = {
    sunny: {
        icon: '☀️',
        temp: null, // 动态获取
        desc: '晴朗',
        className: 'weather-sunny',
        bannerClass: 'sunny',
        effects: ['sun-ray']
    },
    cloudy: {
        icon: '☁️',
        temp: null,
        desc: '多云',
        className: 'weather-cloudy',
        bannerClass: 'cloudy',
        effects: ['cloud']
    },
    partlyCloudy: {
        icon: '⛅',
        temp: null,
        desc: '少云',
        className: 'weather-cloudy',
        bannerClass: 'cloudy',
        effects: ['cloud']
    },
    rainy: {
        icon: '🌧️',
        temp: null,
        desc: '下雨',
        className: 'weather-rainy',
        bannerClass: 'rainy',
        effects: ['rain-drop']
    },
    snowy: {
        icon: '❄️',
        temp: null,
        desc: '下雪',
        className: 'weather-snowy',
        bannerClass: 'snowy',
        effects: ['snowflake']
    },
    storm: {
        icon: '⛈️',
        temp: null,
        desc: '雷雨',
        className: 'weather-stormy',
        bannerClass: 'stormy',
        effects: ['rain-drop', 'flash']
    },
    windy: {
        icon: '💨',
        temp: null,
        desc: '大风',
        className: 'weather-cloudy',
        bannerClass: 'cloudy',
        effects: ['cloud']
    }
};

// 模拟天气（因为无法直接调用天气API）
const SIMULATED_WEATHER = ['sunny', 'cloudy', 'partlyCloudy', 'sunny', 'sunny'];

let weatherInterval = null;
let effectIntervals = [];

/**
 * 初始化天气系统
 */
export function initWeather() {
    createWeatherWidget();
    createWeatherEffectContainer();
    updateWeather();
    startWeatherEffects();
    setMoodNotificationHTML();
}

/**
 * 创建天气小组件
 */
function createWeatherWidget() {
    const widget = document.createElement('div');
    widget.id = 'weatherWidget';
    widget.className = 'weather-widget';
    widget.innerHTML = `
        <div class="weather-bubble" id="weatherBubble">
            <span class="weather-icon" id="weatherIcon">☀️</span>
            <span class="weather-temp" id="weatherTemp">25°</span>
            <span class="weather-desc" id="weatherDesc">晴朗</span>
        </div>
    `;
    document.body.appendChild(widget);
}

/**
 * 创建天气特效容器
 */
function createWeatherEffectContainer() {
    const container = document.createElement('div');
    container.id = 'weatherEffect';
    container.className = 'weather-effect';
    document.body.appendChild(container);
}

/**
 * 更新天气显示
 */
export function updateWeather() {
    // 使用模拟天气（实际项目中可以替换为真实API）
    const weatherKey = SIMULATED_WEATHER[Math.floor(Math.random() * SIMULATED_WEATHER.length)];
    const weather = WEATHER_TYPES[weatherKey];

    const bubble = document.getElementById('weatherBubble');
    const icon = document.getElementById('weatherIcon');
    const temp = document.getElementById('weatherTemp');
    const desc = document.getElementById('weatherDesc');
    const effect = document.getElementById('weatherEffect');
    const banner = document.getElementById('weatherBanner');

    if (!bubble || !icon) return;

    // 移除旧的天气类
    Object.values(WEATHER_TYPES).forEach(w => {
        bubble.classList.remove(w.className);
        if (effect) effect.classList.remove(w.bannerClass);
    });

    // 添加新的天气类
    bubble.classList.add(weather.className);
    icon.textContent = weather.icon;
    desc.textContent = weather.desc;

    // 生成随机温度
    const temperature = randomInt(18, 32);
    if (temp) temp.textContent = `${temperature}°`;

    // 更新特效容器类
    if (effect) {
        effect.className = `weather-effect ${weather.bannerClass}`;
    }

    // 保存当前天气
    localStorage.setItem('currentWeather', weatherKey);
}

/**
 * 启动天气特效
 */
function startWeatherEffects() {
    const effect = document.getElementById('weatherEffect');
    if (!effect) return;

    // 清空之前的特效
    effect.innerHTML = '';
    effectIntervals.forEach(interval => clearInterval(interval));
    effectIntervals = [];

    // 检查当前天气类型
    const weatherKey = localStorage.getItem('currentWeather', 'sunny');
    const weather = WEATHER_TYPES[weatherKey];

    // 创建特效
    if (weather.effects.includes('rain-drop')) {
        startRainEffect();
    }
    if (weather.effects.includes('snowflake')) {
        startSnowEffect();
    }
    if (weather.effects.includes('sun-ray')) {
        startSunEffect();
    }
    if (weather.effects.includes('cloud')) {
        startCloudEffect();
    }
}

/**
 * 下雨特效
 */
function startRainEffect() {
    const effect = document.getElementById('weatherEffect');
    if (!effect) return;

    // 创建雨滴
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${randomInt(0, 100)}%`;
        drop.style.animationDuration = `${randomFloat(0.5, 1)}s`;
        drop.style.animationDelay = `${randomFloat(0, 5)}s`;
        drop.style.opacity = randomInt(3, 7) / 10;
        effect.appendChild(drop);
    }
}

/**
 * 下雪特效
 */
function startSnowEffect() {
    const effect = document.getElementById('weatherEffect');
    if (!effect) return;

    const snowflakes = ['❄', '❅', '❆', '✦', '✧'];

    // 创建雪花
    for (let i = 0; i < 30; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = snowflakes[randomInt(0, snowflakes.length - 1)];
        flake.style.left = `${randomInt(0, 100)}%`;
        flake.style.animationDuration = `${randomFloat(3, 8)}s`;
        flake.style.animationDelay = `${randomFloat(0, 10)}s`;
        flake.style.fontSize = `${randomInt(10, 20)}px`;
        effect.appendChild(flake);
    }
}

/**
 * 阳光特效
 */
function startSunEffect() {
    const effect = document.getElementById('weatherEffect');
    if (!effect) return;

    const sunray = document.createElement('div');
    sunray.className = 'sun-ray';
    effect.appendChild(sunray);
}

/**
 * 云朵特效
 */
function startCloudEffect() {
    const effect = document.getElementById('weatherEffect');
    if (!effect) return;

    const clouds = ['☁️', '🌥️', '⛅'];

    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.textContent = clouds[randomInt(0, clouds.length - 1)];
        cloud.style.top = `${randomInt(5, 30)}%`;
        cloud.style.animationDelay = `${i * 5}s`;
        effect.appendChild(cloud);
    }
}

/**
 * 设置天气横幅HTML
 */
function setMoodNotificationHTML() {
    // 不再创建天气横幅，只保留天气组件
}

/**
 * 获取当前天气
 */
export function getCurrentWeather() {
    const weatherKey = localStorage.getItem('currentWeather', 'sunny');
    return WEATHER_TYPES[weatherKey] || WEATHER_TYPES.sunny;
}

/**
 * 销毁天气系统
 */
export function destroyWeather() {
    if (weatherInterval) {
        clearInterval(weatherInterval);
    }
    effectIntervals.forEach(interval => clearInterval(interval));

    const widget = document.getElementById('weatherWidget');
    const effect = document.getElementById('weatherEffect');
    const banner = document.getElementById('weatherBanner');

    if (widget) widget.remove();
    if (effect) effect.remove();
    if (banner) banner.remove();
}
