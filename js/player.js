// 플레이어 시스템

class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 40;
        this.height = 40;
        this.radius = 20;

        this.maxHealth = 100;
        this.health = 100;

        this.speed = 4;
        this.angle = 0;

        // 이동 상태
        this.moveX = 0;
        this.moveY = 0;
        this.isMoving = false;

        // 전투 상태
        this.isShooting = false;
        this.lastDamageTime = 0;
        this.invincibleTime = 500; // 피격 후 무적 시간

        // 애니메이션
        this.walkFrame = 0;
        this.walkTimer = 0;

        // 통계
        this.shotsFired = 0;
        this.shotsHit = 0;

        // 무기 관리자
        this.weapons = new WeaponManager();
    }

    init(x, y) {
        this.x = x;
        this.y = y;
        this.health = this.maxHealth;
        this.shotsFired = 0;
        this.shotsHit = 0;
        this.weapons.init();
    }

    update(deltaTime, level) {
        // 이동 처리
        if (this.moveX !== 0 || this.moveY !== 0) {
            this.isMoving = true;

            // 걷기 애니메이션
            this.walkTimer += deltaTime;
            if (this.walkTimer > 150) {
                this.walkTimer = 0;
                this.walkFrame = (this.walkFrame + 1) % 4;
            }

            // 대각선 이동 정규화
            let dx = this.moveX;
            let dy = this.moveY;
            const magnitude = Math.sqrt(dx * dx + dy * dy);

            if (magnitude > 0) {
                dx = (dx / magnitude) * this.speed * (deltaTime / 16);
                dy = (dy / magnitude) * this.speed * (deltaTime / 16);
            }

            // 새 위치 계산
            const newX = this.x + dx;
            const newY = this.y + dy;

            // 충돌 체크
            const bounds = level.getMapBounds();
            const collision = level.checkCollision(
                newX - this.width / 2,
                newY - this.height / 2,
                this.width,
                this.height
            );

            // X축 이동
            if (!level.checkCollision(newX - this.width / 2, this.y - this.height / 2, this.width, this.height)) {
                this.x = Utils.clamp(newX, bounds.minX, bounds.maxX);
            }

            // Y축 이동
            if (!level.checkCollision(this.x - this.width / 2, newY - this.height / 2, this.width, this.height)) {
                this.y = Utils.clamp(newY, bounds.minY, bounds.maxY);
            }
        } else {
            this.isMoving = false;
            this.walkFrame = 0;
        }

        // 무기 업데이트
        this.weapons.update();
    }

    setMovement(x, y) {
        this.moveX = Utils.clamp(x, -1, 1);
        this.moveY = Utils.clamp(y, -1, 1);
    }

    setAngle(angle) {
        this.angle = angle;
    }

    lookAt(targetX, targetY) {
        this.angle = Utils.angle(this.x, this.y, targetX, targetY);
    }

    shoot(enemies) {
        const weapon = this.weapons.getCurrentWeapon();
        const bullets = weapon.fire();

        if (!bullets) return [];

        this.shotsFired += bullets.length;
        const hits = [];

        for (const bullet of bullets) {
            const hitResult = this.processShot(bullet, enemies);
            if (hitResult) {
                hits.push(hitResult);
            }
        }

        return hits;
    }

    processShot(bullet, enemies) {
        const weapon = this.weapons.getCurrentWeapon();

        if (weapon.type === WeaponTypes.MELEE) {
            // 근접 공격 - 부채꼴 범위
            for (const enemy of enemies) {
                if (!enemy.isAlive) continue;

                const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
                if (dist > bullet.range) continue;

                const angleToEnemy = Utils.angle(this.x, this.y, enemy.x, enemy.y);
                let angleDiff = Math.abs(this.angle - angleToEnemy);
                if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

                if (angleDiff < Math.PI / 3) { // 60도 범위
                    this.shotsHit++;
                    const killed = enemy.takeDamage(bullet.damage);
                    return { enemy, killed, damage: bullet.damage };
                }
            }
        } else {
            // 원거리 공격 - 레이캐스트 (조준 방향으로 발사)
            const spreadAngle = this.angle + Utils.toRadians(bullet.spread);
            const endX = this.x + Math.cos(spreadAngle) * bullet.range;
            const endY = this.y + Math.sin(spreadAngle) * bullet.range;

            let closestEnemy = null;
            let closestDist = bullet.range;

            for (const enemy of enemies) {
                if (!enemy.isAlive) continue;

                // 레이와 원의 교차 판정
                const hit = this.rayCircleIntersect(
                    this.x, this.y, endX, endY,
                    enemy.x, enemy.y, enemy.size / 2 + 5 // 약간의 여유 추가
                );

                if (hit && hit.distance < closestDist) {
                    closestDist = hit.distance;
                    closestEnemy = enemy;
                }
            }

            if (closestEnemy) {
                this.shotsHit++;
                const killed = closestEnemy.takeDamage(bullet.damage);
                return {
                    enemy: closestEnemy,
                    killed,
                    damage: bullet.damage,
                    hitX: this.x + Math.cos(spreadAngle) * closestDist,
                    hitY: this.y + Math.sin(spreadAngle) * closestDist
                };
            }
        }

        return null;
    }

    rayCircleIntersect(x1, y1, x2, y2, cx, cy, r) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const fx = x1 - cx;
        const fy = y1 - cy;

        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = fx * fx + fy * fy - r * r;

        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) return null;

        const t = (-b - Math.sqrt(discriminant)) / (2 * a);

        if (t >= 0 && t <= 1) {
            return {
                x: x1 + t * dx,
                y: y1 + t * dy,
                distance: t * Math.sqrt(a)
            };
        }

        return null;
    }

    takeDamage(damage) {
        const now = Date.now();

        // 무적 시간 체크
        if (now - this.lastDamageTime < this.invincibleTime) {
            return false;
        }

        this.lastDamageTime = now;
        this.health -= damage;
        this.health = Math.max(0, this.health);

        Audio.play('playerHit');

        return this.health <= 0;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    getAccuracy() {
        if (this.shotsFired === 0) return 0;
        return Math.round((this.shotsHit / this.shotsFired) * 100);
    }

    isInvincible() {
        return Date.now() - this.lastDamageTime < this.invincibleTime;
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.translate(screenX, screenY);

        // 무적 시간 깜빡임
        if (this.isInvincible()) {
            ctx.globalAlpha = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;
        }

        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 18, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 몸체 (사람 모양)
        ctx.save();
        ctx.rotate(this.angle + Math.PI / 2); // 캐릭터가 조준 방향을 바라보게

        // 다리
        const legOffset = this.isMoving ? Math.sin(this.walkFrame * Math.PI / 2) * 5 : 0;
        ctx.fillStyle = '#2c3e50'; // 바지
        ctx.fillRect(-8, 5, 6, 18 + legOffset);
        ctx.fillRect(2, 5, 6, 18 - legOffset);

        // 몸통
        ctx.fillStyle = '#3498db'; // 파란 셔츠
        ctx.fillRect(-10, -10, 20, 18);

        // 조끼/갑옷
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(-8, -8, 16, 12);

        // 머리
        ctx.fillStyle = '#f5d0a9'; // 피부색
        ctx.beginPath();
        ctx.arc(0, -18, 10, 0, Math.PI * 2);
        ctx.fill();

        // 헬멧
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.arc(0, -20, 11, Math.PI, 0);
        ctx.fill();

        // 눈
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-4, -18, 3, 0, Math.PI * 2);
        ctx.arc(4, -18, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(-4, -18, 1.5, 0, Math.PI * 2);
        ctx.arc(4, -18, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 팔
        const weapon = this.weapons.getCurrentWeapon();
        ctx.fillStyle = '#f5d0a9';

        if (weapon.type === WeaponTypes.MELEE) {
            // 나이프 들고 있는 팔
            ctx.save();
            ctx.translate(12, -5);
            ctx.rotate(-0.3);
            ctx.fillRect(-3, -3, 6, 20);
            // 나이프
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(-2, 17, 4, 15);
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            ctx.moveTo(-2, 32);
            ctx.lineTo(0, 38);
            ctx.lineTo(2, 32);
            ctx.fill();
            ctx.restore();

            ctx.fillStyle = '#f5d0a9';
            ctx.fillRect(-15, -5, 6, 15);
        } else {
            // 총 들고 있는 양팔
            ctx.fillRect(-15, -8, 6, 18);
            ctx.fillRect(9, -8, 6, 18);

            // 총
            ctx.fillStyle = '#2c2c2c';
            ctx.fillRect(-5, -25, 10, 25);
            // 총구
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(-3, -35, 6, 12);
            // 손잡이
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(-4, 0, 8, 8);
        }

        ctx.restore();

        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
            radius: this.radius
        };
    }
}
