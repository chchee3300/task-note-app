import ConfirmDialog from './components/ConfirmDialog.js';
import { getRecord, saveRecord, deleteRecord, getAllFiles } from './utils/db.js';

async function renderList() {
    const list = document.getElementById('recordList');
    list.innerHTML = '';
    
    try {
        const files = await getAllFiles();
        if (files.length === 0) {
            list.innerHTML = '<div class="no-records">No records found</div>';
            return;
        }
        
        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'record-item';
            div.innerHTML = `
                <span>${file}</span>
                <div class="actions">
                    <button class="open-btn">Open</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            
            div.querySelector('.open-btn').onclick = () => {
                window.location.href = `index.html?file=${encodeURIComponent(file)}`;
            };
            
            div.querySelector('.delete-btn').onclick = async () => {
                ConfirmDialog.show(
                    'Are you sure you want to delete this record?',
                    async () => {
                        try {
                            await deleteRecord(file);
                            await renderList();
                        } catch (error) {
                            console.error('Failed to delete record:', error);
                        }
                    }
                );
            };
            
            list.appendChild(div);
        });
    } catch (error) {
        console.error('Error rendering list:', error);
        list.innerHTML = '<div class="error">Failed to load records</div>';
    }
}

const addRecord = async () => {
    const input = document.getElementById('newRecordName');
    let name = input.value.trim();
    
    if (!name) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        name = `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
    }
    
    try {
        const records = await getAllFiles();
        if (records.includes(name)) {
            alert('檔案名稱已存在');
            return;
        }
        
        await saveRecord(name, { tasks: [], notes: [] });
        input.value = '';
        await renderList();
    } catch (error) {
        console.error('Error creating file:', error);
        alert('建立檔案失敗');
    }
};

document.getElementById('addRecordBtn').onclick = addRecord;

const inputElement = document.getElementById('newRecordName');

inputElement.addEventListener('focus', function() {
    const handleEnter = async (event) => {
        if (event.key === 'Enter') {
            await addRecord();
        }
    };

    this.addEventListener('keypress', handleEnter);

    this.addEventListener('blur', function() {
        this.removeEventListener('keypress', handleEnter);
    }, { once: true });
});

document.addEventListener('DOMContentLoaded', () => {
    renderList();
});