// 스토리 시스템 - 대화 및 컷씬

const StoryData = {
    // 게임 시작 인트로
    intro: {
        scenes: [
            {
                text: "2024년, 알 수 없는 바이러스가 전 세계로 퍼졌다.",
                duration: 3000
            },
            {
                text: "감염자들은 이성을 잃고 살아있는 자들을 공격하기 시작했다.",
                duration: 3000
            },
            {
                text: "불과 일주일 만에 도시는 지옥으로 변했다.",
                duration: 3000
            },
            {
                text: "당신은 평범한 회사원이었다. 그날 아침, 출근길에서 모든 것이 시작됐다.",
                duration: 4000
            },
            {
                text: "살아남아야 한다. 어떻게든...",
                duration: 2000
            }
        ]
    },

    // 챕터별 인트로
    chapter1_intro: {
        scenes: [
            {
                text: "[ 챕터 1: 시작의 거리 ]",
                duration: 2000
            },
            {
                text: "도시는 완전히 무너졌다. 거리에는 버려진 차들과 좀비들뿐이다.",
                duration: 3000
            },
            {
                text: "멀리서 무전 신호가 들린다. 다른 생존자가 있다!",
                duration: 3000
            },
            {
                text: "신호가 오는 방향으로 이동하자.",
                duration: 2000
            }
        ]
    },

    chapter1_clear: {
        scenes: [
            {
                text: "무전기에서 목소리가 들린다.",
                duration: 2000
            },
            {
                text: "\"여기는 생존자 캠프. 지하도를 통해 이동하면 안전하게 올 수 있어.\"",
                duration: 3000
            },
            {
                text: "지하도로 향하자.",
                duration: 2000
            }
        ]
    },

    chapter2_intro: {
        scenes: [
            {
                text: "[ 챕터 2: 지하도 ]",
                duration: 2000
            },
            {
                text: "지하도는 어둡고 습하다. 조심히 이동해야 한다.",
                duration: 3000
            },
            {
                text: "여기서도 좀비들의 울음소리가 들린다...",
                duration: 2500
            }
        ]
    },

    chapter2_clear: {
        scenes: [
            {
                text: "지하도를 빠져나왔다!",
                duration: 2000
            },
            {
                text: "무전기: \"근처 병원에 의료품이 있어. 그리고 거기에 갇힌 생존자가 있다고 해.\"",
                duration: 3500
            },
            {
                text: "병원으로 향하자.",
                duration: 2000
            }
        ]
    },

    chapter3_intro: {
        scenes: [
            {
                text: "[ 챕터 3: 버려진 병원 ]",
                duration: 2000
            },
            {
                text: "병원은 감염 초기에 환자들로 가득 찼던 곳이다.",
                duration: 3000
            },
            {
                text: "지금은 좀비들의 소굴이 되어버렸다.",
                duration: 2500
            },
            {
                text: "어딘가에 생존자가 있다. 찾아서 구출하자.",
                duration: 2500
            }
        ]
    },

    chapter3_clear: {
        scenes: [
            {
                text: "생존자 민준을 구출했다!",
                duration: 2000
            },
            {
                text: "민준: \"고마워요! 경찰서에 다른 생존자들이 모여있어요.\"",
                duration: 3000
            },
            {
                text: "민준: \"거기에 무기도 있고, 탈출 계획도 있다고 들었어요!\"",
                duration: 3000
            },
            {
                text: "경찰서로 향하자.",
                duration: 2000
            }
        ]
    },

    chapter4_intro: {
        scenes: [
            {
                text: "[ 챕터 4: 최후의 경찰서 ]",
                duration: 2000
            },
            {
                text: "경찰서에 도착했다. 여기가 생존자들의 거점이다.",
                duration: 3000
            },
            {
                text: "\"대원들! 좀비 무리가 몰려오고 있다! 방어 준비!\"",
                duration: 3000
            },
            {
                text: "경찰서를 지켜내야 한다!",
                duration: 2000
            }
        ]
    },

    chapter4_clear: {
        scenes: [
            {
                text: "좀비 무리를 물리쳤다!",
                duration: 2000
            },
            {
                text: "생존자: \"헬기가 온다! 착륙 지점까지 이동해야 해!\"",
                duration: 3000
            },
            {
                text: "생존자: \"서쪽 끝에 있는 헬기장까지 가면 돼. 조심해!\"",
                duration: 3000
            },
            {
                text: "이제 마지막 구간이다. 탈출하자!",
                duration: 2000
            }
        ]
    },

    chapter5_intro: {
        scenes: [
            {
                text: "[ 챕터 5: 최후의 탈출 ]",
                duration: 2000
            },
            {
                text: "헬기 착륙 지점까지 가야 한다.",
                duration: 2500
            },
            {
                text: "하지만 좀비들이 가득한 거리를 지나야 한다.",
                duration: 2500
            },
            {
                text: "마지막 여정이다. 포기하지 마!",
                duration: 2000
            }
        ]
    },

    chapter5_clear: {
        scenes: [
            {
                text: "보스를 물리쳤다!",
                duration: 2000
            },
            {
                text: "헬기가 착륙하고 있다!",
                duration: 2000
            },
            {
                text: "\"빨리 타! 이 도시를 벗어나자!\"",
                duration: 2500
            }
        ]
    },

    // 엔딩
    ending: {
        scenes: [
            {
                text: "당신은 헬기에 올라탔다.",
                duration: 2500
            },
            {
                text: "창밖으로 좀비들로 가득한 도시가 점점 멀어진다.",
                duration: 3000
            },
            {
                text: "많은 것을 잃었다. 하지만 살아남았다.",
                duration: 3000
            },
            {
                text: "이제 새로운 시작이다.",
                duration: 2500
            },
            {
                text: "\"DEAD CITY: 최후의 생존자\"",
                duration: 2000
            },
            {
                text: "THE END",
                duration: 3000
            }
        ]
    }
};

// 캐릭터 대화 데이터
const DialogData = {
    player: {
        name: '나',
        emoji: '👤',
        color: '#4a90d9'
    },
    radio: {
        name: '무전기',
        emoji: '📻',
        color: '#ffa500'
    },
    survivor: {
        name: '생존자',
        emoji: '👨',
        color: '#4caf50'
    },
    minjun: {
        name: '민준',
        emoji: '👨',
        color: '#4caf50'
    }
};

class StoryManager {
    constructor() {
        this.currentStory = null;
        this.currentSceneIndex = 0;
        this.isPlaying = false;
        this.onComplete = null;
        this.skipRequested = false;

        // 대화 시스템
        this.currentDialog = null;
        this.dialogQueue = [];
        this.isDialogActive = false;
        this.onDialogComplete = null;
    }

    playStory(storyId, onComplete) {
        const story = StoryData[storyId];
        if (!story) {
            if (onComplete) onComplete();
            return;
        }

        this.currentStory = story;
        this.currentSceneIndex = 0;
        this.isPlaying = true;
        this.onComplete = onComplete;
        this.skipRequested = false;

        this.showScene();
    }

    showScene() {
        if (!this.currentStory || this.currentSceneIndex >= this.currentStory.scenes.length) {
            this.endStory();
            return;
        }

        const scene = this.currentStory.scenes[this.currentSceneIndex];
        const storyText = document.getElementById('storyText');

        if (storyText) {
            storyText.innerHTML = '';
            this.typeText(storyText, scene.text, () => {
                if (!this.skipRequested) {
                    // 자동 진행은 하지 않고 버튼 클릭 대기
                }
            });
        }
    }

    typeText(element, text, onComplete) {
        let index = 0;
        element.innerHTML = '';

        const type = () => {
            if (this.skipRequested) {
                element.innerHTML = text;
                if (onComplete) onComplete();
                return;
            }

            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 50);
            } else {
                if (onComplete) onComplete();
            }
        };

        type();
    }

    nextScene() {
        this.currentSceneIndex++;
        if (this.currentSceneIndex >= this.currentStory.scenes.length) {
            this.endStory();
        } else {
            this.showScene();
        }
    }

    skip() {
        this.skipRequested = true;
        this.endStory();
    }

    endStory() {
        this.isPlaying = false;
        this.currentStory = null;

        if (this.onComplete) {
            this.onComplete();
        }
    }

    // 대화 시스템
    startDialog(dialogs, onComplete) {
        this.dialogQueue = [...dialogs];
        this.isDialogActive = true;
        this.onDialogComplete = onComplete;
        this.showNextDialog();
    }

    showNextDialog() {
        if (this.dialogQueue.length === 0) {
            this.endDialog();
            return;
        }

        this.currentDialog = this.dialogQueue.shift();
        this.updateDialogUI();
    }

    updateDialogUI() {
        const dialogBox = document.getElementById('dialogBox');
        const dialogPortrait = document.getElementById('dialogPortrait');
        const dialogName = document.getElementById('dialogName');
        const dialogText = document.getElementById('dialogText');

        if (!dialogBox) return;

        dialogBox.classList.add('active');

        const character = DialogData[this.currentDialog.character] || DialogData.survivor;

        dialogPortrait.textContent = character.emoji;
        dialogPortrait.style.borderColor = character.color;
        dialogName.textContent = character.name;
        dialogName.style.color = character.color;

        // 타이핑 효과
        this.typeDialogText(dialogText, this.currentDialog.text);
    }

    typeDialogText(element, text) {
        let index = 0;
        element.innerHTML = '';

        const type = () => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 30);
            }
        };

        type();
    }

    advanceDialog() {
        if (!this.isDialogActive) return;
        this.showNextDialog();
    }

    endDialog() {
        this.isDialogActive = false;
        this.currentDialog = null;

        const dialogBox = document.getElementById('dialogBox');
        if (dialogBox) {
            dialogBox.classList.remove('active');
        }

        if (this.onDialogComplete) {
            this.onDialogComplete();
        }
    }

    // NPC 대화 시작
    startNpcDialog(npc, onComplete) {
        const dialogs = npc.dialog.map((text, index) => ({
            character: npc.id === 'survivor1' ? 'minjun' : 'survivor',
            text: text
        }));

        this.startDialog(dialogs, onComplete);
    }
}

const Story = new StoryManager();
