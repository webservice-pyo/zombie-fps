// 레벨 시스템 - 5개 챕터 정의

const LevelData = {
    // 챕터 1: 시작의 거리
    chapter1: {
        name: '챕터 1: 시작의 거리',
        description: '갑자기 좀비들이 나타났다. 안전한 곳을 찾아야 한다.',
        objective: '생존자 신호를 찾아라',
        mapSize: { width: 1500, height: 1200 },
        playerStart: { x: 200, y: 600 },
        backgroundColor: '#1a1a2e',
        floorColor: '#2a2a3e',

        // 맵 구조물
        structures: [
            { type: 'building', x: 400, y: 200, width: 200, height: 150, color: '#444' },
            { type: 'building', x: 800, y: 100, width: 250, height: 200, color: '#3a3a3a' },
            { type: 'building', x: 300, y: 500, width: 150, height: 180, color: '#4a4a4a' },
            { type: 'building', x: 700, y: 450, width: 180, height: 160, color: '#3d3d3d' },
            { type: 'building', x: 1000, y: 300, width: 200, height: 200, color: '#454545' },
            { type: 'car', x: 550, y: 350, width: 80, height: 40, color: '#555', rotation: 0.2 },
            { type: 'car', x: 900, y: 550, width: 80, height: 40, color: '#666', rotation: -0.3 },
            { type: 'barrier', x: 150, y: 300, width: 100, height: 20, color: '#f44' },
            { type: 'barrier', x: 600, y: 600, width: 120, height: 20, color: '#f44' },
        ],

        // 웨이브
        waves: [
            {
                trigger: 'start',
                enemies: [
                    { type: 'walker', x: 500, y: 300 },
                    { type: 'walker', x: 550, y: 350 },
                    { type: 'walker', x: 480, y: 400 },
                ]
            },
            {
                trigger: 'kills',
                killCount: 3,
                enemies: [
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'runner', delay: 2000 },
                ]
            },
            {
                trigger: 'kills',
                killCount: 7,
                enemies: [
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'walker', delay: 1500 },
                ]
            },
            {
                trigger: 'area',
                area: { x: 1100, y: 500, radius: 150 },
                message: '목표 지점에 도달했다!',
                isObjective: true
            }
        ],

        // 아이템
        items: [
            { type: 'health', x: 350, y: 350, amount: 30 },
            { type: 'ammo', x: 750, y: 250, weapon: 'pistol', amount: 24 },
            { type: 'ammo', x: 900, y: 450, weapon: 'pistol', amount: 12 },
        ],

        // 목표 지점
        objective: {
            x: 1200,
            y: 600,
            radius: 100,
            description: '생존자 신호 위치'
        },

        // 클리어 조건
        clearCondition: {
            type: 'reach',
            x: 1200,
            y: 600,
            radius: 80
        }
    },

    // 챕터 2: 지하도
    chapter2: {
        name: '챕터 2: 지하도',
        description: '지하도를 통해 안전 지대로 이동해야 한다.',
        objective: '지하도를 통과하라',
        mapSize: { width: 2000, height: 800 },
        playerStart: { x: 150, y: 400 },
        backgroundColor: '#0a0a15',
        floorColor: '#1a1a25',
        dark: true,

        structures: [
            // 지하도 벽
            { type: 'wall', x: 0, y: 100, width: 2000, height: 30, color: '#333' },
            { type: 'wall', x: 0, y: 670, width: 2000, height: 30, color: '#333' },
            // 기둥들
            { type: 'pillar', x: 300, y: 250, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 300, y: 500, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 600, y: 250, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 600, y: 500, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 900, y: 250, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 900, y: 500, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 1200, y: 250, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 1200, y: 500, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 1500, y: 250, width: 40, height: 40, color: '#444' },
            { type: 'pillar', x: 1500, y: 500, width: 40, height: 40, color: '#444' },
            // 장애물
            { type: 'debris', x: 450, y: 350, width: 100, height: 60, color: '#555' },
            { type: 'debris', x: 1000, y: 400, width: 80, height: 80, color: '#555' },
            { type: 'debris', x: 1350, y: 300, width: 120, height: 50, color: '#555' },
        ],

        waves: [
            {
                trigger: 'start',
                enemies: [
                    { type: 'walker', x: 400, y: 300 },
                    { type: 'walker', x: 400, y: 500 },
                ]
            },
            {
                trigger: 'area',
                area: { x: 500, y: 400, radius: 100 },
                enemies: [
                    { type: 'runner', x: 700, y: 250 },
                    { type: 'runner', x: 700, y: 550 },
                    { type: 'walker', x: 750, y: 400 },
                ]
            },
            {
                trigger: 'area',
                area: { x: 900, y: 400, radius: 100 },
                enemies: [
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'spitter', x: 1100, y: 200 },
                    { type: 'runner', delay: 1000 },
                ]
            },
            {
                trigger: 'area',
                area: { x: 1400, y: 400, radius: 100 },
                enemies: [
                    { type: 'brute', x: 1600, y: 400 },
                    { type: 'walker', delay: 500 },
                    { type: 'walker', delay: 500 },
                    { type: 'runner', delay: 1500 },
                ],
                message: '강력한 좀비가 나타났다!'
            }
        ],

        items: [
            { type: 'health', x: 500, y: 400, amount: 40 },
            { type: 'ammo', x: 800, y: 350, weapon: 'pistol', amount: 24 },
            { type: 'weapon', x: 1200, y: 400, weapon: 'rifle' },
            { type: 'ammo', x: 1600, y: 450, weapon: 'rifle', amount: 60 },
        ],

        clearCondition: {
            type: 'reach',
            x: 1900,
            y: 400,
            radius: 80
        }
    },

    // 챕터 3: 병원
    chapter3: {
        name: '챕터 3: 버려진 병원',
        description: '의료 물품을 확보하고 생존자를 구출하라.',
        objective: '병원에서 생존자를 찾아라',
        mapSize: { width: 1600, height: 1400 },
        playerStart: { x: 800, y: 1200 },
        backgroundColor: '#1a1f1a',
        floorColor: '#252f25',

        structures: [
            // 병원 외벽 (입구 열림)
            { type: 'wall', x: 100, y: 100, width: 1400, height: 40, color: '#ddd' },
            { type: 'wall', x: 100, y: 100, width: 40, height: 900, color: '#ddd' },
            { type: 'wall', x: 1460, y: 100, width: 40, height: 900, color: '#ddd' },
            // 아래 벽 (중앙 입구 열림 - 700~900)
            { type: 'wall', x: 100, y: 960, width: 600, height: 40, color: '#ddd' },
            { type: 'wall', x: 900, y: 960, width: 600, height: 40, color: '#ddd' },
            // 내부 벽 (통로 열림)
            { type: 'wall', x: 400, y: 140, width: 30, height: 300, color: '#ccc' },
            { type: 'wall', x: 400, y: 540, width: 30, height: 300, color: '#ccc' },
            { type: 'wall', x: 1100, y: 140, width: 30, height: 300, color: '#ccc' },
            { type: 'wall', x: 1100, y: 540, width: 30, height: 300, color: '#ccc' },
            // 복도 벽 (통로 열림)
            { type: 'wall', x: 140, y: 450, width: 260, height: 30, color: '#ccc' },
            { type: 'wall', x: 1130, y: 450, width: 290, height: 30, color: '#ccc' },
            // 침대들
            { type: 'bed', x: 200, y: 200, width: 80, height: 40, color: '#666' },
            { type: 'bed', x: 200, y: 300, width: 80, height: 40, color: '#666' },
            { type: 'bed', x: 550, y: 200, width: 80, height: 40, color: '#666' },
            { type: 'bed', x: 550, y: 300, width: 80, height: 40, color: '#666' },
            { type: 'bed', x: 950, y: 200, width: 80, height: 40, color: '#666' },
            { type: 'bed', x: 950, y: 300, width: 80, height: 40, color: '#666' },
            // 책상
            { type: 'desk', x: 700, y: 600, width: 100, height: 50, color: '#654' },
            { type: 'desk', x: 700, y: 750, width: 100, height: 50, color: '#654' },
        ],

        waves: [
            {
                trigger: 'start',
                enemies: [
                    { type: 'walker', x: 300, y: 700 },
                    { type: 'walker', x: 700, y: 500 },
                    { type: 'spitter', x: 1200, y: 600 },
                ]
            },
            {
                trigger: 'area',
                area: { x: 300, y: 300, radius: 150 },
                enemies: [
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'walker' },
                    { type: 'walker', delay: 1000 },
                ]
            },
            {
                trigger: 'area',
                area: { x: 1200, y: 300, radius: 150 },
                enemies: [
                    { type: 'brute' },
                    { type: 'spitter' },
                    { type: 'walker' },
                    { type: 'walker' },
                ]
            },
            {
                trigger: 'area',
                area: { x: 750, y: 300, radius: 150 },
                enemies: [
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'runner' },
                ],
                message: '생존자 근처에 좀비 무리가 있다!'
            }
        ],

        items: [
            { type: 'health', x: 250, y: 250, amount: 50 },
            { type: 'health', x: 600, y: 600, amount: 50 },
            { type: 'ammo', x: 800, y: 500, weapon: 'rifle', amount: 30 },
            { type: 'ammo', x: 1200, y: 500, weapon: 'rifle', amount: 30 },
            { type: 'health', x: 750, y: 300, amount: 30 },
        ],

        // NPC (생존자)
        npcs: [
            {
                id: 'survivor1',
                name: '민준',
                x: 750,
                y: 250,
                emoji: '👨',
                dialog: [
                    '감사합니다! 여기서 3일을 버텼어요.',
                    '다른 생존자들이 경찰서에 모였다고 들었어요.',
                    '같이 가요!'
                ]
            }
        ],

        clearCondition: {
            type: 'npc',
            npcId: 'survivor1'
        }
    },

    // 챕터 4: 경찰서
    chapter4: {
        name: '챕터 4: 최후의 경찰서',
        description: '경찰서에서 무기를 확보하고 방어선을 구축하라.',
        objective: '경찰서를 방어하라',
        mapSize: { width: 1400, height: 1400 },
        playerStart: { x: 700, y: 700 },
        backgroundColor: '#1a1a25',
        floorColor: '#2a2a35',
        defense: true,

        structures: [
            // 경찰서 건물
            { type: 'building', x: 400, y: 400, width: 600, height: 600, color: '#4a4a5a', hollow: true },
            // 입구
            { type: 'wall', x: 400, y: 650, width: 50, height: 100, color: '#5a5a6a' },
            { type: 'wall', x: 950, y: 650, width: 50, height: 100, color: '#5a5a6a' },
            // 바리케이드
            { type: 'barrier', x: 300, y: 400, width: 80, height: 30, color: '#f44' },
            { type: 'barrier', x: 1020, y: 400, width: 80, height: 30, color: '#f44' },
            { type: 'barrier', x: 300, y: 950, width: 80, height: 30, color: '#f44' },
            { type: 'barrier', x: 1020, y: 950, width: 80, height: 30, color: '#f44' },
            // 내부
            { type: 'desk', x: 500, y: 500, width: 100, height: 50, color: '#654' },
            { type: 'desk', x: 800, y: 500, width: 100, height: 50, color: '#654' },
            { type: 'desk', x: 500, y: 850, width: 100, height: 50, color: '#654' },
            { type: 'desk', x: 800, y: 850, width: 100, height: 50, color: '#654' },
        ],

        waves: [
            {
                trigger: 'start',
                message: '웨이브 1: 좀비들이 밀려온다!',
                enemies: [
                    { type: 'walker', x: 100, y: 200 },
                    { type: 'walker', x: 200, y: 100 },
                    { type: 'walker', x: 1200, y: 100 },
                    { type: 'walker', x: 1300, y: 200 },
                ]
            },
            {
                trigger: 'kills',
                killCount: 4,
                message: '웨이브 2!',
                enemies: [
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'walker', delay: 2000 },
                    { type: 'walker', delay: 2000 },
                ]
            },
            {
                trigger: 'kills',
                killCount: 10,
                message: '웨이브 3: 더 많은 좀비들!',
                enemies: [
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'spitter' },
                    { type: 'brute', delay: 3000 },
                ]
            },
            {
                trigger: 'kills',
                killCount: 17,
                message: '최종 웨이브!',
                enemies: [
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'brute' },
                    { type: 'spitter' },
                    { type: 'spitter' },
                    { type: 'walker', delay: 1000 },
                    { type: 'walker', delay: 1000 },
                    { type: 'walker', delay: 2000 },
                    { type: 'runner', delay: 3000 },
                ]
            }
        ],

        items: [
            { type: 'weapon', x: 700, y: 600, weapon: 'shotgun' },
            { type: 'ammo', x: 550, y: 550, weapon: 'shotgun', amount: 12 },
            { type: 'ammo', x: 850, y: 550, weapon: 'rifle', amount: 60 },
            { type: 'health', x: 700, y: 800, amount: 50 },
            { type: 'ammo', x: 550, y: 900, weapon: 'shotgun', amount: 12 },
            { type: 'ammo', x: 850, y: 900, weapon: 'pistol', amount: 24 },
        ],

        clearCondition: {
            type: 'survive',
            killCount: 27
        }
    },

    // 챕터 5: 탈출
    chapter5: {
        name: '챕터 5: 최후의 탈출',
        description: '헬기 착륙 지점까지 도달하라.',
        objective: '헬기 착륙장으로 이동하라',
        mapSize: { width: 2500, height: 1200 },
        playerStart: { x: 150, y: 600 },
        backgroundColor: '#252525',
        floorColor: '#353535',

        structures: [
            // 길
            { type: 'building', x: 300, y: 200, width: 150, height: 300, color: '#444' },
            { type: 'building', x: 300, y: 700, width: 150, height: 300, color: '#444' },
            { type: 'car', x: 500, y: 400, width: 80, height: 40, color: '#666' },
            { type: 'car', x: 550, y: 700, width: 80, height: 40, color: '#555' },
            { type: 'building', x: 700, y: 100, width: 200, height: 250, color: '#3a3a3a' },
            { type: 'building', x: 700, y: 850, width: 200, height: 250, color: '#3a3a3a' },
            { type: 'barrier', x: 900, y: 500, width: 150, height: 30, color: '#f44' },
            { type: 'barrier', x: 900, y: 670, width: 150, height: 30, color: '#f44' },
            { type: 'building', x: 1100, y: 300, width: 180, height: 200, color: '#454545' },
            { type: 'building', x: 1100, y: 700, width: 180, height: 200, color: '#454545' },
            { type: 'car', x: 1350, y: 550, width: 80, height: 40, color: '#666', rotation: 1.5 },
            { type: 'building', x: 1500, y: 200, width: 200, height: 350, color: '#4a4a4a' },
            { type: 'building', x: 1500, y: 650, width: 200, height: 350, color: '#4a4a4a' },
            // 착륙장
            { type: 'helipad', x: 2100, y: 400, width: 300, height: 400, color: '#555' },
        ],

        waves: [
            {
                trigger: 'start',
                enemies: [
                    { type: 'walker', x: 400, y: 400 },
                    { type: 'walker', x: 400, y: 700 },
                    { type: 'runner', x: 600, y: 550 },
                ]
            },
            {
                trigger: 'area',
                area: { x: 700, y: 600, radius: 150 },
                enemies: [
                    { type: 'walker' },
                    { type: 'walker' },
                    { type: 'runner' },
                    { type: 'spitter' },
                ]
            },
            {
                trigger: 'area',
                area: { x: 1100, y: 600, radius: 150 },
                enemies: [
                    { type: 'brute' },
                    { type: 'runner' },
                    { type: 'runner' },
                    { type: 'walker' },
                    { type: 'walker' },
                ]
            },
            {
                trigger: 'area',
                area: { x: 1600, y: 600, radius: 150 },
                message: '보스가 나타났다!',
                enemies: [
                    { type: 'boss', x: 2000, y: 600 },
                    { type: 'runner', delay: 2000 },
                    { type: 'runner', delay: 2000 },
                    { type: 'walker', delay: 3000 },
                    { type: 'walker', delay: 3000 },
                ]
            }
        ],

        items: [
            { type: 'health', x: 500, y: 550, amount: 40 },
            { type: 'ammo', x: 800, y: 400, weapon: 'rifle', amount: 60 },
            { type: 'ammo', x: 800, y: 800, weapon: 'shotgun', amount: 18 },
            { type: 'health', x: 1200, y: 550, amount: 50 },
            { type: 'ammo', x: 1400, y: 450, weapon: 'rifle', amount: 60 },
            { type: 'health', x: 1800, y: 600, amount: 100 },
        ],

        clearCondition: {
            type: 'reach',
            x: 2250,
            y: 600,
            radius: 100
        }
    }
};

class Level {
    constructor(chapterId) {
        this.data = LevelData[chapterId];
        this.structures = [];
        this.items = [];
        this.npcs = [];
        this.triggeredWaves = new Set();
        this.currentKills = 0;
        this.interactedNpcs = new Set();
    }

    load() {
        // 구조물 복사
        this.structures = this.data.structures.map(s => ({...s}));

        // 아이템 복사
        this.items = this.data.items.map(item => ({
            ...item,
            id: Utils.generateId(),
            collected: false
        }));

        // NPC 복사
        this.npcs = (this.data.npcs || []).map(npc => ({
            ...npc,
            interacted: false
        }));

        return {
            mapSize: this.data.mapSize,
            playerStart: this.data.playerStart,
            backgroundColor: this.data.backgroundColor,
            floorColor: this.data.floorColor
        };
    }

    checkWaveTriggers(playerX, playerY) {
        const triggeredWaves = [];

        for (let i = 0; i < this.data.waves.length; i++) {
            if (this.triggeredWaves.has(i)) continue;

            const wave = this.data.waves[i];
            let triggered = false;

            switch (wave.trigger) {
                case 'start':
                    triggered = true;
                    break;

                case 'kills':
                    if (this.currentKills >= wave.killCount) {
                        triggered = true;
                    }
                    break;

                case 'area':
                    const dist = Utils.distance(playerX, playerY, wave.area.x, wave.area.y);
                    if (dist < wave.area.radius) {
                        triggered = true;
                    }
                    break;
            }

            if (triggered) {
                this.triggeredWaves.add(i);
                triggeredWaves.push(wave);
            }
        }

        return triggeredWaves;
    }

    addKill() {
        this.currentKills++;
    }

    checkClearCondition(playerX, playerY) {
        const condition = this.data.clearCondition;

        switch (condition.type) {
            case 'reach':
                const dist = Utils.distance(playerX, playerY, condition.x, condition.y);
                return dist < condition.radius;

            case 'survive':
                return this.currentKills >= condition.killCount;

            case 'npc':
                return this.interactedNpcs.has(condition.npcId);
        }

        return false;
    }

    collectItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item && !item.collected) {
            item.collected = true;
            return item;
        }
        return null;
    }

    interactNpc(npcId) {
        const npc = this.npcs.find(n => n.id === npcId);
        if (npc && !npc.interacted) {
            npc.interacted = true;
            this.interactedNpcs.add(npcId);
            return npc;
        }
        return null;
    }

    getMapBounds() {
        return {
            minX: 50,
            minY: 50,
            maxX: this.data.mapSize.width - 50,
            maxY: this.data.mapSize.height - 50
        };
    }

    checkCollision(x, y, width, height) {
        for (const struct of this.structures) {
            // hollow 건물은 충돌 체크 제외
            if (struct.hollow) continue;

            if (Utils.rectCollision(
                { x, y, width, height },
                { x: struct.x, y: struct.y, width: struct.width, height: struct.height }
            )) {
                return struct;
            }
        }
        return null;
    }

    draw(ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
        // 배경
        ctx.fillStyle = this.data.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 바닥 그리드
        ctx.fillStyle = this.data.floorColor;
        const gridSize = 50;
        const startX = Math.floor(cameraX / gridSize) * gridSize;
        const startY = Math.floor(cameraY / gridSize) * gridSize;

        for (let x = startX; x < cameraX + canvasWidth + gridSize; x += gridSize) {
            for (let y = startY; y < cameraY + canvasHeight + gridSize; y += gridSize) {
                if ((Math.floor(x / gridSize) + Math.floor(y / gridSize)) % 2 === 0) {
                    ctx.fillRect(x - cameraX, y - cameraY, gridSize, gridSize);
                }
            }
        }

        // 구조물
        for (const struct of this.structures) {
            const screenX = struct.x - cameraX;
            const screenY = struct.y - cameraY;

            // 화면 밖이면 스킵
            if (screenX + struct.width < 0 || screenX > canvasWidth ||
                screenY + struct.height < 0 || screenY > canvasHeight) {
                continue;
            }

            ctx.save();

            if (struct.rotation) {
                ctx.translate(screenX + struct.width / 2, screenY + struct.height / 2);
                ctx.rotate(struct.rotation);
                ctx.translate(-struct.width / 2, -struct.height / 2);
                ctx.fillStyle = struct.color;
                ctx.fillRect(0, 0, struct.width, struct.height);
            } else {
                ctx.fillStyle = struct.color;
                ctx.fillRect(screenX, screenY, struct.width, struct.height);

                // 외곽선
                ctx.strokeStyle = Utils.adjustBrightness(struct.color, -20);
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX, screenY, struct.width, struct.height);
            }

            // 헬리패드 특수 표시
            if (struct.type === 'helipad') {
                ctx.strokeStyle = '#ff0';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(screenX + struct.width / 2, screenY + struct.height / 2, 80, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#ff0';
                ctx.font = 'bold 40px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('H', screenX + struct.width / 2, screenY + struct.height / 2 + 15);
            }

            ctx.restore();
        }

        // 아이템
        for (const item of this.items) {
            if (item.collected) continue;

            const screenX = item.x - cameraX;
            const screenY = item.y - cameraY;

            if (screenX < -50 || screenX > canvasWidth + 50 ||
                screenY < -50 || screenY > canvasHeight + 50) {
                continue;
            }

            // 아이템 아이콘
            ctx.save();

            // 빛나는 효과
            const glow = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
            ctx.globalAlpha = glow;

            ctx.fillStyle = item.type === 'health' ? '#4caf50' :
                           item.type === 'ammo' ? '#ffa500' : '#9c27b0';

            ctx.beginPath();
            ctx.arc(screenX, screenY, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const emoji = item.type === 'health' ? '❤️' :
                         item.type === 'ammo' ? '🔶' : '🔫';
            ctx.fillText(emoji, screenX, screenY);

            ctx.restore();
        }

        // NPC
        for (const npc of this.npcs) {
            const screenX = npc.x - cameraX;
            const screenY = npc.y - cameraY;

            if (screenX < -50 || screenX > canvasWidth + 50 ||
                screenY < -50 || screenY > canvasHeight + 50) {
                continue;
            }

            ctx.save();

            // NPC 표시
            ctx.fillStyle = '#4a90d9';
            ctx.beginPath();
            ctx.arc(screenX, screenY, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(npc.emoji, screenX, screenY);

            // 이름
            ctx.fillStyle = '#fff';
            ctx.font = '12px sans-serif';
            ctx.fillText(npc.name, screenX, screenY - 35);

            // 상호작용 표시
            if (!npc.interacted) {
                ctx.fillStyle = '#ff0';
                ctx.font = '14px sans-serif';
                ctx.fillText('[E] 대화', screenX, screenY + 35);
            }

            ctx.restore();
        }

        // 목표 지점 표시
        if (this.data.clearCondition.type === 'reach') {
            const objX = this.data.clearCondition.x - cameraX;
            const objY = this.data.clearCondition.y - cameraY;
            const radius = this.data.clearCondition.radius;

            ctx.save();
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.arc(objX, objY, radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            ctx.fill();
            ctx.restore();
        }
    }
}
