class TaskChecklist {
    constructor(initialTasks = []) {
        this.tasks = initialTasks;
        this.visible = true;
        this.onChange = null;  // 確保有這個屬性
    }

    addTask(task) {
        this.tasks.push({ text: task, done: false });
        this.update();
        if (this.onChange) this.onChange();
    }

    toggleTask(index) {
        this.tasks[index].done = !this.tasks[index].done;
        this.update();
        if (this.onChange) this.onChange();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.update();
        if (this.onChange) this.onChange();
    }

    deleteAllTasks() {
        this.tasks = [];
        this.update();
        if (this.onChange) this.onChange();
    }

    toggleList() {
        this.visible = !this.visible;
        this.update();
    }

    render() {
        const container = document.createElement('div');
        container.className = 'checklist-container';

        // 輸入框組
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter new task...';

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.addTask(input.value.trim());
                input.value = '';
            }
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = () => {
            if (input.value.trim()) {
                this.addTask(input.value.trim());
                input.value = '';
            }
        };

        inputGroup.appendChild(input);
        inputGroup.appendChild(addButton);
        container.appendChild(inputGroup);

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
        deleteAllBtn.addEventListener('click', () => this.deleteAllTasks());

        controls.appendChild(toggleBtn);
        controls.appendChild(deleteAllBtn);

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
        this.tasks.forEach((task, idx) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.justifyContent = 'space-between';
            
            // 將右鍵選單移到 li 元素上
            li.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const newText = prompt('Edit task:', task.text);
                if (newText !== null && newText.trim() !== '') {
                    this.tasks[idx].text = newText.trim();
                    this.update();
                    if (this.onChange) this.onChange();
                }
            });

            const label = document.createElement('label');
            label.style.flex = '1';
            label.style.display = 'flex';
            label.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done;
            checkbox.addEventListener('click', (e) => {
                if (e.target === checkbox) {
                    this.toggleTask(idx);
                }
            });

            const span = document.createElement('span');
            span.textContent = task.text;
            span.style.marginLeft = '8px';
            span.style.textDecoration = task.done ? 'line-through' : 'none';

            label.appendChild(checkbox);
            label.appendChild(span);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.marginLeft = '12px';
            deleteBtn.addEventListener('click', () => this.deleteTask(idx));

            li.appendChild(label);
            li.appendChild(deleteBtn);
            this.list.appendChild(li);
        });

        if (this.onChange) this.onChange();
    }
}

export default TaskChecklist;