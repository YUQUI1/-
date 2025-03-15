document.addEventListener('DOMContentLoaded', function() {
    // 设置日期输入框的默认值为今天
    const dateInput = document.getElementById('date');
    dateInput.valueAsDate = new Date();

    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    
    // 如果有编辑ID，则加载对应的日记
    if (editId) {
        loadEntry(editId);
        document.getElementById('formTitle').textContent = '编辑日记';
    }
    
    // 加载用户保存的背景颜色
    loadBackgroundColor();
    
    // 加载用户保存的名字
    loadUserName();

    // 处理表单提交
    document.getElementById('diaryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取标签并转换为数组
        const tagsInput = document.getElementById('tags').value;
        const tagsArray = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        const formData = {
            date: document.getElementById('date').value,
            title: document.getElementById('title').value,
            mood: document.getElementById('mood').value,
            content: document.getElementById('content').value,
            tags: tagsArray
        };

        const editId = document.getElementById('editId').value;
        
        let url = '/api/entries';
        let method = 'POST';
        
        // 如果是编辑模式，则使用PUT请求
        if (editId) {
            url = `/api/entries/${editId}`;
            method = 'PUT';
        }

        // 发送数据到服务器
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // 保存成功后返回主页
            window.location.href = '/';
        })
        .catch(error => console.error('Error:', error));
    });

    // 取消编辑按钮事件
    document.getElementById('cancelButton').addEventListener('click', function() {
        window.location.href = '/';
    });
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
    document.title = `${name}的天天日记本 - 编辑`;
}

// 加载日记条目
function loadEntry(id) {
    fetch(`/api/entries`)
        .then(response => response.json())
        .then(entries => {
            const entry = entries.find(e => e.id === parseInt(id));
            if (entry) {
                // 填充表单
                document.getElementById('editId').value = entry.id;
                document.getElementById('date').value = entry.date;
                document.getElementById('title').value = entry.title || '';
                document.getElementById('mood').value = entry.mood;
                document.getElementById('content').value = entry.content;
                
                // 填充标签
                if (entry.tags && entry.tags.length > 0) {
                    document.getElementById('tags').value = entry.tags.join(',');
                } else {
                    document.getElementById('tags').value = '';
                }
                
                // 更改按钮文本和显示取消按钮
                document.getElementById('saveButton').textContent = '更新日记';
                document.getElementById('cancelButton').style.display = 'inline-block';
            }
        })
        .catch(error => console.error('Error:', error));
}