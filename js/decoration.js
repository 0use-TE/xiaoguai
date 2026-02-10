/**
 * 节日装饰模块
 * 功能：根据当前日期自动显示节日装饰
 */

import { randomItem, randomInt, randomFloat } from './utils.js';

// 节日配置
const HOLIDAYS = {
    // 春节 (大年三十到正月十五)
    springFestival: {
        name: '春节',
        startMonth: 1,
        startDay: 20,  // 腊月二十左右
        endMonth: 2,
        endDay: 15,    // 正月十五
        className: 'spring-festival',
        decorations: ['🏮', '福', '🌸', '🎊', '🧧', '🎉', '✨'],
        bannerText: '🎊 春节快乐！祝小乖健康成长！🎊'
    },
    // 情人节 (2月14日)
    valentine: {
        name: '情人节',
        month: 2,
        day: 14,
        className: 'valentine',
        decorations: ['💕', '💖', '💗', '💓', '🌹', '🍫', '💌'],
        bannerText: '💕 爱你哟，小乖！💕'
    },
    // 妇女节/女生节 (3月7-8日)
    womenDay: {
        name: '妇女节',
        startMonth: 3,
        startDay: 7,
        endMonth: 3,
        endDay: 8,
        className: 'valentine',
        decorations: ['🌸', '💐', '💝', '🎀', '💖', '🌷'],
        bannerText: '🌸 女神节快乐！小乖最美！🌸'
    },
    // 清明节 (4月4-6日)
    qingming: {
        name: '清明节',
        startMonth: 4,
        startDay: 4,
        endMonth: 4,
        endDay: 6,
        className: 'everyday',
        decorations: ['🌸', '🌼', '🌺', '🍃', '🌿'],
        bannerText: '🌸 清明时节，小乖陪你踏青~🌸'
    },
    // 劳动节 (5月1日)
    laborDay: {
        name: '劳动节',
        month: 5,
        day: 1,
        className: 'everyday',
        decorations: ['🌸', '💐', '🌟', '🎀'],
        bannerText: '💪 劳动节快乐！小乖今天休息~🌸'
    },
    // 儿童节 (6月1日)
    childrenDay: {
        name: '儿童节',
        month: 6,
        day: 1,
        className: 'everyday',
        decorations: ['🎈', '🎨', '🧸', '⭐', '🌈', '🎀'],
        bannerText: '🎈 六一儿童节！小乖永远是小可爱！🎈'
    },
    // 七夕 (农历七月初七，约8月中旬)
    qiXi: {
        name: '七夕',
        month: 8,
        day: 10,  // 约数
        className: 'valentine',
        decorations: ['🌟', '💫', '🌙', '💕', '✨', '🎀'],
        bannerText: '🌙 七夕节！愿小乖天天开心！🌙'
    },
    // 教师节 (9月10日)
    teacherDay: {
        name: '教师节',
        month: 9,
        day: 10,
        className: 'everyday',
        decorations: ['🌸', '💐', '📚', '🎀', '🌷'],
        bannerText: '🌸 祝所有养宠人教师节快乐！🌸'
    },
    // 中秋节 (农历八月十五，约9月中旬-10月)
    midAutumn: {
        name: '中秋节',
        month: 9,
        day: 15,  // 约数
        className: 'everyday',
        decorations: ['🌙', '⭐', '✨', '🐇', '🎑'],
        bannerText: '🌕 中秋节快乐！和小乖一起赏月~🌕'
    },
    // 国庆节 (10月1日)
    nationalDay: {
        name: '国庆节',
        month: 10,
        day: 1,
        className: 'everyday',
        decorations: ['🏮', '🎊', '✨', '🎀'],
        bannerText: '🎉 祝小乖国庆快乐！🎉'
    },
    // 万圣节 (10月31日)
    halloween: {
        name: '万圣节',
        month: 10,
        day: 31,
        className: 'halloween',
        decorations: ['🎃', '👻', '🦇', '🍬', '🕷️', '💀'],
        bannerText: '🎃 万圣节快乐！小乖不给糖就捣蛋！🎃'
    },
    // 感恩节 (11月第四个周四，约11月22-28日)
    thanksgiving: {
        name: '感恩节',
        startMonth: 11,
        startDay: 22,
        endMonth: 11,
        endDay: 28,
        className: 'everyday',
        decorations: ['🦃', '🍂', '🌽', '💛', '🎀'],
        bannerText: '🦃 感恩节快乐！感谢有小乖陪伴！🦃'
    },
    // 圣诞节 (12月24-25日)
    christmas: {
        name: '圣诞节',
        startMonth: 12,
        startDay: 20,
        endMonth: 12,
        endDay: 26,
        className: 'christmas',
        decorations: ['🎄', '🎅', '🎁', '🔔', '❄️', '⭐', '🛷'],
        bannerText: '🎄 圣诞节快乐！小乖祝你节日愉快！🎄'
    },
    // 小乖生日 (假设1月15日，可修改)
    birthday: {
        name: '生日',
        month: 1,
        day: 15,
        className: 'valentine',
        decorations: ['🎂', '🎈', '🎁', '💖', '✨', '🎀', '⭐'],
        bannerText: '🎂 祝小乖生日快乐！健康成长！🎂'
    }
};

/**
 * 初始化节日装饰
 */
export function initDecoration() {
    const holiday = getCurrentHoliday();
    if (!holiday) return;

    const container = document.getElementById('holidayDecoration');

    // 添加节日样式类到body
    document.body.classList.add(holiday.className);

    // 创建装饰元素
    if (container) {
        // 随机添加15-25个装饰元素
        const count = randomInt(15, 25);
        for (let i = 0; i < count; i++) {
            const decoration = document.createElement('span');
            decoration.className = 'decoration-item';
            decoration.textContent = randomItem(holiday.decorations);
            decoration.style.left = `${randomInt(2, 98)}%`;
            decoration.style.animationDelay = `${randomFloat(0, 3)}s`;
            decoration.style.animationDuration = `${randomFloat(2, 5)}s`;

            // 随机大小
            const size = randomInt(10, 30);
            decoration.style.fontSize = `${size}px`;

            container.appendChild(decoration);
        }
    }
}

/**
 * 获取当前节日
 */
export function getCurrentHoliday() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // 检查范围型节日
    for (const key in HOLIDAYS) {
        const holiday = HOLIDAYS[key];
        if (holiday.startMonth && holiday.endMonth) {
            if (isInDateRange(month, day, holiday.startMonth, holiday.startDay, holiday.endMonth, holiday.endDay)) {
                return holiday;
            }
        }
    }

    // 检查单日型节日
    for (const key in HOLIDAYS) {
        const holiday = HOLIDAYS[key];
        if (!holiday.startMonth && holiday.month === month && holiday.day === day) {
            return holiday;
        }
    }

    // 如果没有节日，返回日常装饰
    return null;
}

/**
 * 检查日期是否在范围内
 */
function isInDateRange(month, day, startMonth, startDay, endMonth, endDay) {
    const current = new Date(new Date().getFullYear(), month - 1, day);
    const start = new Date(new Date().getFullYear(), startMonth - 1, startDay);
    const end = new Date(new Date().getFullYear(), endMonth - 1, endDay);
    return current >= start && current <= end;
}

/**
 * 清除节日装饰
 */
export function clearDecoration() {
    const container = document.getElementById('holidayDecoration');

    if (container) {
        container.innerHTML = '';
    }

    // 移除所有节日样式类
    Object.values(HOLIDAYS).forEach(holiday => {
        document.body.classList.remove(holiday.className);
    });
    document.body.classList.remove('everyday');
}

/**
 * 获取所有节日列表
 */
export function getAllHolidays() {
    return Object.values(HOLIDAYS).map(h => h.name);
}
