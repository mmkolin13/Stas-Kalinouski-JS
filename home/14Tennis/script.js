let isGame = false;
function game () {
    isGame = true;
    const canvas = document.querySelector('#canvas');
    canvas.style.visibility = 'visible';
    canvas.height = 400;
    canvas.width = 800;
    const ctx = canvas.getContext("2d");
    // счет и меню
    let score = 0;
    const span = document.getElementById('score-span')
    // мяч
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    const ballRadius = canvas.height / 40;
    let stepX = 5;
    let stepY = -5;
    // ракетки
    let stickWidth = canvas.width / 100;
    let stickHeight = canvas.height / 5;
    let stickX = (canvas.height - stickWidth) / 2
    let upPressed = false;
    let downPressed = false;
    let gap = 5;
    
    function drawField () {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0)
        ctx.closePath();
        ctx.stroke();
    }

    function drawBall () {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };
    function drawStick (xx) {
        ctx.beginPath();
        ctx.rect( xx, stickX, stickWidth, stickHeight );
        ctx.fillStyle = '#1F4C7E';
        ctx.fill();
        ctx.closePath();
    };
    
    function isPressed (e) {
        if (e.keyCode == 87) {
            upPressed = true;
        };
        if (e.keyCode == 83) {
            downPressed = true;
        };
    };
    function isReleased (e) {
        if (e.keyCode == 87) {
            upPressed = false;
        };
        if (e.keyCode == 83) {
            downPressed = false;
        };
    };
    function moveLeftStick () {
        if (downPressed && stickX < canvas.height - stickHeight ) {
            stickX += 3
        } else if (upPressed && stickX > 0) {
            stickX -= 3
        }
    };
    
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawField();
        drawBall();
        moveLeftStick();
        drawStick(gap);
        
        if (x + stepX > canvas.width - ballRadius ) {
            stepX = -stepX;
        };
        if (y + stepY > canvas.height - ballRadius|| y + stepY < ballRadius) {
            stepY = -stepY;
        };
        // проигрыш
        if ( x + stepX < ballRadius) {
            clearInterval(loop);
            loseMenu(score)
        };
    
        // отбивание стиками
        if (x - stickWidth - gap < 5 && y >=stickX && y <= stickX + stickHeight ) {
                stepX = -stepX;
                score++;
                span.textContent = score;
        };
        x += stepX;
        y += stepY;
    };
    const loop = setInterval(draw, 17);
    document.addEventListener('keydown', isPressed);
    document.addEventListener('keyup', isReleased);
};

// меню после проигрыша
function loseMenu (score) {
    const div = document.createElement('div');
    div.id = 'lose-menu-wrap';
    const menu = document.createElement('div');
    menu.id = 'lose-menu';

    const h2 = document.createElement('h2');
    h2.textContent = `
    ИГРА ОКОНЧЕНА!
    ВАШ СЧЕТ: ${ score}
    `;
    menu.appendChild(h2);

    const retry = document.createElement('button');
    retry.id = 'retry-btn';
    retry.addEventListener('click', () => {
        window.location.reload();
        game();
    });

    retry.textContent = 'Попробовать снова';
    menu.appendChild(retry);
    div.appendChild(menu);
    document.body.appendChild(div);
};

const renewGame = (e) => {
    if (isGame) {
        return null;
    };
    if (e.keyCode == 13) {
        game();
    }
};

// обработчики
document.addEventListener('DOMContentLoaded', () => {
    alert(`
управление: w - вверх, s - вниз
Для старта нажмите кнопку начать, либо клавишу ENTER
`)
})
document.getElementById('start-btn').addEventListener('click', game);
window.addEventListener('keydown', renewGame );
