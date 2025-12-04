// ============================================
// LG Smart TV Remote Control Application
// NetCast 4.0 - HTTP UDAP Protocol
// For LG 47LA860V and similar models
// ============================================

class LGTVRemote {
    constructor() {
        this.tvIP = localStorage.getItem('tvIP') || '';
        this.tvPort = localStorage.getItem('tvPort') || '8080';
        this.connected = false;
        this.sessionId = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.updateConnectionStatus();

        // Auto-connect if settings exist
        if (this.tvIP) {
            this.connect();
        }
    }

    setupEventListeners() {
        // Settings panel
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.closeSettings();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // All control buttons
        const buttons = document.querySelectorAll('[data-key]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const key = e.currentTarget.getAttribute('data-key');
                this.sendCommand(key);
                this.animateButton(e.currentTarget);
            });
        });

        // Close settings on backdrop click
        document.getElementById('settingsPanel').addEventListener('click', (e) => {
            if (e.target.id === 'settingsPanel') {
                this.closeSettings();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    loadSettings() {
        document.getElementById('tvIp').value = this.tvIP;
        document.getElementById('tvPort').value = this.tvPort;
    }

    saveSettings() {
        this.tvIP = document.getElementById('tvIp').value.trim();
        this.tvPort = document.getElementById('tvPort').value.trim() || '8080';

        if (!this.tvIP) {
            this.showToast('Lütfen TV IP adresini girin', 'error');
            return;
        }

        // Validate IP format
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipPattern.test(this.tvIP)) {
            this.showToast('Geçersiz IP adresi formatı', 'error');
            return;
        }

        localStorage.setItem('tvIP', this.tvIP);
        localStorage.setItem('tvPort', this.tvPort);

        this.closeSettings();
        this.connect();
    }

    openSettings() {
        document.getElementById('settingsPanel').classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsPanel').classList.remove('active');
    }

    async connect() {
        if (!this.tvIP) {
            this.showToast('Lütfen önce TV ayarlarını yapın', 'error');
            this.openSettings();
            return;
        }

        try {
            this.showToast('TV\'ye bağlanılıyor...', 'info');

            // Test connection with a simple pairing request
            const pairingData = {
                type: "pairing",
                name: "Uğur İnan - Kumanda",
                port: this.tvPort
            };

            const response = await this.sendUDAPRequest('pairing', pairingData);

            if (response) {
                this.connected = true;
                this.updateConnectionStatus();
                this.showToast('TV\'ye bağlandı! TV ekranında kodu onaylayın.', 'success');
            } else {
                this.connected = true; // Allow commands anyway
                this.updateConnectionStatus();
                this.showToast('Bağlantı kuruldu. Butonları test edin.', 'info');
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.connected = true; // Allow testing anyway
            this.updateConnectionStatus();
            this.showToast('Komutlar gönderilmeye hazır', 'info');
        }
    }

    async sendUDAPRequest(endpoint, data) {
        const url = `http://${this.tvIP}:${this.tvPort}/udap/api/${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/atom+xml',
                },
                body: this.buildUDAPXML(data),
                mode: 'no-cors'
            });

            console.log('UDAP request sent:', endpoint);
            return true;
        } catch (error) {
            console.error('UDAP request failed:', error);
            return false;
        }
    }

    buildUDAPXML(data) {
        // Build UDAP XML format for NetCast
        return `<?xml version="1.0" encoding="utf-8"?>
<envelope>
    <api type="pairing">
        <name>${data.name || 'Web Remote'}</name>
        <value>${data.port || '8080'}</value>
        <port>${data.port || '8080'}</port>
    </api>
</envelope>`;
    }

    async sendCommand(key) {
        if (!this.tvIP) {
            this.showToast('Lütfen önce TV\'ye bağlanın', 'error');
            this.openSettings();
            return;
        }

        try {
            // Send key command via UDAP
            const commandXML = `<?xml version="1.0" encoding="utf-8"?>
<envelope>
    <api type="command">
        <name>HandleKeyInput</name>
        <value>${this.mapKeyToUDAP(key)}</value>
    </api>
</envelope>`;

            const url = `http://${this.tvIP}:${this.tvPort}/udap/api/command`;

            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/atom+xml',
                },
                body: commandXML,
                mode: 'no-cors'
            });

            console.log('Command sent:', this.getKeyLabel(key));

        } catch (error) {
            console.error('Send command error:', error);
        }
    }

    mapKeyToUDAP(key) {
        // Map WebOS keys to UDAP key codes
        const keyMap = {
            'POWER': '1',
            'UP': '2',
            'DOWN': '3',
            'LEFT': '4',
            'RIGHT': '5',
            'ENTER': '6',
            'OK': '6',
            'BACK': '8',
            'HOME': '21',
            'EXIT': '91',
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
            '0': '16', '1': '17', '2': '18', '3': '19', '4': '20',
            '5': '21', '6': '22', '7': '23', '8': '24', '9': '25'
        };

        return keyMap[key] || '6';
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
            'SMART': 'Smart',
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
        };
        return labels[key] || key;
    }

    handleKeyboard(e) {
        // Don't handle keyboard if settings panel is open
        if (document.getElementById('settingsPanel').classList.contains('active')) {
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

        // Number keys
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
        const statusText = statusElement.querySelector('.status-text');

        if (this.connected) {
            statusElement.classList.add('connected');
            statusText.textContent = `Bağlı: ${this.tvIP}`;
        } else {
            statusElement.classList.remove('connected');
            if (this.tvIP) {
                statusText.textContent = 'Bağlantı Kesildi';
            } else {
                statusText.textContent = 'Bağlantı Bekleniyor';
            }
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const remote = new LGTVRemote();
    window.lgRemote = remote;

    console.log('LG 47LA860V Remote Control initialized');
    console.log('NetCast 4.0 - HTTP UDAP Protocol');
    console.log('Keyboard shortcuts enabled');
});
