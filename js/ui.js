// UI 시스템

const UI = {
    screens: {},
    currentScreen: 'titleScreen',

    init() {
        // 화면 요소 캐시
        this.screens = {
            titleScreen: document.getElementById('titleScreen'),
            howToPlayScreen: document.getElementById('howToPlayScreen'),
            storyScreen: document.getElementById('storyScreen'),
            gameScreen: document.getElementById('gameScreen'),
            chapterClearScreen: document.getElementById('chapterClearScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            endingScreen: document.getElementById('endingScreen'),
            loadingScreen: document.getElementById('loadingScreen')
        };

        // 버튼 이벤트 연결
        this.setupButtons();
    },

    setupButtons() {
        // 타이틀 화면
        document.getElementById('newGameBtn').addEventListener('click', () => {
            game.startNewGame();
        });

        document.getElementById('continueBtn').addEventListener('click', () => {
            game.continueGame();
        });

        document.getElementById('howToPlayBtn').addEventListener('click', () => {
            Audio.init();
            Audio.play('click');
            this.showScreen('howToPlayScreen');
        });

        document.getElementById('backToTitleBtn').addEventListener('click', () => {
            Audio.play('click');
            this.showScreen('titleScreen');
        });

        // 스토리 화면
        document.getElementById('skipStoryBtn').addEventListener('click', () => {
            Story.skip();
        });

        document.getElementById('nextStoryBtn').addEventListener('click', () => {
            Story.nextScene();
        });

        // 일시정지 메뉴
        document.getElementById('resumeBtn').addEventListener('click', () => {
            Audio.play('click');
            game.resume();
        });

        document.getElementById('restartChapterBtn').addEventListener('click', () => {
            Audio.play('click');
            game.restartChapter();
        });

        document.getElementById('quitToTitleBtn').addEventListener('click', () => {
            Audio.play('click');
            game.quitToTitle();
        });

        // 챕터 클리어
        document.getElementById('nextChapterBtn').addEventListener('click', () => {
            Audio.play('confirm');
            game.nextChapter();
        });

        // 게임 오버
        document.getElementById('retryBtn').addEventListener('click', () => {
            Audio.play('click');
            game.restartChapter();
        });

        document.getElementById('gameOverQuitBtn').addEventListener('click', () => {
            Audio.play('click');
            game.quitToTitle();
        });

        // 엔딩
        document.getElementById('endingTitleBtn').addEventListener('click', () => {
            Audio.play('click');
            this.showScreen('titleScreen');
        });

        // 대화 진행
        document.getElementById('dialogNextBtn').addEventListener('click', () => {
            Story.advanceDialog();
        });
    },

    showScreen(screenId) {
        // 모든 화면 숨기기
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // 해당 화면 표시
        if (this.screens[screenId]) {
            this.screens[screenId].classList.add('active');
            this.currentScreen = screenId;
        }
    },

    updateHealth(current, max) {
        const fill = document.getElementById('healthFill');
        const text = document.getElementById('healthText');

        const percent = (current / max) * 100;
        fill.style.width = `${percent}%`;
        text.textContent = Math.ceil(current);

        // 체력에 따른 색상 변경
        if (percent > 50) {
            fill.style.background = 'linear-gradient(180deg, #4caf50 0%, #2e7d32 100%)';
        } else if (percent > 25) {
            fill.style.background = 'linear-gradient(180deg, #ffa500 0%, #cc8400 100%)';
        } else {
            fill.style.background = 'linear-gradient(180deg, #f44336 0%, #c62828 100%)';
        }
    },

    updateWeapon(weaponManager) {
        const weapon = weaponManager.getCurrentWeapon();

        document.getElementById('currentWeapon').textContent = weapon.icon;
        document.getElementById('currentAmmo').textContent = weapon.currentAmmo === Infinity ? '∞' : weapon.currentAmmo;
        document.getElementById('maxAmmo').textContent = weapon.reserveAmmo === undefined ? '' : weapon.reserveAmmo;

        // 무기 슬롯 업데이트
        const slots = document.querySelectorAll('.weapon-slot');
        slots.forEach((slot, index) => {
            slot.classList.remove('active');

            if (index < weaponManager.weapons.length) {
                const w = weaponManager.weapons[index];
                slot.textContent = w.icon;
                slot.classList.remove('locked');

                if (index === weaponManager.currentIndex) {
                    slot.classList.add('active');
                }
            } else {
                slot.textContent = '🔒';
                slot.classList.add('locked');
            }
        });
    },

    updateWeaponSlots(weaponManager) {
        const slots = document.querySelectorAll('.weapon-slot');
        slots.forEach((slot, index) => {
            if (index < weaponManager.weapons.length && weaponManager.unlockedSlots[index]) {
                const w = weaponManager.weapons[index];
                slot.textContent = w.icon;
                slot.classList.remove('locked');
            }
        });
    },

    updateChapterInfo(name, objective) {
        document.getElementById('chapterName').textContent = name;
        document.getElementById('objectiveText').textContent = `목표: ${objective}`;
    },

    showMessage(text, duration = 3000) {
        // 기존 메시지 제거
        const existing = document.querySelector('.game-message');
        if (existing) existing.remove();

        const message = document.createElement('div');
        message.className = 'game-message';
        message.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #ffa500;
            padding: 15px 30px;
            border-radius: 10px;
            border: 2px solid #ffa500;
            font-size: 1.3em;
            z-index: 200;
            animation: fadeInOut ${duration}ms forwards;
        `;
        message.textContent = text;

        document.getElementById('gameScreen').appendChild(message);

        setTimeout(() => message.remove(), duration);
    },

    showPickup(text) {
        const notice = document.getElementById('pickupNotice');
        notice.textContent = text;
        notice.classList.remove('active');

        // 리플로우 강제
        void notice.offsetWidth;

        notice.classList.add('active');

        setTimeout(() => {
            notice.classList.remove('active');
        }, 2000);
    },

    showChapterClear(kills, accuracy, time) {
        document.getElementById('killCount').textContent = kills;
        document.getElementById('accuracy').textContent = accuracy;
        document.getElementById('clearTime').textContent = Utils.formatTime(time / 1000);

        this.showScreen('chapterClearScreen');
    },

    showGameOver() {
        const messages = [
            '좀비에게 당했습니다...',
            '더 이상 버틸 수 없었습니다...',
            '영웅은 쓰러졌습니다...',
            '어둠이 당신을 삼켰습니다...'
        ];

        document.getElementById('deathMessage').textContent = Utils.randomElement(messages);
        this.showScreen('gameOverScreen');
    },

    showEnding() {
        document.getElementById('endingText').innerHTML = `
            <p>당신은 DEAD CITY에서 탈출했습니다.</p>
            <p>많은 사람들을 구했고, 희망을 찾았습니다.</p>
            <p>이제 새로운 미래가 기다리고 있습니다.</p>
        `;

        this.showScreen('endingScreen');
    },

    showLoading(progress, text) {
        document.getElementById('loadingFill').style.width = `${progress}%`;
        document.getElementById('loadingText').textContent = text;
        this.showScreen('loadingScreen');
    }
};

// 추가 CSS 애니메이션 주입
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) scale(0.9); }
        15% { opacity: 1; transform: translateX(-50%) scale(1); }
        85% { opacity: 1; }
        100% { opacity: 0; }
    }

    .game-message {
        text-shadow: 0 0 10px currentColor;
    }
`;
document.head.appendChild(style);
