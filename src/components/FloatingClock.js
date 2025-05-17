class FloatingClock {
    constructor() {
        this.timer = null;
        this.pomodoroTimer = null;
        this.isPomodoroRunning = false;
        this.sessionDuration = 25; // minutes
        this.breakDuration = 5;    // minutes
        this.remaining = 0;
        this.isBreak = false;

        // 初始化音效
        this.notificationSound = new Audio();
        this.notificationSound.src = './src/assets/sounds/notification.mp3';
        this.notificationSound.load();
        this.notificationSound.volume = 0.5;
    }

    render() {
        // 建立浮動時鐘
        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.right = '24px';
        this.container.style.bottom = '24px';
        this.container.style.background = '#2d2d30';  // 改為深色背景
        this.container.style.border = '1px solid #404040';  // 改為深色邊框
        this.container.style.borderRadius = '8px';
        this.container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';  // 加深陰影
        this.container.style.padding = '12px 20px';
        this.container.style.zIndex = '9999';
        this.container.style.cursor = 'pointer';
        this.container.style.transition = 'box-shadow 0.2s';

        this.clockText = document.createElement('span');
        this.clockText.style.fontWeight = 'bold';
        this.clockText.style.color = '#e0e0e0';  // 改為亮色文字
        this.container.appendChild(this.clockText);

        // 蕃茄鐘面板
        this.pomodoroPanel = document.createElement('div');
        this.pomodoroPanel.style.display = 'none';
        this.pomodoroPanel.style.position = 'absolute';
        this.pomodoroPanel.style.right = '0';
        this.pomodoroPanel.style.bottom = '48px';
        this.pomodoroPanel.style.background = '#2d2d30';  // 改為深色背景
        this.pomodoroPanel.style.border = '1px solid #404040';  // 改為深色邊框
        this.pomodoroPanel.style.borderRadius = '8px';
        this.pomodoroPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';  // 加深陰影
        this.pomodoroPanel.style.padding = '16px';
        this.pomodoroPanel.style.width = '220px';
        this.pomodoroPanel.style.transform = 'translateY(20px)';
        this.pomodoroPanel.style.opacity = '0';
        this.pomodoroPanel.style.transition = 'transform 0.3s cubic-bezier(.4,2,.6,1), opacity 0.3s cubic-bezier(.4,2,.6,1)';

        // 輸入設定
        const sessionLabel = document.createElement('label');
        sessionLabel.textContent = '工作(分鐘): ';
        sessionLabel.style.color = '#e0e0e0';  // 修改標籤文字顏色
        this.sessionInput = document.createElement('input');
        this.sessionInput.type = 'number';
        this.sessionInput.value = this.sessionDuration;
        this.sessionInput.style.width = '40px';
        this.sessionInput.style.background = '#23283a';  // 深色輸入框背景
        this.sessionInput.style.color = '#e0e0e0';      // 亮色文字
        this.sessionInput.style.border = '1px solid #404040';
        sessionLabel.appendChild(this.sessionInput);

        const breakLabel = document.createElement('label');
        breakLabel.textContent = ' 休息(分鐘): ';
        breakLabel.style.color = '#e0e0e0';  // 修改標籤文字顏色
        this.breakInput = document.createElement('input');
        this.breakInput.type = 'number';
        this.breakInput.value = this.breakDuration;
        this.breakInput.style.width = '40px';
        this.breakInput.style.background = '#23283a';   // 深色輸入框背景
        this.breakInput.style.color = '#e0e0e0';        // 亮色文字
        this.breakInput.style.border = '1px solid #404040';
        breakLabel.appendChild(this.breakInput);

        // 計時顯示
        this.pomodoroStatus = document.createElement('div');
        this.pomodoroStatus.style.margin = '12px 0';
        this.pomodoroStatus.style.color = '#e0e0e0';  // 修改狀態文字顏色

        // 控制按鈕
        this.startBtn = document.createElement('button');
        this.startBtn.textContent = '開始';
        this.startBtn.addEventListener('click', () => this.startPomodoro());

        this.stopBtn = document.createElement('button');
        this.stopBtn.textContent = '停止';
        this.stopBtn.style.marginLeft = '8px';
        this.stopBtn.addEventListener('click', () => this.stopPomodoro());

        // 組合面板
        this.pomodoroPanel.appendChild(sessionLabel);
        this.pomodoroPanel.appendChild(breakLabel);
        this.pomodoroPanel.appendChild(this.pomodoroStatus);
        this.pomodoroPanel.appendChild(this.startBtn);
        this.pomodoroPanel.appendChild(this.stopBtn);

        this.container.appendChild(this.pomodoroPanel);

        // 點擊切換顯示/隱藏
        let panelVisible = false;
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
            panelVisible = !panelVisible;
            if (panelVisible) {
                this.pomodoroPanel.style.display = 'block';
                void this.pomodoroPanel.offsetWidth;
                this.pomodoroPanel.style.transform = 'translateY(0)';
                this.pomodoroPanel.style.opacity = '1';
                this.container.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
            } else {
                this.pomodoroPanel.style.transform = 'translateY(20px)';
                this.pomodoroPanel.style.opacity = '0';
                this.container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                setTimeout(() => {
                    if (!panelVisible) this.pomodoroPanel.style.display = 'none';
                }, 300);
            }
        });

        // 點擊 panel 內部不關閉
        this.pomodoroPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 點擊其他地方自動關閉
        document.addEventListener('click', () => {
            if (panelVisible) {
                panelVisible = false;
                this.pomodoroPanel.style.transform = 'translateY(20px)';
                this.pomodoroPanel.style.opacity = '0';
                this.container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                setTimeout(() => {
                    if (!panelVisible) this.pomodoroPanel.style.display = 'none';
                }, 300);
            }
        });

        this.updateClock();
        this.timer = setInterval(() => this.updateClock(), 1000);

        return this.container;
    }

    updateClock() {
        const now = new Date();
        this.clockText.textContent = now.toLocaleString();
        if (this.isPomodoroRunning) {
            this.updatePomodoroStatus();
        }
    }

    updateTime() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        this.element.textContent = `${month}${day} ${hours}:${minutes}:${seconds}`;
    }

    startPomodoro() {
        this.sessionDuration = parseInt(this.sessionInput.value) || 25;
        this.breakDuration = parseInt(this.breakInput.value) || 5;
        this.isPomodoroRunning = true;
        this.isBreak = false;
        this.remaining = this.sessionDuration * 60;
        this.updatePomodoroStatus();
        if (this.pomodoroTimer) clearInterval(this.pomodoroTimer);
        this.pomodoroTimer = setInterval(() => this.tick(), 1000);
    }

    stopPomodoro() {
        this.isPomodoroRunning = false;
        if (this.pomodoroTimer) clearInterval(this.pomodoroTimer);
        this.pomodoroStatus.textContent = '';
    }

    tick() {
        if (this.remaining > 0) {
            this.remaining--;
            this.updatePomodoroStatus();
        } else {
            if (!this.isBreak) {
                this.isBreak = true;
                this.remaining = this.breakDuration * 60;
                this.pomodoroStatus.textContent = '休息時間開始！';
                // 播放休息開始音效
                this.notificationSound.currentTime = 0;
                this.notificationSound.play().catch(error => {
                    console.error('音效播放失敗:', error);
                });
            } else {
                this.stopPomodoro();
                this.pomodoroStatus.textContent = '蕃茄鐘結束！';
                // 播放結束音效
                this.notificationSound.currentTime = 0;
                this.notificationSound.play().catch(error => {
                    console.error('音效播放失敗:', error);
                });
            }
        }
    }

    updatePomodoroStatus() {
        const min = String(Math.floor(this.remaining / 60)).padStart(2, '0');
        const sec = String(this.remaining % 60).padStart(2, '0');
        this.pomodoroStatus.textContent = this.isBreak
            ? `休息中：${min}:${sec}`
            : `工作中：${min}:${sec}`;
    }
}

export default FloatingClock;