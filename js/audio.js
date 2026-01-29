// 오디오 시스템 - Web Audio API 사용

class AudioManager {
    constructor() {
        this.context = null;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.5;
        this.sounds = {};
        this.currentMusic = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.masterVolume;

            this.sfxGain = this.context.createGain();
            this.sfxGain.connect(this.masterGain);
            this.sfxGain.gain.value = this.sfxVolume;

            this.musicGain = this.context.createGain();
            this.musicGain.connect(this.masterGain);
            this.musicGain.gain.value = this.musicVolume;

            this.generateSounds();
            this.initialized = true;
        } catch (e) {
            console.error('오디오 초기화 실패:', e);
        }
    }

    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    // 프로시저럴 사운드 생성
    generateSounds() {
        // 권총 발사음
        this.sounds.pistol = this.createGunSound(0.1, 800, 200);

        // 소총 발사음
        this.sounds.rifle = this.createGunSound(0.08, 600, 150);

        // 샷건 발사음
        this.sounds.shotgun = this.createGunSound(0.15, 400, 100);

        // 빈 탄창
        this.sounds.empty = this.createClickSound();

        // 재장전
        this.sounds.reload = this.createReloadSound();

        // 좀비 소리들
        this.sounds.zombieHit = this.createZombieHitSound();
        this.sounds.zombieDeath = this.createZombieDeathSound();
        this.sounds.zombieAttack = this.createZombieAttackSound();

        // 플레이어 피격
        this.sounds.playerHit = this.createPlayerHitSound();

        // 아이템 획득
        this.sounds.pickup = this.createPickupSound();

        // UI 사운드
        this.sounds.click = this.createUIClickSound();
        this.sounds.confirm = this.createConfirmSound();
    }

    createGunSound(duration, startFreq, endFreq) {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const noiseBuffer = this.createNoiseBuffer(duration);
            const noiseSource = this.context.createBufferSource();

            noiseSource.buffer = noiseBuffer;

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(startFreq, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.context.currentTime + duration);

            gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

            const noiseGain = this.context.createGain();
            noiseGain.gain.setValueAtTime(0.5, this.context.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

            oscillator.connect(gainNode);
            noiseSource.connect(noiseGain);
            gainNode.connect(this.sfxGain);
            noiseGain.connect(this.sfxGain);

            oscillator.start();
            noiseSource.start();
            oscillator.stop(this.context.currentTime + duration);
            noiseSource.stop(this.context.currentTime + duration);
        };
    }

    createNoiseBuffer(duration) {
        const sampleRate = this.context.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = this.context.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        return buffer;
    }

    createClickSound() {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(1000, this.context.currentTime);

            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.05);
        };
    }

    createReloadSound() {
        return () => {
            if (!this.context) return;

            // 탄창 빼는 소리
            setTimeout(() => this.playMetallicClick(500), 0);
            // 탄창 끼우는 소리
            setTimeout(() => this.playMetallicClick(800), 300);
            // 슬라이드 당기는 소리
            setTimeout(() => this.playMetallicClick(1200), 500);
        };
    }

    playMetallicClick(freq) {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(freq, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(freq / 2, this.context.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.08);

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.start();
        oscillator.stop(this.context.currentTime + 0.08);
    }

    createZombieHitSound() {
        return () => {
            if (!this.context) return;

            const noiseBuffer = this.createNoiseBuffer(0.1);
            const noiseSource = this.context.createBufferSource();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();

            noiseSource.buffer = noiseBuffer;
            filter.type = 'lowpass';
            filter.frequency.value = 1000;

            gainNode.gain.setValueAtTime(0.4, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

            noiseSource.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.sfxGain);

            noiseSource.start();
            noiseSource.stop(this.context.currentTime + 0.1);
        };
    }

    createZombieDeathSound() {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.3);

            gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.3);
        };
    }

    createZombieAttackSound() {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, this.context.currentTime);
            oscillator.frequency.setValueAtTime(180, this.context.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(120, this.context.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.25, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.25);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.25);
        };
    }

    createPlayerHitSound() {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(300, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.15);

            gainNode.gain.setValueAtTime(0.4, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.15);
        };
    }

    createPickupSound() {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, this.context.currentTime);
            oscillator.frequency.setValueAtTime(600, this.context.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, this.context.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.3);
        };
    }

    createUIClickSound() {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, this.context.currentTime);

            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.05);
        };
    }

    createConfirmSound() {
        return () => {
            if (!this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(500, this.context.currentTime);
            oscillator.frequency.setValueAtTime(700, this.context.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.15);
        };
    }

    play(soundName) {
        this.resume();
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    setMasterVolume(value) {
        this.masterVolume = Utils.clamp(value, 0, 1);
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }

    setSFXVolume(value) {
        this.sfxVolume = Utils.clamp(value, 0, 1);
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxVolume;
        }
    }

    setMusicVolume(value) {
        this.musicVolume = Utils.clamp(value, 0, 1);
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }
}

const Audio = new AudioManager();
