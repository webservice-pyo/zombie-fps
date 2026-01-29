// 스토리 시스템 - 대화 및 컷씬

const StoryData = {
    // 게임 시작 인트로
    intro: {
        scenes: [
            {
                text: "2024년 여름, 서울...",
                duration: 2500
            },
            {
                text: "정체불명의 바이러스가 도시 전체를 집어삼켰다.",
                duration: 3000
            },
            {
                text: "감염된 사람들은 눈이 붉게 변하고, 이성을 잃었다.",
                duration: 3000
            },
            {
                text: "그들은 더 이상 인간이 아니었다.",
                duration: 2500
            },
            {
                text: "사람들은 그들을 '좀비'라고 불렀다.",
                duration: 2500
            },
            {
                text: "당신은 평범한 고등학생이었다.",
                duration: 2500
            },
            {
                text: "그날 아침, 학교 가는 길에서 모든 것이 시작됐다...",
                duration: 3000
            },
            {
                text: "이제 살아남는 것만이 유일한 목표다.",
                duration: 2500
            }
        ]
    },

    // 챕터 1
    chapter1_intro: {
        scenes: [
            {
                text: "[ 챕터 1: 시작의 거리 ]",
                duration: 2500
            },
            {
                text: "거리는 아수라장이 됐다.",
                duration: 2500
            },
            {
                text: "버려진 차들, 깨진 유리창, 그리고 피...",
                duration: 3000
            },
            {
                text: "멀리서 무전 신호가 들린다.",
                duration: 2500
            },
            {
                text: "\"여기는... 생존자 캠프... 들리면 응답 바람...\"",
                duration: 3500
            },
            {
                text: "다른 생존자가 있다! 신호가 오는 방향으로 가자.",
                duration: 3000
            }
        ]
    },

    chapter1_clear: {
        scenes: [
            {
                text: "무전기에서 선명한 목소리가 들린다.",
                duration: 2500
            },
            {
                text: "\"거기 생존자! 잘 버텼어. 난 김대위라고 해.\"",
                duration: 3000
            },
            {
                text: "\"지하도를 통해서 이쪽으로 와. 거기가 안전한 길이야.\"",
                duration: 3500
            },
            {
                text: "\"조심해서 와. 우리가 기다리고 있을게.\"",
                duration: 2500
            },
            {
                text: "희망이 보인다. 지하도로 향하자!",
                duration: 2500
            }
        ]
    },

    // 챕터 2
    chapter2_intro: {
        scenes: [
            {
                text: "[ 챕터 2: 어둠의 지하도 ]",
                duration: 2500
            },
            {
                text: "지하도는 캄캄하고 축축했다.",
                duration: 2500
            },
            {
                text: "손전등 불빛만이 유일한 빛이다.",
                duration: 2500
            },
            {
                text: "어둠 속에서 이상한 소리가 들린다...",
                duration: 3000
            },
            {
                text: "\"크르르르...\"",
                duration: 2000
            },
            {
                text: "좀비들이 여기에도 있다. 최대한 조용히 이동하자.",
                duration: 3000
            }
        ]
    },

    chapter2_clear: {
        scenes: [
            {
                text: "드디어 지하도를 빠져나왔다!",
                duration: 2500
            },
            {
                text: "눈앞에 큰 병원 건물이 보인다.",
                duration: 2500
            },
            {
                text: "무전기: \"근처 종합병원에 의료품이 많아.\"",
                duration: 3000
            },
            {
                text: "\"그리고... 누군가 살려달라고 신호를 보내고 있어.\"",
                duration: 3500
            },
            {
                text: "\"부탁이야. 그 사람을 구해줘.\"",
                duration: 2500
            },
            {
                text: "누군가 위험에 빠져있다. 서둘러 병원으로!",
                duration: 2500
            }
        ]
    },

    // 챕터 3
    chapter3_intro: {
        scenes: [
            {
                text: "[ 챕터 3: 공포의 병원 ]",
                duration: 2500
            },
            {
                text: "병원 로비는 피로 물들어 있었다.",
                duration: 3000
            },
            {
                text: "이곳은 감염 초기에 환자들로 가득 찼던 곳...",
                duration: 3000
            },
            {
                text: "지금은 좀비들의 둥지가 되어버렸다.",
                duration: 2500
            },
            {
                text: "\"제발... 누가 있으면 도와주세요...\"",
                duration: 3000
            },
            {
                text: "위층에서 목소리가 들린다! 빨리 구하러 가자!",
                duration: 3000
            }
        ]
    },

    chapter3_clear: {
        scenes: [
            {
                text: "창고에 숨어있던 생존자를 발견했다!",
                duration: 2500
            },
            {
                text: "민준: \"고... 고마워! 정말 죽는 줄 알았어!\"",
                duration: 3000
            },
            {
                text: "민준: \"나는 민준이야. 여기서 3일이나 숨어있었어.\"",
                duration: 3500
            },
            {
                text: "민준: \"경찰서에 다른 사람들이 모여있대!\"",
                duration: 3000
            },
            {
                text: "민준: \"거기에 탈출 계획도 있다고 들었어. 같이 가자!\"",
                duration: 3500
            },
            {
                text: "동료가 생겼다. 함께 경찰서로 향하자!",
                duration: 2500
            }
        ]
    },

    // 챕터 4
    chapter4_intro: {
        scenes: [
            {
                text: "[ 챕터 4: 최후의 보루 ]",
                duration: 2500
            },
            {
                text: "경찰서에 도착했다.",
                duration: 2000
            },
            {
                text: "여기가 생존자들의 마지막 거점이다.",
                duration: 2500
            },
            {
                text: "김대위: \"잘 왔어! 근데 문제가 생겼어...\"",
                duration: 3000
            },
            {
                text: "김대위: \"좀비 무리가 몰려오고 있어. 엄청난 숫자야.\"",
                duration: 3500
            },
            {
                text: "김대위: \"우리가 막아야 해. 준비해!\"",
                duration: 2500
            },
            {
                text: "이곳을 지켜내야 한다. 모두의 생존을 위해!",
                duration: 3000
            }
        ]
    },

    chapter4_clear: {
        scenes: [
            {
                text: "좀비 무리를 물리쳤다!",
                duration: 2500
            },
            {
                text: "생존자들의 환호성이 터져나온다.",
                duration: 2500
            },
            {
                text: "김대위: \"해냈어! 정말 대단해!\"",
                duration: 2500
            },
            {
                text: "김대위: \"좋은 소식이야. 구조 헬기가 온대!\"",
                duration: 3000
            },
            {
                text: "김대위: \"서쪽 헬기장까지 가면 돼. 하지만...\"",
                duration: 3000
            },
            {
                text: "김대위: \"그 길에 거대한 좀비가 있다는 소문이 있어.\"",
                duration: 3500
            },
            {
                text: "마지막 관문이다. 탈출하자!",
                duration: 2500
            }
        ]
    },

    // 챕터 5
    chapter5_intro: {
        scenes: [
            {
                text: "[ 최종 챕터: 데드 시티 탈출 ]",
                duration: 2500
            },
            {
                text: "헬기장까지 가는 마지막 길...",
                duration: 2500
            },
            {
                text: "하늘에서 헬기 소리가 들린다.",
                duration: 2500
            },
            {
                text: "희망이 바로 저기에 있다!",
                duration: 2500
            },
            {
                text: "\"쿵... 쿵... 쿵...\"",
                duration: 2000
            },
            {
                text: "땅이 흔들린다. 뭔가 거대한 것이 다가오고 있다...",
                duration: 3500
            },
            {
                text: "이것이 마지막 싸움이다. 포기하지 마!",
                duration: 3000
            }
        ]
    },

    chapter5_clear: {
        scenes: [
            {
                text: "거대한 좀비가 쓰러졌다!",
                duration: 2500
            },
            {
                text: "헬기가 착륙하고 있다!",
                duration: 2500
            },
            {
                text: "조종사: \"빨리 타! 시간이 없어!\"",
                duration: 2500
            },
            {
                text: "민준: \"해냈어! 우리가 해냈어!\"",
                duration: 2500
            },
            {
                text: "김대위: \"잘했어. 이제 끝이야.\"",
                duration: 2500
            }
        ]
    },

    // 엔딩
    ending: {
        scenes: [
            {
                text: "당신은 헬기에 올라탔다.",
                duration: 3000
            },
            {
                text: "창밖으로 좀비들로 가득한 도시가 점점 멀어진다.",
                duration: 3500
            },
            {
                text: "많은 것을 잃었다.",
                duration: 2500
            },
            {
                text: "하지만 새로운 친구들을 얻었다.",
                duration: 2500
            },
            {
                text: "그리고 무엇보다... 살아남았다.",
                duration: 3000
            },
            {
                text: "저 멀리, 새로운 도시의 불빛이 보인다.",
                duration: 3000
            },
            {
                text: "이제 새로운 시작이다.",
                duration: 3000
            },
            {
                text: "[ 표서준의 DEAD CITY ]",
                duration: 2500
            },
            {
                text: "- 최후의 생존자 -",
                duration: 2000
            },
            {
                text: "축하해 서준아! 게임을 끝까지 클리어했어!",
                duration: 3000
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
