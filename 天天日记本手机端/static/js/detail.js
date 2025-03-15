document.addEventListener('DOMContentLoaded', function() {
    // 加载用户保存的背景颜色
    loadBackgroundColor();
    
    // 加载用户保存的名字
    loadUserName();
});

// 加载用户保存的背景颜色
function loadBackgroundColor() {
    const savedColor = localStorage.getItem('bgColor');
    if (savedColor) {
        setBackgroundColor(savedColor);
    }
}

// 设置背景颜色
function setBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

// 加载用户保存的名字
function loadUserName() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        updateDiaryTitle(savedName);
    }
}

// 更新日记本标题
function updateDiaryTitle(name) {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.textContent = `${name}的天天日记本`;
    }
    // 更新页面标题
    document.title = `${name}的天天日记本 - 日记详情`;
}