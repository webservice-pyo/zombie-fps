// 게임 메인 로직

class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;

        this.player = new Player();
        this.enemies = new EnemyManager();
        this.level = null;

        this.state = 'title'; // title, story, playing, paused, gameover, clear
        this.currentChapter = 1;
        this.maxChapter = 5;

        // 카메라
        this.cameraX = 0;
        this.cameraY = 0;

        // 게임 시간
        this.gameTime = 0;
        this.chapterStartTime = 0;

        // 이펙트
        this.effects = [];
        this.damageOverlay = null;

        // 총알
        this.bullets = [];

        // 프레임 관련
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        this.fpsCounter = 0;
        this.fpsTime = 0;

        // 아이템 픽업 거리
        this.pickupRange = 50;
    }

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // 데미지 오버레이 생성
        this.damageOverlay = document.createElement('div');
        this.damageOverlay.className = 'damage-overlay';
        document.getElementById('gameScreen').appendChild(this.damageOverlay);

        // 저장된 진행도 로드
        const savedProgress = Utils.loadData('deadcity_progress');
        if (savedProgress) {
            this.currentChapter = savedProgress.chapter;
            document.getElementById('continueBtn').style.display = 'block';
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startNewGame() {
        this.currentChapter = 1;
        Utils.saveData('deadcity_progress', { chapter: 1 });

        Audio.init();
        Audio.play('confirm');

        // 인트로 스토리 재생
        Story.playStory('intro', () => {
            this.startChapter(1);
        });

        UI.showScreen('storyScreen');
    }

    continueGame() {
        Audio.init();
        Audio.play('confirm');

        this.startChapter(this.currentChapter);
    }

    startChapter(chapterNum) {
        this.currentChapter = chapterNum;
        this.state = 'story';

        // 챕터 인트로 재생
        Story.playStory(`chapter${chapterNum}_intro`, () => {
            this.loadChapter(chapterNum);
        });

        UI.showScreen('storyScreen');
    }

    loadChapter(chapterNum) {
        // 레벨 로드
        this.level = new Level(`chapter${chapterNum}`);
        const levelInfo = this.level.load();

        // 플레이어 초기화
        this.player.init(levelInfo.playerStart.x, levelInfo.playerStart.y);

        // 적 초기화
        this.enemies.reset();

        // 카메라 초기화
        this.updateCamera();

        // 게임 상태 초기화
        this.gameTime = 0;
        this.chapterStartTime = Date.now();
        this.effects = [];
        this.bullets = [];

        // UI 업데이트
        UI.updateChapterInfo(this.level.data.name, this.level.data.objective);
        UI.updateHealth(this.player.health, this.player.maxHealth);
        UI.updateWeapon(this.player.weapons);

        // 게임 시작
        this.state = 'playing';
        UI.showScreen('gameScreen');

        // 첫 웨이브 체크
        this.checkWaves();
    }

    update(deltaTime) {
        if (this.state !== 'playing') return;

        this.deltaTime = deltaTime;
        this.gameTime += deltaTime;

        // 플레이어 업데이트
        this.player.update(deltaTime, this.level);

        // 웨이브 체크
        this.checkWaves();

        // 적 업데이트
        const attackingEnemies = this.enemies.update(this.player.x, this.player.y, deltaTime);

        // 적 공격 처리
        for (const enemy of attackingEnemies) {
            const dist = Utils.distance(this.player.x, this.player.y, enemy.x, enemy.y);
            if (dist <= enemy.attackRange + this.player.radius) {
                const died = this.player.takeDamage(enemy.damage);
                this.showDamageEffect();

                if (died) {
                    this.gameOver();
                    return;
                }
            }
        }

        // 원거리 투사체 피격 체크
        const projectileDamage = this.enemies.checkProjectileHit(
            this.player.x, this.player.y, this.player.radius
        );

        if (projectileDamage > 0) {
            const died = this.player.takeDamage(projectileDamage);
            this.showDamageEffect();

            if (died) {
                this.gameOver();
                return;
            }
        }

        // 아이템 픽업 체크
        this.checkItemPickup();

        // NPC 상호작용 체크
        this.checkNpcInteraction();

        // 클리어 조건 체크
        if (this.level.checkClearCondition(this.player.x, this.player.y)) {
            // 모든 적이 처치되었는지 확인 (방어 미션)
            if (this.level.data.defense) {
                if (this.enemies.getAliveCount() === 0 && this.enemies.spawnQueue.length === 0) {
                    this.chapterClear();
                }
            } else {
                this.chapterClear();
            }
        }

        // 카메라 업데이트
        this.updateCamera();

        // 총알 업데이트
        this.updateBullets(deltaTime);

        // 이펙트 업데이트
        this.updateEffects(deltaTime);

        // UI 업데이트
        UI.updateHealth(this.player.health, this.player.maxHealth);
        UI.updateWeapon(this.player.weapons);
    }

    checkWaves() {
        const triggeredWaves = this.level.checkWaveTriggers(this.player.x, this.player.y);

        for (const wave of triggeredWaves) {
            if (wave.message) {
                UI.showMessage(wave.message);
            }

            if (wave.enemies) {
                this.enemies.spawnWave(wave.enemies, this.level.getMapBounds());
            }
        }
    }

    checkItemPickup() {
        for (const item of this.level.items) {
            if (item.collected) continue;

            const dist = Utils.distance(this.player.x, this.player.y, item.x, item.y);
            if (dist < this.pickupRange) {
                this.collectItem(item);
            }
        }
    }

    collectItem(item) {
        const collected = this.level.collectItem(item.id);
        if (!collected) return;

        Audio.play('pickup');

        switch (item.type) {
            case 'health':
                this.player.heal(item.amount);
                UI.showPickup(`체력 +${item.amount}`);
                break;

            case 'ammo':
                this.player.weapons.addAmmoToWeapon(item.weapon, item.amount);
                UI.showPickup(`탄약 +${item.amount}`);
                break;

            case 'weapon':
                const weapon = this.player.weapons.unlockWeapon(item.weapon);
                UI.showPickup(`${weapon.name} 획득!`);
                UI.updateWeaponSlots(this.player.weapons);
                break;
        }
    }

    checkNpcInteraction() {
        for (const npc of this.level.npcs) {
            if (npc.interacted) continue;

            const dist = Utils.distance(this.player.x, this.player.y, npc.x, npc.y);
            if (dist < 60 && Controls.interactPressed) {
                Controls.interactPressed = false;
                this.interactWithNpc(npc);
            }
        }
    }

    interactWithNpc(npc) {
        this.state = 'dialog';

        Story.startNpcDialog(npc, () => {
            this.level.interactNpc(npc.id);
            this.state = 'playing';
        });
    }

    shoot() {
        if (this.state !== 'playing') return;

        const weapon = this.player.weapons.getCurrentWeapon();
        const bulletData = weapon.fire();

        if (!bulletData) return;

        this.player.shotsFired += bulletData.length;
        this.player.armAngle = -0.3;
        setTimeout(() => this.player.armAngle = 0, 100);

        // 근접 무기는 즉시 히트 판정
        if (weapon.type === WeaponTypes.MELEE) {
            for (const enemy of this.enemies.enemies) {
                if (!enemy.isAlive) continue;

                const dist = Utils.distance(this.player.x, this.player.y, enemy.x, enemy.y);
                if (dist > weapon.range) continue;

                const angleToEnemy = Utils.angle(this.player.x, this.player.y, enemy.x, enemy.y);
                let angleDiff = Math.abs(this.player.angle - angleToEnemy);
                if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

                if (angleDiff < Math.PI / 2) {
                    this.player.shotsHit++;
                    const killed = enemy.takeDamage(weapon.damage);
                    this.addEffect('hit', enemy.x, enemy.y);

                    if (killed) {
                        this.level.addKill();
                        this.enemies.totalKills++;
                        this.addEffect('death', enemy.x, enemy.y);
                    }
                    break;
                }
            }
        } else {
            // 총알 생성
            for (const bullet of bulletData) {
                const spreadAngle = this.player.angle + Utils.toRadians(bullet.spread);
                const speed = 25; // 총알 속도

                this.bullets.push({
                    x: this.player.x,
                    y: this.player.y,
                    vx: Math.cos(spreadAngle) * speed,
                    vy: Math.sin(spreadAngle) * speed,
                    damage: bullet.damage,
                    range: bullet.range,
                    traveled: 0,
                    angle: spreadAngle
                });
            }

            // 총구 화염 이펙트
            const muzzleX = this.player.x + Math.cos(this.player.angle) * 35;
            const muzzleY = this.player.y + Math.sin(this.player.angle) * 35;
            this.addEffect('muzzle', muzzleX, muzzleY);
        }
    }

    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            // 총알 이동
            const moveX = bullet.vx * (deltaTime / 16);
            const moveY = bullet.vy * (deltaTime / 16);
            bullet.x += moveX;
            bullet.y += moveY;
            bullet.traveled += Math.sqrt(moveX * moveX + moveY * moveY);

            // 사거리 초과 체크
            if (bullet.traveled >= bullet.range) {
                this.bullets.splice(i, 1);
                continue;
            }

            // 적과 충돌 체크
            let hit = false;
            for (const enemy of this.enemies.enemies) {
                if (!enemy.isAlive) continue;

                const dist = Utils.distance(bullet.x, bullet.y, enemy.x, enemy.y);
                if (dist < enemy.size / 2 + 15) {
                    // 히트!
                    hit = true;
                    this.player.shotsHit++;
                    const killed = enemy.takeDamage(bullet.damage);

                    this.addEffect('hit', bullet.x, bullet.y);

                    if (killed) {
                        this.level.addKill();
                        this.enemies.totalKills++;
                        this.addEffect('death', enemy.x, enemy.y);
                    }

                    this.bullets.splice(i, 1);
                    break;
                }
            }

            if (hit) continue;

            // 벽 충돌 체크
            if (this.level.checkCollision(bullet.x - 5, bullet.y - 5, 10, 10)) {
                this.addEffect('hit', bullet.x, bullet.y);
                this.bullets.splice(i, 1);
            }
        }
    }

    drawBullets() {
        for (const bullet of this.bullets) {
            const screenX = bullet.x - this.cameraX;
            const screenY = bullet.y - this.cameraY;

            this.ctx.save();
            this.ctx.translate(screenX, screenY);
            this.ctx.rotate(bullet.angle);

            // 총알 몸체
            this.ctx.fillStyle = '#ffcc00';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // 총알 빛나는 효과
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.ellipse(4, 0, 6, 2, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // 총알 꼬리 (잔상)
            const gradient = this.ctx.createLinearGradient(-30, 0, 0, 0);
            gradient.addColorStop(0, 'rgba(255, 200, 0, 0)');
            gradient.addColorStop(1, 'rgba(255, 200, 0, 0.8)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-30, -2, 30, 4);

            this.ctx.restore();
        }
    }

    reload() {
        if (this.state !== 'playing') return;
        this.player.weapons.getCurrentWeapon().startReload();
    }

    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height / 2;

        // 부드러운 카메라 이동
        this.cameraX = Utils.lerp(this.cameraX, targetX, 0.1);
        this.cameraY = Utils.lerp(this.cameraY, targetY, 0.1);

        // 맵 경계 제한
        const bounds = this.level.getMapBounds();
        this.cameraX = Utils.clamp(this.cameraX, 0, Math.max(0, bounds.maxX - this.canvas.width));
        this.cameraY = Utils.clamp(this.cameraY, 0, Math.max(0, bounds.maxY - this.canvas.height));
    }

    addEffect(type, x, y) {
        this.effects.push({
            type,
            x,
            y,
            time: 0,
            duration: type === 'muzzle' ? 50 : type === 'hit' ? 150 : 300
        });
    }

    updateEffects(deltaTime) {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].time += deltaTime;
            if (this.effects[i].time >= this.effects[i].duration) {
                this.effects.splice(i, 1);
            }
        }
    }

    showDamageEffect() {
        this.damageOverlay.classList.add('active');
        setTimeout(() => {
            this.damageOverlay.classList.remove('active');
        }, 150);

        Utils.shake(this.canvas, 8, 150);
    }

    draw() {
        if (!this.ctx || this.state === 'title') return;

        // 화면 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === 'playing' || this.state === 'paused' || this.state === 'dialog') {
            // 레벨 그리기
            this.level.draw(this.ctx, this.cameraX, this.cameraY, this.canvas.width, this.canvas.height);

            // 적 그리기
            this.enemies.draw(this.ctx, this.cameraX, this.cameraY);

            // 플레이어 그리기
            this.player.draw(this.ctx, this.cameraX, this.cameraY);

            // 총알 그리기
            this.drawBullets();

            // 이펙트 그리기
            this.drawEffects();

            // 재장전 표시
            this.drawReloadIndicator();

            // 조준선
            this.drawCrosshair();
        }
    }

    drawEffects() {
        for (const effect of this.effects) {
            const screenX = effect.x - this.cameraX;
            const screenY = effect.y - this.cameraY;
            const progress = effect.time / effect.duration;

            this.ctx.save();

            switch (effect.type) {
                case 'muzzle':
                    this.ctx.globalAlpha = 1 - progress;
                    this.ctx.fillStyle = '#ff0';
                    this.ctx.beginPath();
                    this.ctx.arc(screenX, screenY, 15 * (1 - progress), 0, Math.PI * 2);
                    this.ctx.fill();
                    break;

                case 'hit':
                    this.ctx.globalAlpha = 1 - progress;
                    this.ctx.fillStyle = '#f00';
                    this.ctx.beginPath();
                    this.ctx.arc(screenX, screenY, 10 + progress * 20, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;

                case 'death':
                    this.ctx.globalAlpha = 1 - progress;
                    this.ctx.strokeStyle = '#8b0000';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(screenX, screenY, 20 + progress * 40, 0, Math.PI * 2);
                    this.ctx.stroke();
                    break;
            }

            this.ctx.restore();
        }
    }

    drawReloadIndicator() {
        const weapon = this.player.weapons.getCurrentWeapon();
        if (!weapon.isReloading) return;

        const progress = weapon.getReloadProgress();
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 50;

        this.ctx.save();

        // 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(centerX - 50, centerY - 5, 100, 10);

        // 진행 바
        this.ctx.fillStyle = '#ffa500';
        this.ctx.fillRect(centerX - 50, centerY - 5, 100 * progress, 10);

        // 텍스트
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('재장전 중...', centerX, centerY - 15);

        this.ctx.restore();
    }

    drawCrosshair() {
        if (Utils.isMobile()) return;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;

        // 십자선
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 15, centerY);
        this.ctx.lineTo(centerX - 5, centerY);
        this.ctx.moveTo(centerX + 5, centerY);
        this.ctx.lineTo(centerX + 15, centerY);
        this.ctx.moveTo(centerX, centerY - 15);
        this.ctx.lineTo(centerX, centerY - 5);
        this.ctx.moveTo(centerX, centerY + 5);
        this.ctx.lineTo(centerX, centerY + 15);
        this.ctx.stroke();

        this.ctx.restore();
    }

    pause() {
        if (this.state !== 'playing') return;
        this.state = 'paused';
        document.getElementById('pauseMenu').classList.add('active');
    }

    resume() {
        if (this.state !== 'paused') return;
        this.state = 'playing';
        document.getElementById('pauseMenu').classList.remove('active');
    }

    gameOver() {
        this.state = 'gameover';
        UI.showGameOver();
    }

    chapterClear() {
        this.state = 'clear';

        const clearTime = Date.now() - this.chapterStartTime;
        const kills = this.level.currentKills;
        const accuracy = this.player.getAccuracy();

        // 다음 챕터 저장
        if (this.currentChapter < this.maxChapter) {
            Utils.saveData('deadcity_progress', { chapter: this.currentChapter + 1 });
        }

        // 클리어 스토리 재생
        Story.playStory(`chapter${this.currentChapter}_clear`, () => {
            if (this.currentChapter >= this.maxChapter) {
                // 엔딩
                Story.playStory('ending', () => {
                    UI.showEnding();
                });
                UI.showScreen('storyScreen');
            } else {
                UI.showChapterClear(kills, accuracy, clearTime);
            }
        });

        UI.showScreen('storyScreen');
    }

    nextChapter() {
        this.currentChapter++;
        if (this.currentChapter > this.maxChapter) {
            UI.showScreen('titleScreen');
        } else {
            this.startChapter(this.currentChapter);
        }
    }

    restartChapter() {
        this.loadChapter(this.currentChapter);
    }

    quitToTitle() {
        this.state = 'title';
        document.getElementById('pauseMenu').classList.remove('active');
        UI.showScreen('titleScreen');
    }

    gameLoop(currentTime) {
        // 델타 타임 계산
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // FPS 계산
        this.fpsCounter++;
        this.fpsTime += deltaTime;
        if (this.fpsTime >= 1000) {
            this.fps = this.fpsCounter;
            this.fpsCounter = 0;
            this.fpsTime = 0;
        }

        // 업데이트
        if (this.state === 'playing') {
            this.update(Math.min(deltaTime, 50)); // 최대 50ms (20 FPS 최소 보장)
        }

        // 렌더링
        this.draw();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    start() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
}

const game = new Game();
