class ConfirmDialog {
    static activeDialog = null;

    static show(message, onConfirm, onCancel) {
        if (this.activeDialog) {
            return;
        }

        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="message">${message}</div>
            <div class="buttons">
                <button class="confirm-btn">Confirm</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        this.activeDialog = dialog;
        
        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        
        const handleConfirm = () => {
            onConfirm();
            cleanup();
        };

        const handleCancel = () => {
            onCancel();
            cleanup();
        };

        const cleanup = () => {
            dialog.remove();
            this.activeDialog = null;
            document.removeEventListener('keydown', handleKeyDown);
        };

        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;

        // 改用 keydown 而不是 keypress，並防止事件冒泡
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();  // 防止事件冒泡
                e.stopPropagation();  // 確保其他監聽器不會收到這個事件
                handleConfirm();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                handleCancel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        confirmBtn.focus();
    }
}

export default ConfirmDialog;