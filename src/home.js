import ConfirmDialog from './components/ConfirmDialog.js';
import { getRecord, saveRecord, deleteRecord, getAllFiles } from './utils/db.js';

async function renderList() {
    const list = document.getElementById('recordList');
    list.innerHTML = '';
    
    try {
        const records = await getAllFiles();
        if (records.length === 0) {
            list.innerHTML = '<div class="no-records">尚無記錄檔案</div>';
            return;
        }

        records.forEach(name => {
            const div = document.createElement('div');
            div.className = 'record-item';
            div.innerHTML = `
                <span class="record-name">${name}</span>
                <div>
                    <button class="open-btn">開啟</button>
                    <button class="delete-btn">刪除</button>
                </div>
            `;

            div.querySelector('.record-name').addEventListener('contextmenu', async (e) => {
                e.preventDefault();
                const newName = prompt('編輯檔案名稱:', name);
                if (newName && newName.trim() && newName !== name) {
                    try {
                        const existingRecords = await getAllFiles();
                        if (existingRecords.includes(newName.trim())) {
                            alert('檔案名稱已存在');
                            return;
                        }
                        
                        const oldData = await getRecord(name);
                        await saveRecord(newName.trim(), oldData);
                        await deleteRecord(name);
                        await renderList();
                    } catch (error) {
                        console.error('Error renaming file:', error);
                        alert('重新命名失敗');
                    }
                }
            });

            div.querySelector('.open-btn').onclick = () => {
                window.location.href = `index.html?file=${encodeURIComponent(name)}`;
            };

            div.querySelector('.delete-btn').onclick = async () => {
                ConfirmDialog.show(
                    '確定要刪除這個檔案嗎？',
                    async () => {
                        await deleteRecord(name);
                        await renderList();
                    },
                    () => {}
                );
            };
            
            list.appendChild(div);
        });
    } catch (error) {
        console.error('Error rendering list:', error);
        list.innerHTML = '<div class="error">載入失敗</div>';
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