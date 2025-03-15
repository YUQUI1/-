from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime
import os

app = Flask(__name__)

# 确保数据文件存在
DIARY_FILE = 'diary_entries.json'
if not os.path.exists(DIARY_FILE):
    with open(DIARY_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False)

def load_entries():
    with open(DIARY_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_entries(entries):
    with open(DIARY_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)

# 获取下一个可用ID
def get_next_id(entries):
    if not entries:
        return 1
    return max(entry['id'] for entry in entries) + 1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/entries', methods=['GET'])
def get_entries():
    entries = load_entries()
    return jsonify(entries)

@app.route('/api/entries', methods=['POST'])
def add_entry():
    data = request.json
    entries = load_entries()
    
    new_entry = {
        'id': get_next_id(entries),
        'title': data['title'],
        'content': data['content'],
        'mood': data['mood'],
        'date': data['date'],
        'tags': data.get('tags', [])
    }
    
    entries.append(new_entry)
    save_entries(entries)
    
    return jsonify(new_entry)

@app.route('/api/entries/<int:entry_id>', methods=['PUT'])
def update_entry(entry_id):
    data = request.json
    entries = load_entries()
    
    for entry in entries:
        if entry['id'] == entry_id:
            entry['title'] = data['title']
            entry['content'] = data['content']
            entry['mood'] = data['mood']
            entry['date'] = data['date']
            entry['tags'] = data.get('tags', entry.get('tags', []))
            save_entries(entries)
            return jsonify(entry)
    
    return jsonify({'error': '日记不存在'}), 404

@app.route('/api/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    entries = load_entries()
    
    for i, entry in enumerate(entries):
        if entry['id'] == entry_id:
            deleted_entry = entries.pop(i)
            save_entries(entries)
            return jsonify(deleted_entry)
    
    return jsonify({'error': '日记不存在'}), 404

@app.route('/api/entries/filter', methods=['GET'])
def filter_entries():
    entries = load_entries()
    date = request.args.get('date')
    mood = request.args.get('mood')
    tag = request.args.get('tag')
    
    if date:
        entries = [entry for entry in entries if entry['date'] == date]
    
    if mood:
        entries = [entry for entry in entries if entry['mood'] == mood]
        
    if tag:
        entries = [entry for entry in entries if tag in entry.get('tags', [])]
    
    return jsonify(entries)

@app.route('/api/entries/search', methods=['GET'])
def search_entries():
    keyword = request.args.get('keyword', '').lower()
    if not keyword:
        return jsonify([])
        
    entries = load_entries()
    results = [entry for entry in entries if 
              keyword in entry['content'].lower() or 
              (entry.get('title') and keyword in entry['title'].lower())]
    return jsonify(results)

@app.route('/api/tags', methods=['GET'])
def get_tags():
    entries = load_entries()
    all_tags = set()
    
    for entry in entries:
        tags = entry.get('tags', [])
        all_tags.update(tags)
    
    return jsonify(list(all_tags))

@app.route('/entry/<int:entry_id>')
def view_entry(entry_id):
    entries = load_entries()
    
    for entry in entries:
        if entry['id'] == entry_id:
            # 格式化日期以便在详情页面显示
            date_obj = datetime.strptime(entry['date'], '%Y-%m-%d')
            entry['date_formatted'] = date_obj.strftime('%Y年%m月%d日')
            return render_template('detail.html', entry=entry)
    
    return jsonify({'error': '日记不存在'}), 404

@app.route('/edit')
def edit():
    return render_template('edit.html')

@app.route('/edit/<int:entry_id>')
def edit_entry(entry_id):
    return render_template('edit.html')

@app.route('/diary')
def diary():
    return render_template('diary.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

if __name__ == '__main__':
    app.run(debug=True, port=5050)