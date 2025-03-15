document.addEventListener('DOMContentLoaded', function() {
    // 加载用户保存的背景颜色
    loadBackgroundColor();
    
    // 加载用户保存的名字
    loadUserName();
    
    // 背景颜色选择器事件
    document.getElementById('bgColorPicker').addEventListener('input', function(e) {
        const color = e.target.value;
        setBackgroundColor(color);
        // 保存颜色到localStorage
        localStorage.setItem('bgColor', color);
    });
    
    // 重置背景颜色按钮事件
    document.getElementById('resetColorButton').addEventListener('click', function() {
        const defaultColor = '#ffeef2';
        setBackgroundColor(defaultColor);
        document.getElementById('bgColorPicker').value = defaultColor;
        // 保存默认颜色到localStorage
        localStorage.setItem('bgColor', defaultColor);
    });
    
    // 保存用户名按钮事件
    document.getElementById('saveNameButton').addEventListener('click', function() {
        const userName = document.getElementById('userNameInput').value.trim();
        if (userName) {
            // 保存用户名到localStorage
            localStorage.setItem('userName', userName);
            alert('保存成功！');
            updateDiaryTitle(userName);
        } else {
            alert('请输入您的名字！');
        }
    });
});

// 加载用户保存的背景颜色
function loadBackgroundColor() {
    const savedColor = localStorage.getItem('bgColor');
    if (savedColor) {
        setBackgroundColor(savedColor);
        document.getElementById('bgColorPicker').value = savedColor;
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
        document.getElementById('userNameInput').value = savedName;
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
    document.title = `${name}的天天日记本`;
    
    // 更新欢迎文本中的标题
    const welcomeTitle = document.querySelector('.welcome-section h2');
    if (welcomeTitle) {
        welcomeTitle.textContent = `欢迎使用${name}的天天日记本`;
    }
}