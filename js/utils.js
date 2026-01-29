// 유틸리티 함수들

const Utils = {
    // 두 점 사이의 거리
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    // 두 점 사이의 각도 (라디안)
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    // 각도를 도(degree)로 변환
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    },

    // 도를 라디안으로 변환
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    // 범위 내로 값 제한
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    // 랜덤 정수
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 랜덤 실수
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    // 배열에서 랜덤 요소
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // 선형 보간
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    // 충돌 감지 (사각형)
    rectCollision(r1, r2) {
        return r1.x < r2.x + r2.width &&
               r1.x + r1.width > r2.x &&
               r1.y < r2.y + r2.height &&
               r1.y + r1.height > r2.y;
    },

    // 충돌 감지 (원)
    circleCollision(c1, c2) {
        const dist = this.distance(c1.x, c1.y, c2.x, c2.y);
        return dist < c1.radius + c2.radius;
    },

    // 점이 사각형 안에 있는지
    pointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.width &&
               py >= rect.y && py <= rect.y + rect.height;
    },

    // 시간 포맷 (mm:ss)
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // 디바이스 체크
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.matchMedia && window.matchMedia('(hover: none)').matches);
    },

    // 로컬 스토리지 저장
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('저장 실패:', e);
            return false;
        }
    },

    // 로컬 스토리지 로드
    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('로드 실패:', e);
            return null;
        }
    },

    // 화면 흔들림 효과
    shake(element, intensity = 5, duration = 200) {
        const originalTransform = element.style.transform;
        const startTime = Date.now();

        const shakeFrame = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                element.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shakeFrame);
            } else {
                element.style.transform = originalTransform;
            }
        };

        shakeFrame();
    },

    // 색상 밝기 조절
    adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = this.clamp((num >> 16) + amt, 0, 255);
        const G = this.clamp((num >> 8 & 0x00FF) + amt, 0, 255);
        const B = this.clamp((num & 0x0000FF) + amt, 0, 255);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    // 부드러운 이동 (가속/감속)
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    // UUID 생성
    generateId() {
        return 'xxxx-xxxx-xxxx'.replace(/x/g, () =>
            Math.floor(Math.random() * 16).toString(16)
        );
    }
};

// 벡터 클래스
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        if (scalar === 0) return new Vector2(0, 0);
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return this.divide(mag);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    static fromAngle(angle, magnitude = 1) {
        return new Vector2(
            Math.cos(angle) * magnitude,
            Math.sin(angle) * magnitude
        );
    }
}

// 오브젝트 풀 (성능 최적화)
class ObjectPool {
    constructor(createFunc, initialSize = 10) {
        this.createFunc = createFunc;
        this.pool = [];
        this.active = [];

        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFunc());
        }
    }

    get() {
        let obj = this.pool.pop();
        if (!obj) {
            obj = this.createFunc();
        }
        this.active.push(obj);
        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.pool.push(obj);
        }
    }

    releaseAll() {
        while (this.active.length > 0) {
            this.pool.push(this.active.pop());
        }
    }
}
