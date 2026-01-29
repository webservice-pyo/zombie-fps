// 적 시스템 - 좀비 종류 및 AI

const EnemyTypes = {
    WALKER: 'walker',
    RUNNER: 'runner',
    BRUTE: 'brute',
    SPITTER: 'spitter',
    BOSS: 'boss'
};

const EnemyData = {
    walker: {
        name: '워커',
        skinColor: '#6b8e6b',
        clothColor: '#3d3d3d',
        health: 60,
        damage: 10,
        speed: 1.2,
        attackRange: 50,
        attackSpeed: 1200,
        size: 40,
        score: 10
    },
    runner: {
        name: '러너',
        skinColor: '#7a6b6b',
        clothColor: '#2d2d2d',
        health: 40,
        damage: 15,
        speed: 2.8,
        attackRange: 45,
        attackSpeed: 800,
        size: 35,
        score: 20
    },
    brute: {
        name: '브루트',
        skinColor: '#5a6b7a',
        clothColor: '#1d1d2d',
        health: 200,
        damage: 25,
        speed: 0.8,
        attackRange: 65,
        attackSpeed: 1500,
        size: 60,
        score: 50
    },
    spitter: {
        name: '스피터',
        skinColor: '#7a8a5a',
        clothColor: '#2d3d2d',
        health: 50,
        damage: 12,
        speed: 1.0,
        attackRange: 200,
        attackSpeed: 2000,
        size: 38,
        score: 30,
        ranged: true,
        projectileSpeed: 5
    },
    boss: {
        name: '보스',
        skinColor: '#5a3a3a',
        clothColor: '#1a0a0a',
        health: 500,
        damage: 35,
        speed: 1.5,
        attackRange: 75,
        attackSpeed: 1000,
        size: 80,
        score: 200
    }
};

class Enemy {
    constructor(type, x, y) {
        const data = EnemyData[type];

        this.id = Utils.generateId();
        this.type = type;
        this.name = data.name;
        this.skinColor = data.skinColor;
        this.clothColor = data.clothColor;

        this.x = x;
        this.y = y;
        this.size = data.size;

        this.maxHealth = data.health;
        this.health = data.health;
        this.damage = data.damage;
        this.speed = data.speed;
        this.attackRange = data.attackRange;
        this.attackSpeed = data.attackSpeed;
        this.score = data.score;
        this.ranged = data.ranged || false;
        this.projectileSpeed = data.projectileSpeed || 0;

        this.lastAttackTime = 0;
        this.isAlive = true;
        this.isAttacking = false;
        this.attackAnimTimer = 0;

        this.state = 'idle';
        this.targetX = x;
        this.targetY = y;
        this.wanderTimer = 0;
        this.alertTimer = 0;

        this.hitFlash = 0;
        this.deathTimer = 0;
        this.angle = Math.random() * Math.PI * 2;

        this.walkFrame = 0;
        this.walkTimer = 0;
        this.headBob = 0;
    }

    update(playerX, playerY, deltaTime) {
        if (!this.isAlive) {
            this.deathTimer += deltaTime;
            return this.deathTimer < 600;
        }

        if (this.hitFlash > 0) {
            this.hitFlash -= deltaTime * 0.008;
        }

        if (this.attackAnimTimer > 0) {
            this.attackAnimTimer -= deltaTime;
        }

        // 걷기/머리 흔들림 애니메이션
        if (this.state === 'chase' || this.state === 'wander') {
            this.walkTimer += deltaTime;
            if (this.walkTimer > 150) {
                this.walkTimer = 0;
                this.walkFrame = (this.walkFrame + 1) % 8;
            }
            this.headBob = Math.sin(Date.now() * 0.008) * 3;
        } else {
            this.headBob = Math.sin(Date.now() * 0.003) * 1;
        }

        const distToPlayer = Utils.distance(this.x, this.y, playerX, playerY);
        const angleToPlayer = Utils.angle(this.x, this.y, playerX, playerY);

        const detectRange = 350;
        const chaseRange = 600;

        switch (this.state) {
            case 'idle':
                this.handleIdle(distToPlayer, detectRange, deltaTime);
                break;
            case 'wander':
                this.handleWander(distToPlayer, detectRange, deltaTime);
                break;
            case 'chase':
                this.handleChase(playerX, playerY, distToPlayer, chaseRange, angleToPlayer, deltaTime);
                break;
            case 'attack':
                this.handleAttack(playerX, playerY, distToPlayer, angleToPlayer, deltaTime);
                break;
        }

        return true;
    }

    handleIdle(distToPlayer, detectRange, deltaTime) {
        this.wanderTimer += deltaTime;

        if (distToPlayer < detectRange) {
            this.state = 'chase';
            this.alertTimer = 150;
            return;
        }

        if (this.wanderTimer > 2500) {
            this.wanderTimer = 0;
            if (Math.random() < 0.6) {
                this.state = 'wander';
                this.targetX = this.x + (Math.random() - 0.5) * 200;
                this.targetY = this.y + (Math.random() - 0.5) * 200;
            }
        }
    }

    handleWander(distToPlayer, detectRange, deltaTime) {
        if (distToPlayer < detectRange) {
            this.state = 'chase';
            return;
        }

        const distToTarget = Utils.distance(this.x, this.y, this.targetX, this.targetY);
        if (distToTarget < 10) {
            this.state = 'idle';
            return;
        }

        const angle = Utils.angle(this.x, this.y, this.targetX, this.targetY);
        this.angle = angle;
        this.x += Math.cos(angle) * this.speed * 0.5 * (deltaTime / 16);
        this.y += Math.sin(angle) * this.speed * 0.5 * (deltaTime / 16);
    }

    handleChase(playerX, playerY, distToPlayer, chaseRange, angleToPlayer, deltaTime) {
        if (this.alertTimer > 0) {
            this.alertTimer -= deltaTime;
            return;
        }

        if (distToPlayer > chaseRange) {
            this.state = 'idle';
            return;
        }

        if (distToPlayer <= this.attackRange) {
            this.state = 'attack';
            return;
        }

        this.angle = angleToPlayer;
        const moveSpeed = this.speed * (deltaTime / 16);
        this.x += Math.cos(angleToPlayer) * moveSpeed;
        this.y += Math.sin(angleToPlayer) * moveSpeed;
    }

    handleAttack(playerX, playerY, distToPlayer, angleToPlayer, deltaTime) {
        this.angle = angleToPlayer;

        if (distToPlayer > this.attackRange * 1.5) {
            this.state = 'chase';
            return;
        }

        const now = Date.now();
        if (now - this.lastAttackTime >= this.attackSpeed) {
            this.lastAttackTime = now;
            this.attackAnimTimer = 250;
            this.isAttacking = true;
            return true;
        }

        return false;
    }

    takeDamage(damage) {
        if (!this.isAlive) return false;

        this.health -= damage;
        this.hitFlash = 1;
        this.state = 'chase';

        Audio.play('zombieHit');

        if (this.health <= 0) {
            this.die();
            return true;
        }

        return false;
    }

    die() {
        this.isAlive = false;
        this.deathTimer = 0;
        Audio.play('zombieDeath');
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        if (screenX < -150 || screenX > ctx.canvas.width + 150 ||
            screenY < -150 || screenY > ctx.canvas.height + 150) {
            return;
        }

        ctx.save();
        ctx.translate(screenX, screenY);

        if (!this.isAlive) {
            const alpha = 1 - (this.deathTimer / 600);
            ctx.globalAlpha = alpha;
            ctx.translate(0, this.deathTimer * 0.05);
            ctx.rotate(this.deathTimer * 0.002);
        }

        let skin = this.skinColor;
        let cloth = this.clothColor;
        if (this.hitFlash > 0) {
            skin = '#ffffff';
            cloth = '#ffcccc';
        }

        const scale = this.size / 40;

        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 20 * scale, 15 * scale, 6 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.rotate(this.angle + Math.PI / 2);

        const legSwing = (this.state === 'chase' || this.state === 'wander')
            ? Math.sin(this.walkFrame * Math.PI / 4) * 10 : 0;
        const isAggro = this.state === 'chase' || this.state === 'attack';

        // === 다리 (찢어진 바지) ===
        // 왼쪽 다리
        ctx.save();
        ctx.translate(-5 * scale, 5 * scale);
        ctx.rotate(legSwing * 0.04);
        // 바지
        ctx.fillStyle = cloth;
        ctx.beginPath();
        ctx.roundRect(-4 * scale, 0, 8 * scale, 18 * scale, 2 * scale);
        ctx.fill();
        // 찢어진 부분 (피부)
        ctx.fillStyle = skin;
        ctx.fillRect(-3 * scale, 12 * scale, 5 * scale, 8 * scale);
        // 뼈 보이는 부분
        ctx.fillStyle = '#d4c4a4';
        ctx.fillRect(-1 * scale, 14 * scale, 2 * scale, 4 * scale);
        // 신발 (낡은)
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        ctx.roundRect(-5 * scale, 17 * scale, 9 * scale, 5 * scale, 2 * scale);
        ctx.fill();
        ctx.restore();

        // 오른쪽 다리
        ctx.save();
        ctx.translate(5 * scale, 5 * scale);
        ctx.rotate(-legSwing * 0.04);
        ctx.fillStyle = cloth;
        ctx.beginPath();
        ctx.roundRect(-4 * scale, 0, 8 * scale, 18 * scale, 2 * scale);
        ctx.fill();
        ctx.fillStyle = skin;
        ctx.fillRect(-2 * scale, 10 * scale, 5 * scale, 10 * scale);
        // 상처
        ctx.fillStyle = '#6b2222';
        ctx.fillRect(0, 13 * scale, 3 * scale, 4 * scale);
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        ctx.roundRect(-4 * scale, 17 * scale, 8 * scale, 5 * scale, 2 * scale);
        ctx.fill();
        ctx.restore();

        // === 몸통 (찢어진 옷) ===
        ctx.fillStyle = cloth;
        ctx.beginPath();
        ctx.roundRect(-10 * scale, -15 * scale, 20 * scale, 24 * scale, 4 * scale);
        ctx.fill();

        // 찢어진 옷 - 피부 노출
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.moveTo(-8 * scale, -10 * scale);
        ctx.lineTo(-2 * scale, -12 * scale);
        ctx.lineTo(-3 * scale, 2 * scale);
        ctx.lineTo(-9 * scale, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(4 * scale, -8 * scale);
        ctx.lineTo(9 * scale, -5 * scale);
        ctx.lineTo(8 * scale, 5 * scale);
        ctx.lineTo(3 * scale, 3 * scale);
        ctx.closePath();
        ctx.fill();

        // 갈비뼈 보이는 부분
        ctx.strokeStyle = '#c4b494';
        ctx.lineWidth = 1.5 * scale;
        ctx.beginPath();
        ctx.moveTo(-7 * scale, -6 * scale);
        ctx.lineTo(-3 * scale, -5 * scale);
        ctx.moveTo(-7 * scale, -2 * scale);
        ctx.lineTo(-4 * scale, -1 * scale);
        ctx.stroke();

        // 상처/피
        ctx.fillStyle = '#5a1a1a';
        ctx.beginPath();
        ctx.ellipse(-5 * scale, -4 * scale, 3 * scale, 2 * scale, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8b2222';
        ctx.beginPath();
        ctx.ellipse(5 * scale, 0, 2 * scale, 3 * scale, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // 피 흘러내림
        ctx.fillStyle = '#6b1111';
        ctx.fillRect(-6 * scale, -2 * scale, 2 * scale, 8 * scale);
        ctx.fillRect(4 * scale, 2 * scale, 2 * scale, 6 * scale);

        // === 팔 ===
        const armSwing = isAggro ? Math.sin(Date.now() * 0.012) * 0.4 : 0.1;

        // 왼팔 (앞으로 뻗음)
        ctx.save();
        ctx.translate(-12 * scale, -8 * scale);
        ctx.rotate(-0.8 + armSwing);
        // 팔
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.roundRect(-3 * scale, 0, 6 * scale, 22 * scale, 2 * scale);
        ctx.fill();
        // 상처
        ctx.fillStyle = '#5a2222';
        ctx.fillRect(-2 * scale, 8 * scale, 4 * scale, 3 * scale);
        // 손
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(0, 24 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
        // 손가락 (구부러진)
        ctx.fillStyle = skin;
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.translate(-3 * scale + i * 2 * scale, 28 * scale);
            ctx.rotate(0.2 - i * 0.1);
            ctx.fillRect(-1 * scale, 0, 2 * scale, 6 * scale);
            ctx.restore();
        }
        // 손톱 (더러운)
        ctx.fillStyle = '#3a3a2a';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(-3 * scale + i * 2 * scale, 34 * scale, 1.2 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 오른팔
        ctx.save();
        ctx.translate(12 * scale, -8 * scale);
        ctx.rotate(0.5 - armSwing * 0.7);
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.roundRect(-3 * scale, 0, 6 * scale, 20 * scale, 2 * scale);
        ctx.fill();
        // 뼈 노출
        ctx.fillStyle = '#d4c4a4';
        ctx.fillRect(-1 * scale, 12 * scale, 3 * scale, 5 * scale);
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(0, 22 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // === 머리 ===
        ctx.save();
        ctx.translate(0, -22 * scale + this.headBob);

        // 목
        ctx.fillStyle = skin;
        ctx.fillRect(-4 * scale, 8 * scale, 8 * scale, 8 * scale);

        // 얼굴
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(0, 0, 12 * scale, 0, Math.PI * 2);
        ctx.fill();

        // 얼굴 상처
        ctx.strokeStyle = '#4a1a1a';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(-8 * scale, -2 * scale);
        ctx.lineTo(-3 * scale, 4 * scale);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(5 * scale, -5 * scale);
        ctx.lineTo(8 * scale, 2 * scale);
        ctx.stroke();

        // 머리카락 (헝클어진)
        ctx.fillStyle = this.type === 'boss' ? '#1a0a0a' : '#2a2a2a';
        ctx.beginPath();
        ctx.arc(0, -2 * scale, 12 * scale, Math.PI * 1.1, Math.PI * 1.9);
        ctx.fill();

        // 삐죽삐죽 머리카락
        for (let i = 0; i < 7; i++) {
            ctx.fillRect((-8 + i * 2.5) * scale, -14 * scale, 2 * scale, (5 + Math.sin(i * 2) * 3) * scale);
        }

        // 대머리 부분
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(6 * scale, -6 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        // 눈
        // 왼쪽 눈
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.ellipse(-4 * scale, 0, 4 * scale, 5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = isAggro ? '#ff2222' : '#882222';
        ctx.beginPath();
        ctx.arc(-4 * scale, 0, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-4 * scale, 0, 1.5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // 오른쪽 눈 (손상된)
        if (this.type === 'brute' || this.type === 'boss') {
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.ellipse(5 * scale, 0, 4 * scale, 5 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = isAggro ? '#ff2222' : '#882222';
            ctx.beginPath();
            ctx.arc(5 * scale, 0, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // X 표시 (눈 손상)
            ctx.fillStyle = '#3a1a1a';
            ctx.beginPath();
            ctx.arc(5 * scale, 0, 4 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#882222';
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.moveTo(2 * scale, -3 * scale);
            ctx.lineTo(8 * scale, 3 * scale);
            ctx.moveTo(8 * scale, -3 * scale);
            ctx.lineTo(2 * scale, 3 * scale);
            ctx.stroke();
        }

        // 코 (부러진)
        ctx.fillStyle = Utils.adjustBrightness(skin, -20);
        ctx.beginPath();
        ctx.moveTo(-1 * scale, 2 * scale);
        ctx.lineTo(-3 * scale, 8 * scale);
        ctx.lineTo(2 * scale, 7 * scale);
        ctx.closePath();
        ctx.fill();

        // 입 (벌어진)
        ctx.fillStyle = '#1a0a0a';
        ctx.beginPath();
        ctx.ellipse(0, 9 * scale, 6 * scale, 4 * scale, 0, 0, Math.PI);
        ctx.fill();

        // 혀
        ctx.fillStyle = '#6a3a4a';
        ctx.beginPath();
        ctx.ellipse(1 * scale, 11 * scale, 3 * scale, 2 * scale, 0, 0, Math.PI);
        ctx.fill();

        // 이빨 (들쭉날쭉)
        ctx.fillStyle = '#d4d4a4';
        ctx.fillRect(-5 * scale, 8 * scale, 2 * scale, 3 * scale);
        ctx.fillRect(-2 * scale, 8 * scale, 2 * scale, 4 * scale);
        ctx.fillRect(2 * scale, 8 * scale, 2 * scale, 3 * scale);
        ctx.fillRect(4 * scale, 8 * scale, 2 * scale, 2 * scale);

        ctx.restore(); // 머리 끝

        ctx.restore(); // 회전 끝

        // 공격 이펙트
        if (this.attackAnimTimer > 0 && !this.ranged) {
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, this.attackRange, this.angle - 0.6, this.angle + 0.6);
            ctx.stroke();
        }

        // 체력바 (보스, 브루트)
        if ((this.type === 'boss' || this.type === 'brute') && this.isAlive) {
            const barWidth = this.size * 1.8;
            const barHeight = 8;
            const healthPercent = this.health / this.maxHealth;

            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.roundRect(-barWidth / 2, -this.size / 2 - 30, barWidth, barHeight, 3);
            ctx.fill();

            ctx.fillStyle = healthPercent > 0.3 ? '#4caf50' : '#f44336';
            ctx.beginPath();
            ctx.roundRect(-barWidth / 2 + 1, -this.size / 2 - 29, (barWidth - 2) * healthPercent, barHeight - 2, 2);
            ctx.fill();

            if (this.type === 'boss') {
                ctx.fillStyle = '#ff3333';
                ctx.font = `bold ${14 * scale}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('BOSS', 0, -this.size / 2 - 38);
            }
        }

        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x - this.size / 2,
            y: this.y - this.size / 2,
            width: this.size,
            height: this.size,
            radius: this.size / 2
        };
    }
}

class EnemyProjectile {
    constructor(x, y, targetX, targetY, damage, speed) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.speed = speed;
        this.size = 12;

        const angle = Utils.angle(x, y, targetX, targetY);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.angle = angle;

        this.lifetime = 3000;
        this.age = 0;
    }

    update(deltaTime) {
        this.x += this.vx * (deltaTime / 16);
        this.y += this.vy * (deltaTime / 16);
        this.age += deltaTime;
        return this.age < this.lifetime;
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);

        // 독침
        ctx.fillStyle = '#88ff44';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-8, -8);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-8, 8);
        ctx.closePath();
        ctx.fill();

        // 독 효과
        ctx.fillStyle = 'rgba(100, 255, 50, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    getHitbox() {
        return { x: this.x, y: this.y, radius: this.size };
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.projectiles = [];
        this.spawnQueue = [];
        this.totalKills = 0;
    }

    reset() {
        this.enemies = [];
        this.projectiles = [];
        this.spawnQueue = [];
    }

    spawn(type, x, y) {
        const enemy = new Enemy(type, x, y);
        this.enemies.push(enemy);
        return enemy;
    }

    spawnWave(waveData, mapBounds) {
        for (const spawn of waveData) {
            const x = spawn.x || Utils.randomFloat(mapBounds.minX + 100, mapBounds.maxX - 100);
            const y = spawn.y || Utils.randomFloat(mapBounds.minY + 100, mapBounds.maxY - 100);

            if (spawn.delay) {
                this.spawnQueue.push({ type: spawn.type, x, y, delay: spawn.delay, timer: 0 });
            } else {
                this.spawn(spawn.type, x, y);
            }
        }
    }

    update(playerX, playerY, deltaTime) {
        for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
            this.spawnQueue[i].timer += deltaTime;
            if (this.spawnQueue[i].timer >= this.spawnQueue[i].delay) {
                const spawn = this.spawnQueue.splice(i, 1)[0];
                this.spawn(spawn.type, spawn.x, spawn.y);
            }
        }

        const attackingEnemies = [];

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const stillActive = enemy.update(playerX, playerY, deltaTime);

            if (!stillActive) {
                this.enemies.splice(i, 1);
                continue;
            }

            if (enemy.isAttacking && enemy.isAlive) {
                enemy.isAttacking = false;

                if (enemy.ranged) {
                    this.projectiles.push(new EnemyProjectile(
                        enemy.x, enemy.y, playerX, playerY,
                        enemy.damage, enemy.projectileSpeed
                    ));
                } else {
                    attackingEnemies.push(enemy);
                }

                Audio.play('zombieAttack');
            }
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            if (!this.projectiles[i].update(deltaTime)) {
                this.projectiles.splice(i, 1);
            }
        }

        return attackingEnemies;
    }

    checkProjectileHit(playerX, playerY, playerRadius) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            const dist = Utils.distance(proj.x, proj.y, playerX, playerY);

            if (dist < proj.size + playerRadius) {
                const damage = proj.damage;
                this.projectiles.splice(i, 1);
                return damage;
            }
        }
        return 0;
    }

    draw(ctx, cameraX, cameraY) {
        for (const proj of this.projectiles) {
            proj.draw(ctx, cameraX, cameraY);
        }

        const sortedEnemies = [...this.enemies].sort((a, b) => a.y - b.y);
        for (const enemy of sortedEnemies) {
            enemy.draw(ctx, cameraX, cameraY);
        }
    }

    getAliveCount() {
        return this.enemies.filter(e => e.isAlive).length;
    }

    getEnemyAt(x, y, range) {
        for (const enemy of this.enemies) {
            if (!enemy.isAlive) continue;
            const dist = Utils.distance(x, y, enemy.x, enemy.y);
            if (dist < enemy.size / 2 + range) return enemy;
        }
        return null;
    }

    damageArea(x, y, radius, damage) {
        let hits = 0;
        for (const enemy of this.enemies) {
            if (!enemy.isAlive) continue;
            const dist = Utils.distance(x, y, enemy.x, enemy.y);
            if (dist < radius + enemy.size / 2) {
                const killed = enemy.takeDamage(damage);
                if (killed) this.totalKills++;
                hits++;
            }
        }
        return hits;
    }
}
