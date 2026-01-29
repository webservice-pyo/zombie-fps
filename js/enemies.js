// 적 시스템 - 좀비 종류 및 AI

const EnemyTypes = {
    WALKER: 'walker',      // 기본 좀비
    RUNNER: 'runner',      // 빠른 좀비
    BRUTE: 'brute',        // 탱커 좀비
    SPITTER: 'spitter',    // 원거리 좀비
    BOSS: 'boss'           // 보스
};

const EnemyData = {
    walker: {
        name: '워커',
        emoji: '🧟',
        color: '#5a8a5a',
        health: 60,
        damage: 10,
        speed: 1.2,
        attackRange: 50,
        attackSpeed: 1200,
        size: 30,
        score: 10,
        description: '느리지만 꾸준히 다가오는 기본 좀비'
    },

    runner: {
        name: '러너',
        emoji: '🏃',
        color: '#8a5a5a',
        health: 40,
        damage: 15,
        speed: 2.5,
        attackRange: 45,
        attackSpeed: 800,
        size: 25,
        score: 20,
        description: '빠르게 달려오는 좀비'
    },

    brute: {
        name: '브루트',
        emoji: '👹',
        color: '#5a5a8a',
        health: 200,
        damage: 25,
        speed: 0.8,
        attackRange: 60,
        attackSpeed: 1500,
        size: 45,
        score: 50,
        description: '크고 강한 탱커 좀비'
    },

    spitter: {
        name: '스피터',
        emoji: '🤮',
        color: '#8a8a5a',
        health: 50,
        damage: 12,
        speed: 1.0,
        attackRange: 200,
        attackSpeed: 2000,
        size: 28,
        score: 30,
        ranged: true,
        projectileSpeed: 4,
        description: '독을 뱉는 원거리 좀비'
    },

    boss: {
        name: '보스',
        emoji: '👿',
        color: '#8b0000',
        health: 500,
        damage: 35,
        speed: 1.5,
        attackRange: 70,
        attackSpeed: 1000,
        size: 60,
        score: 200,
        description: '챕터 보스'
    }
};

class Enemy {
    constructor(type, x, y) {
        const data = EnemyData[type];

        this.id = Utils.generateId();
        this.type = type;
        this.name = data.name;
        this.emoji = data.emoji;
        this.color = data.color;

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

        // AI 상태
        this.state = 'idle';
        this.targetX = x;
        this.targetY = y;
        this.wanderTimer = 0;
        this.alertTimer = 0;

        // 시각 효과
        this.hitFlash = 0;
        this.deathTimer = 0;
        this.angle = 0;
    }

    update(playerX, playerY, deltaTime) {
        if (!this.isAlive) {
            this.deathTimer += deltaTime;
            return this.deathTimer < 500; // 0.5초 후 제거
        }

        // 히트 플래시 감소
        if (this.hitFlash > 0) {
            this.hitFlash -= deltaTime * 0.01;
        }

        // 공격 애니메이션
        if (this.attackAnimTimer > 0) {
            this.attackAnimTimer -= deltaTime;
        }

        // 플레이어와의 거리
        const distToPlayer = Utils.distance(this.x, this.y, playerX, playerY);
        const angleToPlayer = Utils.angle(this.x, this.y, playerX, playerY);

        // 시야 범위 (감지 거리)
        const detectRange = 300;
        const chaseRange = 500;

        // AI 상태 머신
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

        // 플레이어 감지
        if (distToPlayer < detectRange) {
            this.state = 'chase';
            this.alertTimer = 200; // 잠깐 멈춤 (발견 반응)
            return;
        }

        // 가끔 배회
        if (this.wanderTimer > 3000) {
            this.wanderTimer = 0;
            if (Math.random() < 0.5) {
                this.state = 'wander';
                this.targetX = this.x + (Math.random() - 0.5) * 200;
                this.targetY = this.y + (Math.random() - 0.5) * 200;
            }
        }
    }

    handleWander(distToPlayer, detectRange, deltaTime) {
        // 플레이어 감지
        if (distToPlayer < detectRange) {
            this.state = 'chase';
            return;
        }

        // 목표 지점으로 이동
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
        // 발견 반응 딜레이
        if (this.alertTimer > 0) {
            this.alertTimer -= deltaTime;
            return;
        }

        // 너무 멀면 포기
        if (distToPlayer > chaseRange) {
            this.state = 'idle';
            return;
        }

        // 공격 범위 안이면 공격
        if (distToPlayer <= this.attackRange) {
            this.state = 'attack';
            return;
        }

        // 추적
        this.angle = angleToPlayer;
        const moveSpeed = this.speed * (deltaTime / 16);
        this.x += Math.cos(angleToPlayer) * moveSpeed;
        this.y += Math.sin(angleToPlayer) * moveSpeed;
    }

    handleAttack(playerX, playerY, distToPlayer, angleToPlayer, deltaTime) {
        this.angle = angleToPlayer;

        // 범위 벗어나면 추적
        if (distToPlayer > this.attackRange * 1.5) {
            this.state = 'chase';
            return;
        }

        // 공격 쿨다운
        const now = Date.now();
        if (now - this.lastAttackTime >= this.attackSpeed) {
            this.lastAttackTime = now;
            this.attackAnimTimer = 200;
            this.isAttacking = true;
            return true; // 공격 성공
        }

        return false;
    }

    takeDamage(damage) {
        if (!this.isAlive) return false;

        this.health -= damage;
        this.hitFlash = 1;
        this.state = 'chase'; // 피격시 추적 모드로

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

        // 화면 밖이면 그리지 않음
        if (screenX < -100 || screenX > ctx.canvas.width + 100 ||
            screenY < -100 || screenY > ctx.canvas.height + 100) {
            return;
        }

        ctx.save();
        ctx.translate(screenX, screenY);

        // 죽음 애니메이션
        if (!this.isAlive) {
            const alpha = 1 - (this.deathTimer / 500);
            ctx.globalAlpha = alpha;
            ctx.rotate(this.deathTimer * 0.005);
        }

        // 몸체
        let bodyColor = this.color;
        if (this.hitFlash > 0) {
            bodyColor = '#ffffff';
        }

        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // 외곽선
        ctx.strokeStyle = Utils.adjustBrightness(this.color, -30);
        ctx.lineWidth = 2;
        ctx.stroke();

        // 방향 표시 (머리)
        ctx.save();
        ctx.rotate(this.angle);

        // 머리
        ctx.fillStyle = Utils.adjustBrightness(this.color, 20);
        ctx.beginPath();
        ctx.arc(this.size / 3, 0, this.size / 4, 0, Math.PI * 2);
        ctx.fill();

        // 눈
        ctx.fillStyle = this.state === 'chase' || this.state === 'attack' ? '#ff0000' : '#880000';
        ctx.beginPath();
        ctx.arc(this.size / 2.5, -3, 3, 0, Math.PI * 2);
        ctx.arc(this.size / 2.5, 3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 공격 이펙트
        if (this.attackAnimTimer > 0 && !this.ranged) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.attackRange, this.angle - 0.5, this.angle + 0.5);
            ctx.stroke();
        }

        // 체력바 (보스나 브루트만)
        if ((this.type === 'boss' || this.type === 'brute') && this.isAlive) {
            const barWidth = this.size * 1.5;
            const barHeight = 6;
            const healthPercent = this.health / this.maxHealth;

            ctx.fillStyle = '#333';
            ctx.fillRect(-barWidth / 2, -this.size / 2 - 15, barWidth, barHeight);

            ctx.fillStyle = healthPercent > 0.3 ? '#4caf50' : '#f44336';
            ctx.fillRect(-barWidth / 2, -this.size / 2 - 15, barWidth * healthPercent, barHeight);
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

// 원거리 투사체
class EnemyProjectile {
    constructor(x, y, targetX, targetY, damage, speed) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.speed = speed;
        this.size = 8;
        this.color = '#88ff88';

        const angle = Utils.angle(x, y, targetX, targetY);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.lifetime = 3000; // 3초 후 소멸
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

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 독 효과
        ctx.fillStyle = 'rgba(100, 255, 100, 0.3)';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            radius: this.size
        };
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
                this.spawnQueue.push({
                    type: spawn.type,
                    x: x,
                    y: y,
                    delay: spawn.delay,
                    timer: 0
                });
            } else {
                this.spawn(spawn.type, x, y);
            }
        }
    }

    update(playerX, playerY, deltaTime) {
        // 스폰 큐 처리
        for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
            this.spawnQueue[i].timer += deltaTime;
            if (this.spawnQueue[i].timer >= this.spawnQueue[i].delay) {
                const spawn = this.spawnQueue.splice(i, 1)[0];
                this.spawn(spawn.type, spawn.x, spawn.y);
            }
        }

        // 적 업데이트
        const attackingEnemies = [];

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const stillActive = enemy.update(playerX, playerY, deltaTime);

            if (!stillActive) {
                this.enemies.splice(i, 1);
                continue;
            }

            // 공격 체크
            if (enemy.isAttacking && enemy.isAlive) {
                enemy.isAttacking = false;

                if (enemy.ranged) {
                    // 원거리 공격
                    this.projectiles.push(new EnemyProjectile(
                        enemy.x, enemy.y,
                        playerX, playerY,
                        enemy.damage,
                        enemy.projectileSpeed
                    ));
                } else {
                    // 근접 공격
                    attackingEnemies.push(enemy);
                }

                Audio.play('zombieAttack');
            }
        }

        // 투사체 업데이트
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
        // 투사체 그리기
        for (const proj of this.projectiles) {
            proj.draw(ctx, cameraX, cameraY);
        }

        // 적 그리기 (Y 좌표순 정렬)
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
            if (dist < enemy.size / 2 + range) {
                return enemy;
            }
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
