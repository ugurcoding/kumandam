// ============================================
// LG Smart TV Remote Control - Smartify Style
// NetCast 4.0 - Direct Command (No Pairing)
// For LG 47LA860V (426a620s-za)
// ============================================

class LGTVRemote {
    constructor() {
        this.tvIP = localStorage.getItem('tvIP') || '';
        this.tvPort = localStorage.getItem('tvPort') || '8080';
        this.connected = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.updateConnectionStatus();

        if (this.tvIP) {
            this.connected = true;
            this.updateConnectionStatus();
        }
    }

    setupEventListeners() {
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('closeSettings')?.addEventListener('click', () => {
            this.closeSettings();
        });

        document.getElementById('saveSettings')?.addEventListener('click', () => {
            this.saveSettings();
        });

        const buttons = document.querySelectorAll('[data-key]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const key = e.currentTarget.getAttribute('data-key');
                this.sendCommand(key);
                this.animateButton(e.currentTarget);
            });
        });

        document.getElementById('settingsPanel')?.addEventListener('click', (e) => {
            if (e.target.id === 'settingsPanel') {
                this.closeSettings();
            }
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    loadSettings() {
        const ipInput = document.getElementById('tvIp');
        const portInput = document.getElementById('tvPort');
        if (ipInput) ipInput.value = this.tvIP;
        if (portInput) portInput.value = this.tvPort;
    }

    saveSettings() {
        this.tvIP = document.getElementById('tvIp')?.value.trim() || '';
        this.tvPort = document.getElementById('tvPort')?.value.trim() || '8080';

        if (!this.tvIP) {
            this.showToast('Lütfen TV IP adresini girin', 'error');
            return;
        }

        localStorage.setItem('tvIP', this.tvIP);
        localStorage.setItem('tvPort', this.tvPort);

        this.connected = true;
        this.updateConnectionStatus();
        this.closeSettings();
        this.showToast('Ayarlar kaydedildi', 'success');
    }

    openSettings() {
        document.getElementById('settingsPanel')?.classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsPanel')?.classList.remove('active');
    }

    async sendCommand(key) {
        if (!this.tvIP) {
            this.showToast('Lütfen önce TV IP adresini girin', 'error');
            this.openSettings();
            return;
        }

        try {
            const keyCode = this.mapKeyToCode(key);

            // Smartify-style direct command (no pairing)
            const url = `http://${this.tvIP}:${this.tvPort}/udap/api/command`;

            const commandXML = `<?xml version="1.0" encoding="utf-8"?>
<envelope>
    <api type="command">
        <name>HandleKeyInput</name>
        <value>${keyCode}</value>
    </api>
</envelope>`;

            // Send command
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/atom+xml',
                },
                body: commandXML,
                mode: 'no-cors'
            }).catch(() => { });

            console.log(`Command sent: ${this.getKeyLabel(key)} (${keyCode})`);

        } catch (error) {
            console.error('Send command error:', error);
        }
    }

    mapKeyToCode(key) {
        // LG NetCast key codes (same as Smartify uses)
        const keyMap = {
            'POWER': '1',
            'UP': '12',
            'DOWN': '13',
            'LEFT': '14',
            'RIGHT': '15',
            'ENTER': '20',
            'OK': '20',
            'BACK': '23',
            'HOME': '21',
            'EXIT': '412',
            'VOLUMEUP': '24',
            'VOLUMEDOWN': '25',
            'MUTE': '26',
            'CHANNELUP': '27',
            'CHANNELDOWN': '28',
            'PLAY': '33',
            'PAUSE': '34',
            'STOP': '35',
            'REWIND': '37',
            'FASTFORWARD': '36',
            'INPUT': '47',
            'MENU': '67',
            '3D': '220',
            'SMART': '105',
            '0': '16',
            '1': '17',
            '2': '18',
            '3': '19',
            '4': '20',
            '5': '21',
            '6': '22',
            '7': '23',
            '8': '24',
            '9': '25'
        };

        return keyMap[key] || '20';
    }

    getKeyLabel(key) {
        const labels = {
            'POWER': 'Güç',
            'UP': 'Yukarı',
            'DOWN': 'Aşağı',
            'LEFT': 'Sol',
            'RIGHT': 'Sağ',
            'ENTER': 'Tamam',
            'OK': 'Tamam',
            'BACK': 'Geri',
            'HOME': 'Ana Sayfa',
            'EXIT': 'Çıkış',
            'VOLUMEUP': 'Ses +',
            'VOLUMEDOWN': 'Ses -',
            'MUTE': 'Sessiz',
            'CHANNELUP': 'Kanal +',
            'CHANNELDOWN': 'Kanal -',
            'PLAY': 'Oynat',
            'PAUSE': 'Duraklat',
            'STOP': 'Durdur',
            'REWIND': 'Geri Sar',
            'FASTFORWARD': 'İleri Sar',
            'INPUT': 'Giriş',
            'MENU': 'Menü',
            '3D': '3D',
            'SMART': 'Smart'
        };
        return labels[key] || key;
    }

    handleKeyboard(e) {
        if (document.getElementById('settingsPanel')?.classList.contains('active')) {
            return;
        }

        const keyMap = {
            'ArrowUp': 'UP',
            'ArrowDown': 'DOWN',
            'ArrowLeft': 'LEFT',
            'ArrowRight': 'RIGHT',
            'Enter': 'ENTER',
            'Backspace': 'BACK',
            'Escape': 'EXIT',
            'h': 'HOME',
            'm': 'MUTE',
            '+': 'VOLUMEUP',
            '=': 'VOLUMEUP',
            '-': 'VOLUMEDOWN',
            'PageUp': 'CHANNELUP',
            'PageDown': 'CHANNELDOWN',
            ' ': 'PLAY'
        };

        const key = keyMap[e.key];
        if (key) {
            e.preventDefault();
            this.sendCommand(key);

            const button = document.querySelector(`[data-key="${key}"]`);
            if (button) {
                this.animateButton(button);
            }
        }

        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            this.sendCommand(e.key);
            const button = document.querySelector(`[data-key="${e.key}"]`);
            if (button) {
                this.animateButton(button);
            }
        }
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connectionStatus');
        const statusText = statusElement?.querySelector('.status-text');

        if (this.connected && statusElement && statusText) {
            statusElement.classList.add('connected');
            statusText.textContent = `Hazır: ${this.tvIP}`;
        } else if (statusElement && statusText) {
            statusElement.classList.remove('connected');
            statusText.textContent = 'IP Adresi Girin';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const remote = new LGTVRemote();
    window.lgRemote = remote;

    console.log('LG 47LA860V Remote - Smartify Style');
    console.log('TV Name: 426a620s-za');
    console.log('Direct command mode (no pairing)');
});
