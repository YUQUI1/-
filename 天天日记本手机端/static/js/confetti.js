// 彩花特效函数
function createConfetti(x, y) {
    const colors = ['#ffb6c1', '#e84a7f', '#ff69b4', '#ffc0cb', '#ff1493'];
    const confettiCount = 50;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.opacity = '0.8';
        container.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        // 动画
        let posX = x;
        let posY = y;
        let opacity = 0.8;
        let scale = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy + 1; // 添加重力效果
            opacity -= 0.01;
            scale -= 0.01;
            
            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity.toString();
            confetti.style.transform = `scale(${scale})`;
            
            if (opacity > 0 && posY < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                container.removeChild(confetti);
                if (container.childElementCount === 0) {
                    document.body.removeChild(container);
                }
            }
        };
        
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, Math.random() * 500);
    }
}

// 为所有按钮添加彩花特效
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const originalClick = button.onclick;
        button.onclick = function(e) {
            createConfetti(e.clientX, e.clientY);
            if (typeof originalClick === 'function') {
                originalClick.call(this, e);
            } else if (originalClick) {
                // 处理 onclick="window.location.href='xxx'" 这种情况
                const href = button.getAttribute('onclick');
                if (href) {
                    setTimeout(() => {
                        eval(href);
                    }, 300);
                    return false;
                }
            }
        };
    });
});