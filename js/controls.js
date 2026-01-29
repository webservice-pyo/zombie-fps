// 컨트롤 시스템 - 키보드, 마우스, 터치

const Controls = {
    // 입력 상태
    keys: {},
    mouse: { x: 0, y: 0, down: false },
    touch: { active: false },
    joystick: { x: 0, y: 0, active: false },
    look: { x: 0, y: 0, active: false },

    // 특수 입력
    interactPressed: false,

    // 조이스틱 요소
    joystickBase: null,
    joystickThumb: null,
    joystickZone: null,
    lookZone: null,

    // 터치 ID 추적
    joystickTouchId: null,
    lookTouchId: null,

    init() {
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));

        // 마우스 이벤트
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));

        // 터치 이벤트
        this.setupTouchControls();

        // 무기 슬롯 클릭
        this.setupWeaponSlots();

        // 포인터 락 (PC)
        if (!Utils.isMobile()) {
            const canvas = document.getElementById('gameCanvas');
            canvas.addEventListener('click', () => {
                if (game.state === 'playing') {
                    canvas.requestPointerLock?.();
                }
            });

            document.addEventListener('pointerlockchange', () => {
                if (document.pointerLockElement) {
                    document.addEventListener('mousemove', (e) => this.onPointerMove(e));
                }
            });
        }
    },

    setupTouchControls() {
        this.joystickZone = document.getElementById('joystickZone');
        this.joystickBase = document.getElementById('joystickBase');
        this.joystickThumb = document.getElementById('joystickThumb');
        this.lookZone = document.getElementById('lookZone');

        const shootBtn = document.getElementById('shootBtn');
        const reloadBtn = document.getElementById('reloadBtn');

        // 조이스틱 터치
        this.joystickZone.addEventListener('touchstart', (e) => this.onJoystickStart(e), { passive: false });
        this.joystickZone.addEventListener('touchmove', (e) => this.onJoystickMove(e), { passive: false });
        this.joystickZone.addEventListener('touchend', (e) => this.onJoystickEnd(e), { passive: false });
        this.joystickZone.addEventListener('touchcancel', (e) => this.onJoystickEnd(e), { passive: false });

        // 조준 터치
        this.lookZone.addEventListener('touchstart', (e) => this.onLookStart(e), { passive: false });
        this.lookZone.addEventListener('touchmove', (e) => this.onLookMove(e), { passive: false });
        this.lookZone.addEventListener('touchend', (e) => this.onLookEnd(e), { passive: false });
        this.lookZone.addEventListener('touchcancel', (e) => this.onLookEnd(e), { passive: false });

        // 액션 버튼
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.onShoot();
        }, { passive: false });

        reloadBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.onReload();
        }, { passive: false });

        // 캔버스 터치 (조준)
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('touchstart', (e) => {
            if (game.state === 'playing') {
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;

                // 왼쪽 영역(조이스틱)이 아닌 경우에만 조준
                if (x > rect.width * 0.3) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const angle = Math.atan2(y - centerY, x - centerX);
                    game.player.setAngle(angle);
                }
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (game.state === 'playing') {
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;

                // 왼쪽 영역(조이스틱)이 아닌 경우에만 조준
                if (x > rect.width * 0.3) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const angle = Math.atan2(y - centerY, x - centerX);
                    game.player.setAngle(angle);
                }
            }
        }, { passive: true });
    },

    setupWeaponSlots() {
        const slots = document.querySelectorAll('.weapon-slot');
        slots.forEach((slot, index) => {
            // 클릭 이벤트 (PC)
            slot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!slot.classList.contains('locked') && game.state === 'playing') {
                    game.player.weapons.switchWeapon(index);
                    UI.updateWeapon(game.player.weapons);
                }
            });

            // 터치 이벤트 (모바일) - touchend로 변경하여 확실한 감지
            slot.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!slot.classList.contains('locked') && game.state === 'playing') {
                    game.player.weapons.switchWeapon(index);
                    UI.updateWeapon(game.player.weapons);
                }
            }, { passive: false });
        });
    },

    onKeyDown(e) {
        this.keys[e.code] = true;

        // 게임 중 키 처리
        if (game.state === 'playing') {
            switch (e.code) {
                case 'KeyR':
                    this.onReload();
                    break;
                case 'Digit1':
                    game.player.weapons.switchWeapon(0);
                    UI.updateWeapon(game.player.weapons);
                    break;
                case 'Digit2':
                    game.player.weapons.switchWeapon(1);
                    UI.updateWeapon(game.player.weapons);
                    break;
                case 'Digit3':
                    game.player.weapons.switchWeapon(2);
                    UI.updateWeapon(game.player.weapons);
                    break;
                case 'KeyE':
                    this.interactPressed = true;
                    break;
                case 'Escape':
                    game.pause();
                    break;
            }
        } else if (game.state === 'paused') {
            if (e.code === 'Escape') {
                game.resume();
            }
        } else if (game.state === 'dialog') {
            if (e.code === 'Space' || e.code === 'Enter') {
                Story.advanceDialog();
            }
        }
    },

    onKeyUp(e) {
        this.keys[e.code] = false;

        if (e.code === 'KeyE') {
            this.interactPressed = false;
        }
    },

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (game.state === 'playing' && !document.pointerLockElement) {
            // 마우스 위치로 조준
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            game.player.setAngle(angle);
        }
    },

    onPointerMove(e) {
        if (game.state === 'playing') {
            // 포인터 락 상태에서 상대적 움직임으로 조준
            const sensitivity = 0.003;
            game.player.angle += e.movementX * sensitivity;
        }
    },

    onMouseDown(e) {
        if (e.button === 0) { // 좌클릭
            this.mouse.down = true;
            if (game.state === 'playing') {
                this.onShoot();
            }
        }
    },

    onMouseUp(e) {
        if (e.button === 0) {
            this.mouse.down = false;
        }
    },

    onJoystickStart(e) {
        e.preventDefault();
        if (this.joystickTouchId !== null) return;

        const touch = e.changedTouches[0];
        this.joystickTouchId = touch.identifier;
        this.joystick.active = true;

        this.updateJoystickPosition(touch);
    },

    onJoystickMove(e) {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.joystickTouchId) {
                this.updateJoystickPosition(touch);
                break;
            }
        }
    },

    onJoystickEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.joystickTouchId) {
                this.joystickTouchId = null;
                this.joystick.active = false;
                this.joystick.x = 0;
                this.joystick.y = 0;
                this.joystickThumb.style.transform = 'translate(0, 0)';
                break;
            }
        }
    },

    updateJoystickPosition(touch) {
        const rect = this.joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;

        const maxDist = rect.width / 2 - 25;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > maxDist) {
            dx = (dx / dist) * maxDist;
            dy = (dy / dist) * maxDist;
        }

        this.joystick.x = dx / maxDist;
        this.joystick.y = dy / maxDist;

        this.joystickThumb.style.transform = `translate(${dx}px, ${dy}px)`;
    },

    onLookStart(e) {
        e.preventDefault();
        if (this.lookTouchId !== null) return;

        const touch = e.changedTouches[0];
        this.lookTouchId = touch.identifier;
        this.look.active = true;
        this.look.startX = touch.clientX;
        this.look.startY = touch.clientY;
        this.look.lastX = touch.clientX;
        this.look.lastY = touch.clientY;

        // 터치한 위치 방향으로 즉시 조준
        this.aimAtTouch(touch.clientX, touch.clientY);
    },

    onLookMove(e) {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.lookTouchId) {
                // 터치한 위치 방향으로 조준
                this.aimAtTouch(touch.clientX, touch.clientY);

                this.look.lastX = touch.clientX;
                this.look.lastY = touch.clientY;
                break;
            }
        }
    },

    onLookEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.lookTouchId) {
                this.lookTouchId = null;
                this.look.active = false;
                break;
            }
        }
    },

    // 터치 위치 방향으로 조준
    aimAtTouch(touchX, touchY) {
        if (game.state !== 'playing') return;

        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();

        // 화면 중앙 (플레이어 위치)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 터치 위치 (캔버스 기준)
        const x = touchX - rect.left;
        const y = touchY - rect.top;

        // 각도 계산
        const angle = Math.atan2(y - centerY, x - centerX);
        game.player.setAngle(angle);
    },

    onShoot() {
        if (game.state === 'playing') {
            game.shoot();
        }
    },

    onReload() {
        if (game.state === 'playing') {
            game.reload();
        }
    },

    update() {
        if (game.state !== 'playing') return;

        // 키보드 이동
        let moveX = 0;
        let moveY = 0;

        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

        // 조이스틱 이동
        if (this.joystick.active) {
            moveX = this.joystick.x;
            moveY = this.joystick.y;
        }

        game.player.setMovement(moveX, moveY);

        // 모바일: 이동 방향으로 자동 조준 (터치 조준 중이 아닐 때만)
        if (Utils.isMobile() && !this.look.active && (moveX !== 0 || moveY !== 0)) {
            const moveAngle = Math.atan2(moveY, moveX);
            game.player.setAngle(moveAngle);
        }

        // 자동 발사 (연사 무기)
        if (this.mouse.down || this.isTouchingShooting()) {
            const weapon = game.player.weapons.getCurrentWeapon();
            if (weapon.auto && weapon.canFire()) {
                game.shoot();
            }
        }
    },

    isTouchingShooting() {
        const shootBtn = document.getElementById('shootBtn');
        if (!shootBtn) return false;

        const rect = shootBtn.getBoundingClientRect();
        // 터치 버튼이 눌려있는지 확인
        return shootBtn.matches(':active');
    }
};
