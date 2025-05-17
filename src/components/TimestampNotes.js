import TaskChecklist from './TaskChecklist.js';

class TimestampNotes {
    constructor(taskChecklistInstance, initialNotes = []) {
        this.notes = initialNotes;
        this.taskChecklist = taskChecklistInstance;
        this.visible = true;
        this.onChange = null;
    }

    addNote(text) {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const time = `${month}${day} ${hours}:${minutes}:${seconds}`;
        
        this.notes.push({
            text,
            time: time
        });
        this.update();
        if (this.onChange) {
            this.onChange();
        }
    }

    deleteNote(index) {
        this.notes.splice(index, 1);
        this.update();
        if (this.onChange) {
            this.onChange();
        }
    }

    deleteAllNotes() {
        this.notes = [];
        this.update();
    }

    toggleList() {
        this.visible = !this.visible;
        this.update();
        if (this.onChange) {
            this.onChange();
        }
    }

    convertToTask(index) {
        const note = this.notes[index];
        this.taskChecklist.addTask(note.text);
    }

    render() {
        const container = document.createElement('div');
        container.className = 'notes-container';

        // 輸入框組
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter new note...';

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.addNote(input.value.trim());
                input.value = '';
            }
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = () => {
            if (input.value.trim()) {
                this.addNote(input.value.trim());
                input.value = '';
            }
        };

        inputGroup.appendChild(input);
        inputGroup.appendChild(addButton);
        container.appendChild(inputGroup);

        // 控制按鈕
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '8px';
        controls.style.marginBottom = '8px';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = this.visible ? 'Hide' : 'Show';
        toggleBtn.addEventListener('click', () => {
            this.toggleList();
            toggleBtn.textContent = this.visible ? 'Hide' : 'Show';
        });

        const deleteAllBtn = document.createElement('button');
        deleteAllBtn.textContent = 'Delete All';
        deleteAllBtn.addEventListener('click', () => this.deleteAllNotes());

        controls.appendChild(toggleBtn);
        controls.appendChild(deleteAllBtn);

        // 筆記列表
        this.list = document.createElement('ul');
        this.update();

        container.appendChild(controls);
        container.appendChild(this.list);

        return container;
    }

    update() {
        if (!this.list) return;
        this.list.innerHTML = '';
        this.list.style.display = this.visible ? '' : 'none';
        this.notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.justifyContent = 'space-between';
            li.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const newText = prompt('Edit note:', note.text);
                if (newText !== null && newText.trim() !== '') {
                    this.notes[index].text = newText.trim();
                    this.update();
                    if (this.onChange) this.onChange();
                }
            });

            const timeSpan = document.createElement('span');
            timeSpan.textContent = note.time; // 直接使用 time，不需要額外添加括號
            timeSpan.style.color = '#888';
            timeSpan.style.fontSize = '0.85em';
            timeSpan.style.marginRight = '-25px';
            timeSpan.style.display = 'inline-block';
            timeSpan.style.minWidth = '120px';  // 確保時間戳記對齊
            timeSpan.style.textAlign = 'left';  // 改為靠左對齊

            const textSpan = document.createElement('span');
            textSpan.textContent = note.text;
            textSpan.style.flex = '1';

            const span = document.createElement('div');
            span.style.display = 'flex';
            span.style.alignItems = 'center';
            span.style.flex = '1';
            span.appendChild(timeSpan);
            span.appendChild(textSpan);

            const convertBtn = document.createElement('button');
            convertBtn.textContent = 'Convert to Task';
            convertBtn.style.marginLeft = '12px';
            convertBtn.addEventListener('click', () => this.convertToTask(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.marginLeft = '12px';
            deleteBtn.addEventListener('click', () => this.deleteNote(index));

            li.appendChild(span);
            li.appendChild(convertBtn);
            li.appendChild(deleteBtn);
            this.list.appendChild(li);
        });

        if (this.onChange) this.onChange();
    }
}

export default TimestampNotes;