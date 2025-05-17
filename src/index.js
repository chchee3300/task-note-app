import FloatingClock from './components/FloatingClock.js';
import TaskChecklist from './components/TaskChecklist.js';
import TimestampNotes from './components/TimestampNotes.js';
import { getRecord, saveRecord } from './utils/db.js';

// 創建音效實例並預加載
const notificationSound = new Audio();
notificationSound.src = './src/assets/sounds/notification.mp3';
notificationSound.load(); // 預加載音效

// 測試音效是否可以播放
async function testSound() {
    try {
        await notificationSound.play();
        console.log('音效播放成功');
    } catch (error) {
        console.error('音效播放失敗:', error);
    }
}

// 把音效播放封裝成一個函數
function playSound() {
    notificationSound.currentTime = 0; // 重置音效時間
    return notificationSound.play().catch(error => {
        console.error('音效播放失敗:', error);
    });
}

function getFileName() {
    const params = new URLSearchParams(window.location.search);
    return params.get('file');
}

class App {
    constructor(fileName) {
        this.fileName = fileName;
        this.taskChecklist = null;
        this.timestampNotes = null;
    }

    playNotificationSound() {
        playSound();
    }

    async init() {
        try {
            const data = await getRecord(this.fileName);

            // 初始化並設定 onChange 事件
            this.taskChecklist = new TaskChecklist(data.tasks || []);
            this.timestampNotes = new TimestampNotes(this.taskChecklist, data.notes || []);

            // 綁定儲存事件
            this.taskChecklist.onChange = () => this.save();
            this.timestampNotes.onChange = () => this.save();

            this.render();
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    async save() {
        try {
            await saveRecord(this.fileName, {
                tasks: this.taskChecklist.tasks,
                notes: this.timestampNotes.notes
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    render() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';

        // 直接使用 TaskChecklist 和 TimestampNotes 的 render 結果
        const checklistContainer = this.taskChecklist.render();
        checklistContainer.className = 'checklist-container';

        const notesContainer = this.timestampNotes.render();
        notesContainer.className = 'notes-container';

        appContainer.appendChild(checklistContainer);
        appContainer.appendChild(notesContainer);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const file = getFileName();
    if (!file) {
        window.location.href = 'home.html';
        return;
    }
    const app = new App(file);
    await app.init();

    const clock = new FloatingClock();
    document.body.appendChild(clock.render());
});