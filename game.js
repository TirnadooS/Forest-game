// Инициализация игры
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const levelElement = document.getElementById('level');
const restartButton = document.getElementById('restartButton');

// Настройки игры
const gridSize = 40;
let level = 1;
let score = 0;
let totalBerries = 10;
let berries = [];
let obstacles = [];
let player = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    moving: false
};

// Размеры canvas
canvas.width = 800;
canvas.height = 600;

// Загрузка ресурсов
const assets = {
    player: new Image(),
    berry: new Image(),
    background: new Image(),
    sounds: {
        pickup: new Audio('sounds/pickup.mp3'),
        walk: new Audio('sounds/walk.mp3')
    }
};

assets.player.src = 'assets/player.png';
assets.berry.src = 'assets/berry.png';
assets.background.src = 'assets/background.jpg';

// Основной игровой цикл
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Обновление состояния игры
function update() {
    movePlayer();
    checkCollisions();
}

// Отрисовка игры
function draw() {
    // Фон
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
    
    // Препятствия
    drawObstacles();
    
    // Ягоды
    berries.forEach(berry => {
        ctx.drawImage(assets.berry, berry.x, berry.y, gridSize, gridSize);
    });
    
    // Игрок
    ctx.drawImage(assets.player, player.x, player.y, gridSize, gridSize);
    
    // Эффекты
    drawEffects();
}

// Инициализация новой игры
function initGame() {
    level = 1;
    score = 0;
    totalBerries = 10;
    updateHUD();
    
    // Позиция игрока
    player.x = Math.floor(canvas.width / 2 / gridSize) * gridSize;
    player.y = Math.floor(canvas.height / 2 / gridSize) * gridSize;
    player.targetX = player.x;
    player.targetY = player.y;
    
    generateBerries();
    generateObstacles();
}

// Генерация ягод
function generateBerries() {
    berries = [];
    for (let i = 0; i < totalBerries; i++) {
        placeBerry();
    }
}

function placeBerry() {
    let x, y, validPosition;
    
    do {
        validPosition = true;
        x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        
        // Проверка на препятствия
        if (obstacles.some(obs => obs.x === x && obs.y === y)) {
            validPosition = false;
        }
        
        // Проверка на другие ягоды
        if (berries.some(berry => berry.x === x && berry.y === y)) {
            validPosition = false;
        }
        
        // Проверка на игрока
        if (x === player.x && y === player.y) {
            validPosition = false;
        }
    } while (!validPosition);
    
    berries.push({ x, y });
}

// Генерация препятствий
function generateObstacles() {
    obstacles = [];
    const obstacleCount = level * 5;
    
    for (let i = 0; i < obstacleCount; i++) {
        let x, y, validPosition;
        
        do {
            validPosition = true;
            x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
            y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
            
            // Не на стартовой позиции игрока
            if (x === player.x && y === player.y) {
                validPosition = false;
            }
            
            // Не на ягодах
            if (berries.some(berry => berry.x === x && berry.y === y)) {
                validPosition = false;
            }
        } while (!validPosition);
        
        obstacles.push({ x, y });
    }
}

// Движение игрока
function movePlayer() {
    if (player.moving) {
        const dx = player.targetX - player.x;
        const dy = player.targetY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
            player.x = player.targetX;
            player.y = player.targetY;
            player.moving = false;
        } else {
            player.x += dx * 0.2;
            player.y += dy * 0.2;
        }
    }
}

// Проверка столкновений
function checkCollisions() {
    // Сбор ягод
    berries = berries.filter(berry => {
        if (Math.abs(player.x - berry.x) < gridSize/2 && 
            Math.abs(player.y - berry.y) < gridSize/2) {
            score++;
            assets.sounds.pickup.play();
            updateHUD();
            
            if (score >= totalBerries) {
                levelUp();
            }
            
            return false;
        }
        return true;
    });
}

// Переход на новый уровень
function levelUp() {
    level++;
    score = 0;
    totalBerries += 5;
    updateHUD();
    generateBerries();
    generateObstacles();
    
    // Эффект перехода уровня
    document.body.classList.add('level-up');
    setTimeout(() => {
        document.body.classList.remove('level-up');
    }, 1000);
}

// Обновление интерфейса
function updateHUD() {
    scoreElement.textContent = score;
    totalElement.textContent = totalBerries;
    levelElement.textContent = level;
}

// Отрисовка препятствий
function drawObstacles() {
    ctx.fillStyle = '#5d4037';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, gridSize, gridSize);
    });
}

// Эффекты (дождь, частицы и т.д.)
function drawEffects() {
    // Можно добавить визуальные эффекты
}

// Управление
document.addEventListener('keydown', (e) => {
    if (player.moving) return;
    
    let newX = player.x;
    let newY = player.y;
    
    switch (e.key) {
        case 'ArrowUp': newY = Math.max(0, player.y - gridSize); break;
        case 'ArrowDown': newY = Math.min(canvas.height - gridSize, player.y + gridSize); break;
        case 'ArrowLeft': newX = Math.max(0, player.x - gridSize); break;
        case 'ArrowRight': newX = Math.min(canvas.width - gridSize, player.x + gridSize); break;
    }
    
    // Проверка на препятствия
    if (!obstacles.some(obs => obs.x === newX && obs.y === newY)) {
        player.targetX = newX;
        player.targetY = newY;
        player.moving = true;
        assets.sounds.walk.play();
    }
});

// Мобильное управление
document.querySelectorAll('.arrow').forEach(btn => {
    btn.addEventListener('click', () => {
        const keyMap = {
            'up': 'ArrowUp',
            'down': 'ArrowDown',
            'left': 'ArrowLeft',
            'right': 'ArrowRight'
        };
        const dir = btn.classList[1];
        const event = new KeyboardEvent('keydown', { key: keyMap[dir] });
        document.dispatchEvent(event);
    });
});

// Кнопка перезапуска
restartButton.addEventListener('click', initGame);

// Запуск игры при загрузке ресурсов
window.addEventListener('load', () => {
    Promise.all([
        new Promise(resolve => { assets.player.onload = resolve; }),
        new Promise(resolve => { assets.berry.onload = resolve; }),
        new Promise(resolve => { assets.background.onload = resolve; })
    ]).then(() => {
        initGame();
        gameLoop();
    });
});