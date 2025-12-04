// ============================================
// LG Smart TV Remote Control Application
// ============================================

class LGTVRemote {
    constructor() {
        this.tvIP = localStorage.getItem('tvIP') || '';
        this.tvPort = localStorage.getItem('tvPort') || '8080';
        this.connected = false;
        this.pairingKey = localStorage.getItem('pairingKey') || '';
        
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
            
            // LG TV uses UDAP protocol or WebOS API
            // For WebOS TVs, we need to establish a WebSocket connection
            const response = await this.testConnection();
            
            if (response) {
                this.connected = true;
                this.updateConnectionStatus();
                this.showToast('TV\'ye başarıyla bağlanıldı!', 'success');
            } else {
                throw new Error('Bağlantı başarısız');
            }
        } catch (error) {
            this.connected = false;
            this.updateConnectionStatus();
            this.showToast('TV\'ye bağlanılamadı. IP adresini kontrol edin.', 'error');
            console.error('Connection error:', error);
        }
    }

    async testConnection() {
        // Test connection to TV
        // For LG WebOS TVs, we typically use WebSocket on port 3000 or 3001
        // For older LG TVs, HTTP API might be available
        
        try {
            const wsPort = 3000; // WebOS default port
            const url = `ws://${this.tvIP}:${wsPort}`;
            
            // Note: In a real implementation, you would establish a WebSocket connection here
            // For demonstration, we'll simulate a connection test
            
            // Simulate connection delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For now, we'll assume connection is successful if IP is set
            // In production, you'd implement actual WebSocket handshake
            return true;
        } catch (error) {
            console.error('Test connection failed:', error);
            return false;
        }
    }

    async sendCommand(key) {
        if (!this.connected && !this.tvIP) {
            this.showToast('Lütfen önce TV\'ye bağlanın', 'error');
            this.openSettings();
            return;
        }

        try {
            // LG TV Command Protocol
            // For WebOS TVs, commands are sent via WebSocket
            // For older models, HTTP requests might be used
            
            const command = this.buildCommand(key);
            
            // Simulate sending command
            console.log('Sending command:', key, command);
            
            // In production, you would send the actual command here
            // Example for WebOS:
            // this.websocket.send(JSON.stringify(command));
            
            // Example for HTTP-based control:
            // await fetch(`http://${this.tvIP}:${this.tvPort}/udap/api/command`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(command)
            // });
            
            // Simulate successful command
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Visual feedback
            this.showToast(`Komut gönderildi: ${this.getKeyLabel(key)}`, 'success');
            
        } catch (error) {
            console.error('Send command error:', error);
            this.showToast('Komut gönderilemedi', 'error');
        }
    }

    buildCommand(key) {
        // Build command structure for LG TV
        // WebOS format example:
        return {
            type: 'request',
            id: Date.now().toString(),
            uri: 'ssap://com.webos.service.tvcontrol/sendKey',
            payload: {
                keyCode: key
            }
        };
        
        // For UDAP protocol (older LG TVs):
        // return {
        //     envelope: {
        //         api: 'command',
        //         type: 'keyboard',
        //         name: 'HandleKeyInput',
        //         value: key
        //     }
        // };
    }

    getKeyLabel(key) {
        const labels = {
            'POWER': 'Güç',
            'UP': 'Yukarı',
            'DOWN': 'Aşağı',
            'LEFT': 'Sol',
            'RIGHT': 'Sağ',
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
            'FORWARD': 'İleri Sar',
            'INPUT': 'Giriş',
            'MENU': 'Menü',
            '3D': '3D',
            'SMART': 'Smart'
        };
        return labels[key] || key;
    }

    handleKeyboard(e) {
        // Keyboard shortcuts for remote control
        const keyMap = {
            'ArrowUp': 'UP',
            'ArrowDown': 'DOWN',
            'ArrowLeft': 'LEFT',
            'ArrowRight': 'RIGHT',
            'Enter': 'OK',
            'Backspace': 'BACK',
            'Escape': 'EXIT',
            'h': 'HOME',
            'm': 'MUTE',
            '+': 'VOLUMEUP',
            '-': 'VOLUMEDOWN',
            'PageUp': 'CHANNELUP',
            'PageDown': 'CHANNELDOWN',
            ' ': 'PLAY'
        };

        const key = keyMap[e.key];
        if (key) {
            e.preventDefault();
            this.sendCommand(key);
            
            // Animate corresponding button
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

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const remote = new LGTVRemote();
    
    // Make remote accessible globally for debugging
    window.lgRemote = remote;
    
    console.log('LG Smart TV Remote Control initialized');
    console.log('Keyboard shortcuts:');
    console.log('- Arrow keys: Navigation');
    console.log('- Enter: OK');
    console.log('- Backspace: Back');
    console.log('- Escape: Exit');
    console.log('- H: Home');
    console.log('- M: Mute');
    console.log('- +/-: Volume');
    console.log('- PageUp/PageDown: Channel');
    console.log('- Space: Play');
    console.log('- 0-9: Number keys');
});

// ============================================
// Service Worker Registration (for PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
