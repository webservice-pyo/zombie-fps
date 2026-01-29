// 메인 진입점

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    // 초기화
    UI.init();
    game.init();
    Controls.init();

    // 게임 루프 시작
    game.start();

    // 컨트롤 업데이트 루프
    function controlLoop() {
        Controls.update();
        requestAnimationFrame(controlLoop);
    }
    controlLoop();

    // 터치 이벤트 기본 동작 방지 (스크롤, 확대 등)
    document.addEventListener('touchmove', (e) => {
        if (game.state === 'playing') {
            e.preventDefault();
        }
    }, { passive: false });

    // 오디오 컨텍스트 초기화 (사용자 상호작용 필요)
    document.addEventListener('click', () => {
        Audio.init();
    }, { once: true });

    document.addEventListener('touchstart', () => {
        Audio.init();
    }, { once: true });

    // 화면 방향 잠금 시도 (모바일)
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
            // 지원하지 않거나 권한 없음
        });
    }

    // 전체화면 안내 (모바일)
    if (Utils.isMobile()) {
        const fullscreenHint = document.createElement('div');
        fullscreenHint.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: #888;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
        `;
        fullscreenHint.textContent = '가로 모드 권장';
        document.body.appendChild(fullscreenHint);

        setTimeout(() => {
            fullscreenHint.style.transition = 'opacity 1s';
            fullscreenHint.style.opacity = '0';
            setTimeout(() => fullscreenHint.remove(), 1000);
        }, 3000);
    }

    console.log('🧟 DEAD CITY: 최후의 생존자');
    console.log('게임이 로드되었습니다!');
});

// 페이지 가시성 변경시 일시정지
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state === 'playing') {
        game.pause();
    }
});

// 윈도우 블러시 일시정지
window.addEventListener('blur', () => {
    if (game.state === 'playing') {
        game.pause();
    }
});

// 에러 핸들링
window.addEventListener('error', (e) => {
    console.error('게임 오류:', e.message);
});

// 서비스 워커 등록 (오프라인 지원, 선택적)
if ('serviceWorker' in navigator) {
    // 서비스 워커는 별도 구현 필요
    // navigator.serviceWorker.register('/sw.js');
}
