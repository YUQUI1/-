document.addEventListener('DOMContentLoaded', function() {
    // 设置日期输入框的默认值为今天
    const dateInput = document.getElementById('date');
    dateInput.valueAsDate = new Date();

    // 加载所有日记条目
    loadEntries();
    
    // 加载所有标签
    loadTags();
    
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
            // 清空表单并重置为添加模式
            resetForm();
            // 重新加载所有条目
            loadEntries();
            // 重新加载所有标签
            loadTags();
        })
        .catch(error => console.error('Error:', error));
    });

    // 取消编辑按钮事件
    document.getElementById('cancelButton').addEventListener('click', function() {
        resetForm();
    });

    // 搜索按钮事件
    document.getElementById('searchButton').addEventListener('click', function() {
        const keyword = document.getElementById('searchKeyword').value.trim();
        if (keyword) {
            searchEntries(keyword);
        } else {
            loadEntries();
        }
    });
    
    // 回车键触发搜索
    document.getElementById('searchKeyword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('searchButton').click();
        }
    });

    // 筛选按钮事件
    document.getElementById('filterButton').addEventListener('click', function() {
        const date = document.getElementById('filterDate').value;
        const mood = document.getElementById('filterMood').value;
        const tag = document.getElementById('filterTag').value;
        filterEntries(date, mood, tag);
    });

    // 重置筛选按钮事件
    document.getElementById('resetFilterButton').addEventListener('click', function() {
        document.getElementById('filterDate').value = '';
        document.getElementById('filterMood').value = '';
        document.getElementById('filterTag').value = '';
        loadEntries();
    });
    
    // 移除背景颜色选择器相关事件
});

// 重置表单为添加模式
function resetForm() {
    document.getElementById('diaryForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('saveButton').textContent = '保存日记';
    document.getElementById('cancelButton').style.display = 'none';
}

// 加载所有日记条目
function loadEntries() {
    fetch('/api/entries')
        .then(response => response.json())
        .then(entries => {
            displayEntries(entries);
        })
        .catch(error => console.error('Error:', error));
}

// 加载所有标签
function loadTags() {
    fetch('/api/tags')
        .then(response => response.json())
        .then(tags => {
            const filterTagSelect = document.getElementById('filterTag');
            // 清空除了第一个选项外的所有选项
            while (filterTagSelect.options.length > 1) {
                filterTagSelect.remove(1);
            }
            
            // 添加标签选项
            tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                filterTagSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// 搜索日记条目
function searchEntries(keyword) {
    fetch(`/api/entries/search?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(entries => {
            displayEntries(entries);
        })
        .catch(error => console.error('Error:', error));
}

// 筛选日记条目
function filterEntries(date, mood, tag) {
    let url = '/api/entries/filter?';
    
    if (date) {
        url += `date=${date}`;
    }
    
    if (mood) {
        url += date ? `&mood=${mood}` : `mood=${mood}`;
    }
    
    if (tag) {
        url += (date || mood) ? `&tag=${encodeURIComponent(tag)}` : `tag=${encodeURIComponent(tag)}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(entries => {
            displayEntries(entries);
        })
        .catch(error => console.error('Error:', error));
}

// 显示日记条目
function displayEntries(entries) {
    const entriesDiv = document.getElementById('entries');
    if (entries.length === 0) {
        entriesDiv.innerHTML = '<p class="no-entries">暂无日记</p>';
        return;
    }
    
    entriesDiv.innerHTML = entries.map(entry => {
        // 处理标签显示
        const tagsHtml = entry.tags && entry.tags.length > 0 
            ? `<div class="tags">${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` 
            : '';
            
        return `
        <div class="diary-entry" data-id="${entry.id}">
            <div class="entry-header">
                <div class="date">${formatDate(entry.date)}</div>
                <div class="mood">${entry.mood}</div>
                <div class="entry-actions">
                    <button class="edit-btn" onclick="editEntry(${entry.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteEntry(${entry.id})">删除</button>
                </div>
            </div>
            <h3 class="entry-title" onclick="viewEntry(${entry.id})" style="cursor: pointer;">${entry.title || ''}</h3>
            <div class="content" onclick="viewEntry(${entry.id})" style="cursor: pointer;">${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}</div>
            ${tagsHtml}
        </div>
        `;
    }).join('');
}

// 查看日记详情
function viewEntry(id) {
    window.location.href = `/entry/${id}`;
}

// 编辑日记条目
function editEntry(id) {
    window.location.href = `/edit/${id}?id=${id}`;
}

// 删除日记条目
function deleteEntry(id) {
    if (confirm('确定要删除这篇日记吗？')) {
        fetch(`/api/entries/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            loadEntries();
            loadTags(); // 重新加载标签，因为删除日记可能会影响标签列表
        })
        .catch(error => console.error('Error:', error));
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

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
    document.title = `${name}的天天日记本`;
    
    // 更新欢迎文本中的标题
    const welcomeTitle = document.querySelector('.welcome-section h2');
    if (welcomeTitle) {
        welcomeTitle.textContent = `欢迎使用${name}的天天日记本`;
    }
}