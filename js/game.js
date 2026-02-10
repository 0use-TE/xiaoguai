/**
 * 接猫粮小游戏模块
 * 功能：简单的接猫粮互动游戏
 */

import { randomInt } from './utils.js';

// 游戏配置
const GAME_CONFIG = {
    duration: 30, // 游戏时长（秒）
    foodSpeed: 3, // 猫粮下落速度
    spawnRate: 800, // 生成频率（毫秒）
    pointsPerCatch: 10 // 接住一个加分
};

let gameState = {
    isPlaying: false,
    score: 0,
    timeLeft: GAME_CONFIG.duration,
    bowlPosition: 50, // 碗的位置（百分比）
    foods: [],
    gameLoop: null,
    spawnLoop: null,
    timerLoop: null
};

/**
 * 初始化游戏
 */
export function initGame() {
    createGameUI();
    setupGameControls();
}

/**
 * 创建游戏UI
 */
function createGameUI() {
    // 游戏入口按钮
    const entry = document.createElement('div');
    entry.className = 'game-entry';
    entry.innerHTML = `
        <button class="game-entry-btn" id="gameEntryBtn" title="玩接猫粮游戏">🎮</button>
    `;
    document.body.appendChild(entry);

    // 游戏遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'gameOverlay';
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-container">
            <button class="game-close-btn" id="gameCloseBtn">&times;</button>
            <div class="game-header">
                <span class="game-title">🎮 接猫粮</span>
                <span class="game-score">得分: <span id="gameScore">0</span></span>
                <span class="game-timer">时间: <span id="gameTimer">${GAME_CONFIG.duration}</span>s</span>
            </div>
            <div class="game-area" id="gameArea">
                <div class="game-bowl" id="gameBowl">🥣</div>
                <div class="game-over" id="gameOver" style="display: none;">
                    <h3>游戏结束！</h3>
                    <span class="final-score" id="finalScore">0</span>
                    <p class="score-message" id="scoreMessage">太棒了！</p>
                    <button class="game-start-btn" id="restartBtn">再玩一次</button>
                </div>
            </div>
            <p class="game-instructions">
                使用 <kbd>←</kbd> <kbd>→</kbd> 或 <kbd>A</kbd> <kbd>D</kbd> 移动小碗
            </p>
            <button class="game-start-btn" id="gameStartBtn">开始游戏</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * 设置游戏控制
 */
function setupGameControls() {
    // 入口按钮
    document.getElementById('gameEntryBtn').addEventListener('click', openGame);

    // 关闭按钮
    document.getElementById('gameCloseBtn').addEventListener('click', closeGame);

    // 开始按钮
    document.getElementById('gameStartBtn').addEventListener('click', startGame);

    // 重新开始按钮
    document.getElementById('restartBtn').addEventListener('click', startGame);

    // 键盘控制
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // 触摸控制（移动端）
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
        gameArea.addEventListener('touchmove', handleTouch);
    }
}

// 键盘状态
let keys = {
    left: false,
    right: false
};

/**
 * 处理按键按下
 */
function handleKeyDown(e) {
    if (!gameState.isPlaying) return;

    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            keys.left = true;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            keys.right = true;
            break;
    }
}

/**
 * 处理按键释放
 */
function handleKeyUp(e) {
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            keys.right = false;
            break;
    }
}

/**
 * 处理触摸滑动
 */
function handleTouch(e) {
    if (!gameState.isPlaying) return;

    const touch = e.touches[0];
    const gameArea = document.getElementById('gameArea');
    const rect = gameArea.getBoundingClientRect();
    const x = touch.clientX - rect.left;

    gameState.bowlPosition = Math.max(5, Math.min(95, (x / rect.width) * 100));
    updateBowlPosition();
}

/**
 * 打开游戏
 */
function openGame() {
    const overlay = document.getElementById('gameOverlay');
    overlay.classList.add('active');
}

/**
 * 关闭游戏
 */
function closeGame() {
    stopGame();
    const overlay = document.getElementById('gameOverlay');
    overlay.classList.remove('active');
}

/**
 * 开始游戏
 */
function startGame() {
    // 重置状态
    gameState = {
        isPlaying: true,
        score: 0,
        timeLeft: GAME_CONFIG.duration,
        bowlPosition: 50,
        foods: [],
        gameLoop: null,
        spawnLoop: null,
        timerLoop: null
    };

    // 更新UI
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameTimer').textContent = GAME_CONFIG.duration;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameStartBtn').style.display = 'none';

    // 清空场上的食物
    const gameArea = document.getElementById('gameArea');
    const foods = gameArea.querySelectorAll('.game-food');
    foods.forEach(f => f.remove());

    // 启动游戏循环
    startGameLoop();
    startSpawner();
    startTimer();
}

/**
 * 停止游戏
 */
function stopGame() {
    gameState.isPlaying = false;

    // 清除循环
    if (gameState.gameLoop) clearInterval(gameState.gameLoop);
    if (gameState.spawnLoop) clearInterval(gameState.spawnLoop);
    if (gameState.timerLoop) clearInterval(gameState.timerLoop);

    // 清空食物
    const gameArea = document.getElementById('gameArea');
    const foods = gameArea.querySelectorAll('.game-food');
    foods.forEach(f => f.remove());
    gameState.foods = [];

    // 重置按钮
    document.getElementById('gameStartBtn').style.display = 'inline-block';
}

/**
 * 游戏主循环
 */
function startGameLoop() {
    // 使用setInterval代替requestAnimationFrame，更简单可靠
    gameState.gameLoop = setInterval(() => {
        if (!gameState.isPlaying) {
            clearInterval(gameState.gameLoop);
            return;
        }

        // 更新碗位置
        if (keys.left) {
            gameState.bowlPosition = Math.max(5, gameState.bowlPosition - 3);
        }
        if (keys.right) {
            gameState.bowlPosition = Math.min(95, gameState.bowlPosition + 3);
        }
        updateBowlPosition();

        // 更新食物位置
        updateFoods();

        // 检测碰撞
        checkCollisions();
    }, 16); // 约60fps
}

/**
 * 生成食物
 */
function startSpawner() {
    gameState.spawnLoop = setInterval(() => {
        if (!gameState.isPlaying) return;

        const gameArea = document.getElementById('gameArea');
        const food = document.createElement('div');
        food.className = 'game-food';

        // 随机选择猫粮类型
        const foodTypes = ['🍖', '🥫', '🐟', '🦐', '🥚'];
        food.textContent = foodTypes[randomInt(0, foodTypes.length - 1)];

        food.style.left = `${randomInt(5, 90)}%`;
        food.style.top = '-50px';

        gameArea.appendChild(food);

        gameState.foods.push({
            element: food,
            x: randomInt(5, 90),
            y: -50,
            speed: randomFloat(2, 5)
        });
    }, GAME_CONFIG.spawnRate);
}

/**
 * 计时器
 */
function startTimer() {
    gameState.timerLoop = setInterval(() => {
        if (!gameState.isPlaying) return;

        gameState.timeLeft--;
        document.getElementById('gameTimer').textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

/**
 * 更新碗位置
 */
function updateBowlPosition() {
    const bowl = document.getElementById('gameBowl');
    if (bowl) {
        bowl.style.left = `${gameState.bowlPosition}%`;
    }
}

/**
 * 更新食物位置
 */
function updateFoods() {
    const gameArea = document.getElementById('gameArea');
    const height = gameArea.offsetHeight - 80; // 减去碗的高度

    gameState.foods = gameState.foods.filter(food => {
        food.y += food.speed;
        food.element.style.top = `${food.y}px`;

        // 如果超出边界，移除
        if (food.y > height + 50) {
            food.element.remove();
            return false;
        }
        return true;
    });
}

/**
 * 检测碰撞
 */
function checkCollisions() {
    const bowl = document.getElementById('gameBowl');
    const bowlRect = bowl.getBoundingClientRect();
    const gameArea = document.getElementById('gameArea');
    const areaRect = gameArea.getBoundingClientRect();

    const bowlY = bowlRect.top - areaRect.top;

    gameState.foods = gameState.foods.filter(food => {
        const foodRect = food.element.getBoundingClientRect();

        // 检测碰撞
        if (foodRect.bottom >= bowlY &&
            foodRect.top <= bowlY + 30 &&
            foodRect.left >= bowlRect.left - 20 &&
            foodRect.right <= bowlRect.right + 20) {

            // 接到食物
            gameState.score += GAME_CONFIG.pointsPerCatch;
            document.getElementById('gameScore').textContent = gameState.score;

            // 移除食物
            food.element.remove();
            return false;
        }
        return true;
    });
}

/**
 * 结束游戏
 */
function endGame() {
    stopGame();

    const gameOver = document.getElementById('gameOver');
    const finalScore = document.getElementById('finalScore');
    const scoreMessage = document.getElementById('scoreMessage');

    finalScore.textContent = gameState.score;

    // 根据分数显示不同消息
    let message = '太棒了！';
    if (gameState.score >= 200) {
        message = '小乖对你竖起大拇指！👍';
    } else if (gameState.score >= 100) {
        message = '很厉害哦！继续加油！💪';
    } else if (gameState.score >= 50) {
        message = '还不错，继续努力！😊';
    } else {
        message = '多练习几次会更好！🌟';
    }

    scoreMessage.textContent = message;
    gameOver.style.display = 'flex';
}

/**
 * 获取游戏分数
 */
export function getGameScore() {
    return gameState.score;
}

/**
 * 销毁游戏
 */
export function destroyGame() {
    stopGame();

    const entry = document.querySelector('.game-entry');
    const overlay = document.getElementById('gameOverlay');

    if (entry) entry.remove();
    if (overlay) overlay.remove();

    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
}
