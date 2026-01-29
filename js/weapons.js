// 무기 시스템

const WeaponTypes = {
    MELEE: 'melee',
    PISTOL: 'pistol',
    RIFLE: 'rifle',
    SHOTGUN: 'shotgun'
};

const WeaponData = {
    knife: {
        name: '전투 나이프',
        type: WeaponTypes.MELEE,
        icon: '🔪',
        damage: 35,
        range: 80,
        attackSpeed: 400, // ms
        ammo: Infinity,
        maxAmmo: Infinity,
        reloadTime: 0,
        spread: 0,
        sound: null,
        description: '조용하고 빠른 근접 무기'
    },

    pistol: {
        name: '권총',
        type: WeaponTypes.PISTOL,
        icon: '🔫',
        damage: 25,
        range: 400,
        attackSpeed: 300,
        ammo: 12,
        maxAmmo: 12,
        reserveAmmo: 60,
        reloadTime: 1500,
        spread: 3,
        sound: 'pistol',
        description: '기본적인 반자동 권총'
    },

    rifle: {
        name: '돌격소총',
        type: WeaponTypes.RIFLE,
        icon: '🔫',
        damage: 30,
        range: 500,
        attackSpeed: 120,
        ammo: 30,
        maxAmmo: 30,
        reserveAmmo: 120,
        reloadTime: 2000,
        spread: 5,
        sound: 'rifle',
        auto: true,
        description: '연사가 가능한 돌격소총'
    },

    shotgun: {
        name: '샷건',
        type: WeaponTypes.SHOTGUN,
        icon: '🔫',
        damage: 15, // per pellet
        pellets: 8,
        range: 250,
        attackSpeed: 800,
        ammo: 6,
        maxAmmo: 6,
        reserveAmmo: 30,
        reloadTime: 2500,
        spread: 15,
        sound: 'shotgun',
        description: '근거리에서 강력한 산탄총'
    }
};

class Weapon {
    constructor(weaponId) {
        const data = WeaponData[weaponId];
        this.id = weaponId;
        this.name = data.name;
        this.type = data.type;
        this.icon = data.icon;
        this.damage = data.damage;
        this.range = data.range;
        this.attackSpeed = data.attackSpeed;
        this.currentAmmo = data.ammo;
        this.maxAmmo = data.maxAmmo;
        this.reserveAmmo = data.reserveAmmo || 0;
        this.reloadTime = data.reloadTime;
        this.spread = data.spread;
        this.sound = data.sound;
        this.auto = data.auto || false;
        this.pellets = data.pellets || 1;
        this.description = data.description;

        this.lastFireTime = 0;
        this.isReloading = false;
        this.reloadStartTime = 0;
    }

    canFire() {
        const now = Date.now();
        if (this.isReloading) return false;
        if (now - this.lastFireTime < this.attackSpeed) return false;
        if (this.type !== WeaponTypes.MELEE && this.currentAmmo <= 0) return false;
        return true;
    }

    fire() {
        if (!this.canFire()) {
            if (this.currentAmmo <= 0 && this.type !== WeaponTypes.MELEE) {
                Audio.play('empty');
            }
            return null;
        }

        this.lastFireTime = Date.now();

        if (this.type !== WeaponTypes.MELEE) {
            this.currentAmmo--;
        }

        if (this.sound) {
            Audio.play(this.sound);
        }

        // 탄환 정보 반환
        const bullets = [];
        for (let i = 0; i < this.pellets; i++) {
            bullets.push({
                damage: this.damage,
                range: this.range,
                spread: (Math.random() - 0.5) * this.spread * 2
            });
        }

        return bullets;
    }

    startReload() {
        if (this.isReloading) return false;
        if (this.type === WeaponTypes.MELEE) return false;
        if (this.currentAmmo >= this.maxAmmo) return false;
        if (this.reserveAmmo <= 0) return false;

        this.isReloading = true;
        this.reloadStartTime = Date.now();
        Audio.play('reload');

        return true;
    }

    updateReload() {
        if (!this.isReloading) return false;

        const elapsed = Date.now() - this.reloadStartTime;
        if (elapsed >= this.reloadTime) {
            this.finishReload();
            return true;
        }

        return false;
    }

    finishReload() {
        const needed = this.maxAmmo - this.currentAmmo;
        const available = Math.min(needed, this.reserveAmmo);

        this.currentAmmo += available;
        this.reserveAmmo -= available;
        this.isReloading = false;
    }

    cancelReload() {
        this.isReloading = false;
    }

    getReloadProgress() {
        if (!this.isReloading) return 0;
        const elapsed = Date.now() - this.reloadStartTime;
        return Math.min(elapsed / this.reloadTime, 1);
    }

    addAmmo(amount) {
        this.reserveAmmo += amount;
    }

    getAmmoDisplay() {
        if (this.type === WeaponTypes.MELEE) {
            return '∞';
        }
        return `${this.currentAmmo}/${this.reserveAmmo}`;
    }
}

class WeaponManager {
    constructor() {
        this.weapons = [];
        this.currentIndex = 0;
        this.unlockedSlots = [true, true, false]; // 나이프, 권총은 기본, 3번째 슬롯은 잠금
    }

    init() {
        this.weapons = [
            new Weapon('knife'),
            new Weapon('pistol')
        ];
        this.currentIndex = 1; // 권총으로 시작
    }

    getCurrentWeapon() {
        return this.weapons[this.currentIndex];
    }

    switchWeapon(index) {
        if (index < 0 || index >= this.weapons.length) return false;
        if (!this.unlockedSlots[index]) return false;

        const currentWeapon = this.getCurrentWeapon();
        if (currentWeapon.isReloading) {
            currentWeapon.cancelReload();
        }

        this.currentIndex = index;
        Audio.play('click');
        return true;
    }

    nextWeapon() {
        let nextIndex = this.currentIndex;
        do {
            nextIndex = (nextIndex + 1) % this.weapons.length;
        } while (!this.unlockedSlots[nextIndex] && nextIndex !== this.currentIndex);

        return this.switchWeapon(nextIndex);
    }

    prevWeapon() {
        let prevIndex = this.currentIndex;
        do {
            prevIndex = (prevIndex - 1 + this.weapons.length) % this.weapons.length;
        } while (!this.unlockedSlots[prevIndex] && prevIndex !== this.currentIndex);

        return this.switchWeapon(prevIndex);
    }

    unlockWeapon(weaponId) {
        // 새 무기 추가 및 슬롯 해금
        const weapon = new Weapon(weaponId);
        if (this.weapons.length < 3) {
            this.weapons.push(weapon);
            this.unlockedSlots[this.weapons.length - 1] = true;
        } else {
            // 3번째 슬롯에 무기 교체
            this.weapons[2] = weapon;
            this.unlockedSlots[2] = true;
        }
        return weapon;
    }

    addAmmoToWeapon(weaponType, amount) {
        for (const weapon of this.weapons) {
            if (weapon.type === weaponType || weapon.id === weaponType) {
                weapon.addAmmo(amount);
                return true;
            }
        }
        return false;
    }

    update() {
        const weapon = this.getCurrentWeapon();
        weapon.updateReload();
    }
}
