const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

// Настройки игры
const gridSize = 40;
const berryCount = 10;
let score = 0;
let berries = [];
let player = {
    x: 0,
    y: 0,
    color: '#5d4037'
};

// Запуск игры
function startGame() {
    score = 0;
    scoreElement.textContent = `${score}/${berryCount}`;
    player.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    player.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    generateBerries();
    draw();
}

// Генерация ягод
function generateBerries() {
    berries = [];
    for (let i = 0; i < berryCount; i++) {
        berries.push({
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
            color: '#d81b60'
        });
    }
}

// Отрисовка игры
function draw() {
    // Очистка холста
    ctx.fillStyle = '#c8e6c9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем ягоды
    berries.forEach(berry => {
        ctx.fillStyle = berry.color;
        ctx.beginPath();
        ctx.arc(berry.x + gridSize/2, berry.y + gridSize/2, gridSize/3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Рисуем игрока
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, gridSize, gridSize);
}

// Проверка сбора ягод
function checkBerryCollision() {
    berries = berries.filter(berry => {
        if (player.x === berry.x && player.y === berry.y) {
            score++;
            scoreElement.textContent = `${score}/${berryCount}`;
            return false; // Удаляем ягоду
        }
        return true;
    });

    if (score === berryCount) {
        alert('Поздравляю! Вы собрали все ягоды!');
        startGame();
    }
}

// Управление
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (player.y > 0) player.y -= gridSize; break;
        case 'ArrowDown': if (player.y < canvas.height - gridSize) player.y += gridSize; break;
        case 'ArrowLeft': if (player.x > 0) player.x -= gridSize; break;
        case 'ArrowRight': if (player.x < canvas.width - gridSize) player.x += gridSize; break;
    }
    checkBerryCollision();
    draw();
});

// Кнопка перезапуска
restartButton.addEventListener('click', startGame);

// Старт игры
startGame();