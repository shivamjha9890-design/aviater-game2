// Pleasant, Non-Annoying Sound Effects
// Optimized for user engagement without irritation

const GameSounds = {
    enabled: true,
    
    // Gentle click for bet placement
    playBetSound: function() {
        if (!this.enabled) return;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Soft C note (262 Hz) - pleasant and subtle
            oscillator.frequency.value = 262;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.08);
        } catch (e) {
            console.log('Audio not available');
        }
    },
    
    // Pleasant "cha-ching" for cashout - rewarding but not loud
    playCashoutSound: function() {
        if (!this.enabled) return;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Two-note ascending chime
            const notes = [
                { freq: 659, time: 0 },     // E
                { freq: 784, time: 0.05 }   // G
            ];
            
            notes.forEach(note => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = note.freq;
                oscillator.type = 'triangle'; // Warm, pleasant tone
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + note.time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + note.time + 0.2);
                
                oscillator.start(audioContext.currentTime + note.time);
                oscillator.stop(audioContext.currentTime + note.time + 0.2);
            });
            
            // Gentle vibration (if available)
            if ('vibrate' in navigator) {
                navigator.vibrate(80);
            }
        } catch (e) {
            console.log('Audio not available');
        }
    },
    
    // Gentle descending tone for crash - not harsh or stressful
    playCrashSound: function() {
        if (!this.enabled) return;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Soft descending tone - informative but not jarring
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.2);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            
            // Very brief, subtle vibration
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        } catch (e) {
            console.log('Audio not available');
        }
    },
    
    // Celebratory sound for big wins - pleasant melody
    playBigWinSound: function() {
        if (!this.enabled) return;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Pleasant ascending melody - C-E-G-C (major chord)
            const melody = [
                { freq: 523, time: 0 },      // C5
                { freq: 659, time: 0.08 },   // E5
                { freq: 784, time: 0.16 },   // G5
                { freq: 1047, time: 0.24 }   // C6
            ];
            
            melody.forEach(note => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = note.freq;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.12, audioContext.currentTime + note.time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + note.time + 0.15);
                
                oscillator.start(audioContext.currentTime + note.time);
                oscillator.stop(audioContext.currentTime + note.time + 0.15);
            });
            
            // Satisfying vibration pattern
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
        } catch (e) {
            console.log('Audio not available');
        }
    },
    
    // Subtle tick sound during multiplier increase
    playTickSound: function() {
        if (!this.enabled) return;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Very soft, high-pitched tick
            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.03, audioContext.currentTime); // Very quiet
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (e) {
            console.log('Audio not available');
        }
    },
    
    // Toggle sound on/off
    toggle: function() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSounds;
}
