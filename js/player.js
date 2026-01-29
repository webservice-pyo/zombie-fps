// 플레이어 시스템

class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.radius = 25;

        this.maxHealth = 100;
        this.health = 100;

        this.speed = 4.5;
        this.angle = 0;

        // 이동 상태
        this.moveX = 0;
        this.moveY = 0;
        this.isMoving = false;

        // 전투 상태
        this.isShooting = false;
        this.lastDamageTime = 0;
        this.invincibleTime = 500;

        // 애니메이션
        this.walkFrame = 0;
        this.walkTimer = 0;
        this.armAngle = 0;

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
        if (this.moveX !== 0 || this.moveY !== 0) {
            this.isMoving = true;

            // 걷기 애니메이션
            this.walkTimer += deltaTime;
            if (this.walkTimer > 100) {
                this.walkTimer = 0;
                this.walkFrame = (this.walkFrame + 1) % 8;
            }

            let dx = this.moveX;
            let dy = this.moveY;
            const magnitude = Math.sqrt(dx * dx + dy * dy);

            if (magnitude > 0) {
                dx = (dx / magnitude) * this.speed * (deltaTime / 16);
                dy = (dy / magnitude) * this.speed * (deltaTime / 16);
            }

            const newX = this.x + dx;
            const newY = this.y + dy;

            const bounds = level.getMapBounds();

            if (!level.checkCollision(newX - this.width / 2, this.y - this.height / 2, this.width, this.height)) {
                this.x = Utils.clamp(newX, bounds.minX, bounds.maxX);
            }

            if (!level.checkCollision(this.x - this.width / 2, newY - this.height / 2, this.width, this.height)) {
                this.y = Utils.clamp(newY, bounds.minY, bounds.maxY);
            }
        } else {
            this.isMoving = false;
            this.walkFrame = 0;
        }

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

    takeDamage(damage) {
        const now = Date.now();

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

        if (this.isInvincible()) {
            ctx.globalAlpha = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;
        }

        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 22, 18, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.rotate(this.angle + Math.PI / 2);

        const legSwing = this.isMoving ? Math.sin(this.walkFrame * Math.PI / 4) * 8 : 0;

        // === 다리 ===
        ctx.fillStyle = '#1a1a2e'; // 진한 남색 바지

        // 왼쪽 다리
        ctx.save();
        ctx.translate(-6, 8);
        ctx.rotate(legSwing * 0.05);
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 22, 3);
        ctx.fill();
        // 신발
        ctx.fillStyle = '#0d0d0d';
        ctx.beginPath();
        ctx.roundRect(-5, 18, 10, 6, 2);
        ctx.fill();
        ctx.restore();

        // 오른쪽 다리
        ctx.fillStyle = '#1a1a2e';
        ctx.save();
        ctx.translate(6, 8);
        ctx.rotate(-legSwing * 0.05);
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 22, 3);
        ctx.fill();
        // 신발
        ctx.fillStyle = '#0d0d0d';
        ctx.beginPath();
        ctx.roundRect(-5, 18, 10, 6, 2);
        ctx.fill();
        ctx.restore();

        // === 몸통 ===
        // 몸통 기본
        ctx.fillStyle = '#2d5a2d'; // 군복 녹색
        ctx.beginPath();
        ctx.roundRect(-12, -15, 24, 28, 5);
        ctx.fill();

        // 방탄조끼
        ctx.fillStyle = '#3d3d3d';
        ctx.beginPath();
        ctx.roundRect(-10, -12, 20, 20, 4);
        ctx.fill();

        // 조끼 디테일
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(-8, -10, 16, 3);
        ctx.fillRect(-8, -4, 16, 3);
        ctx.fillRect(-8, 2, 16, 3);

        // 조끼 주머니
        ctx.fillStyle = '#353535';
        ctx.beginPath();
        ctx.roundRect(-8, 6, 7, 5, 1);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(1, 6, 7, 5, 1);
        ctx.fill();

        // === 머리 ===
        // 목
        ctx.fillStyle = '#e8c4a0';
        ctx.fillRect(-4, -20, 8, 8);

        // 얼굴
        ctx.fillStyle = '#f5d5b8';
        ctx.beginPath();
        ctx.arc(0, -28, 12, 0, Math.PI * 2);
        ctx.fill();

        // 헬멧
        ctx.fillStyle = '#2d4a2d';
        ctx.beginPath();
        ctx.arc(0, -30, 13, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(-14, -32, 28, 8, 3);
        ctx.fill();

        // 헬멧 밴드
        ctx.fillStyle = '#1a3a1a';
        ctx.fillRect(-13, -28, 26, 3);

        // 고글 (이마에)
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.roundRect(-10, -35, 20, 5, 2);
        ctx.fill();
        ctx.fillStyle = '#4a9fff';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.roundRect(-8, -34, 7, 3, 1);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(1, -34, 7, 3, 1);
        ctx.fill();
        ctx.globalAlpha = 1;

        // 눈
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(-4, -28, 3, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(4, -28, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c1810';
        ctx.beginPath();
        ctx.arc(-4, -28, 2, 0, Math.PI * 2);
        ctx.arc(4, -28, 2, 0, Math.PI * 2);
        ctx.fill();

        // 눈썹
        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-7, -33);
        ctx.lineTo(-1, -32);
        ctx.moveTo(7, -33);
        ctx.lineTo(1, -32);
        ctx.stroke();

        // 코
        ctx.fillStyle = '#e8c4a0';
        ctx.beginPath();
        ctx.moveTo(0, -27);
        ctx.lineTo(-2, -23);
        ctx.lineTo(2, -23);
        ctx.closePath();
        ctx.fill();

        // 입
        ctx.strokeStyle = '#a67c5a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -21, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // === 팔과 무기 ===
        const weapon = this.weapons.getCurrentWeapon();

        // 왼팔 (뒤쪽)
        ctx.fillStyle = '#2d5a2d';
        ctx.save();
        ctx.translate(-14, -10);
        ctx.rotate(0.3);
        ctx.beginPath();
        ctx.roundRect(-3, 0, 7, 18, 3);
        ctx.fill();
        // 손
        ctx.fillStyle = '#f5d5b8';
        ctx.beginPath();
        ctx.arc(0, 20, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 오른팔 (무기 잡는 손)
        ctx.fillStyle = '#2d5a2d';
        ctx.save();
        ctx.translate(14, -10);
        ctx.rotate(-0.3 + this.armAngle);
        ctx.beginPath();
        ctx.roundRect(-4, 0, 7, 18, 3);
        ctx.fill();
        // 손
        ctx.fillStyle = '#f5d5b8';
        ctx.beginPath();
        ctx.arc(0, 20, 5, 0, Math.PI * 2);
        ctx.fill();

        // 무기
        if (weapon.type === WeaponTypes.MELEE) {
            // 나이프
            ctx.fillStyle = '#8b7355';
            ctx.beginPath();
            ctx.roundRect(-2, 22, 5, 10, 1);
            ctx.fill();
            ctx.fillStyle = '#c0c0c0';
            ctx.beginPath();
            ctx.moveTo(0, 32);
            ctx.lineTo(-3, 32);
            ctx.lineTo(0, 52);
            ctx.lineTo(3, 32);
            ctx.closePath();
            ctx.fill();
            // 칼날 하이라이트
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.moveTo(0, 33);
            ctx.lineTo(-1, 33);
            ctx.lineTo(0, 48);
            ctx.closePath();
            ctx.fill();
        } else {
            // 총
            ctx.fillStyle = '#1a1a1a';
            // 총몸
            ctx.beginPath();
            ctx.roundRect(-4, 18, 8, 35, 2);
            ctx.fill();
            // 총구
            ctx.fillStyle = '#0d0d0d';
            ctx.beginPath();
            ctx.roundRect(-3, 50, 6, 12, 1);
            ctx.fill();
            // 손잡이
            ctx.fillStyle = '#3d2817';
            ctx.beginPath();
            ctx.roundRect(-3, 20, 7, 12, 2);
            ctx.fill();
            // 조준경
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.roundRect(-2, 28, 4, 8, 1);
            ctx.fill();
            // 탄창
            ctx.fillStyle = '#2a2a2a';
            ctx.beginPath();
            ctx.roundRect(2, 35, 6, 12, 1);
            ctx.fill();
        }
        ctx.restore();

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
