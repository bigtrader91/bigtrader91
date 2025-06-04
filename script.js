// 전역 변수
let isPlaying = false;
let bgmAudio;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadMessages();
    initializeBGM();
});

// BGM 초기화 및 자동재생
function initializeBGM() {
    bgmAudio = document.getElementById('bgm');
    
    // 사용자 상호작용 후 자동재생 시작
    document.addEventListener('click', function() {
        if (!isPlaying) {
            startBGM();
        }
    }, { once: true });

    // 볼륨 설정
    bgmAudio.volume = 0.3;
    
    // 오디오 이벤트 리스너
    bgmAudio.addEventListener('loadstart', function() {
        console.log('BGM 로딩 시작');
    });
    
    bgmAudio.addEventListener('canplay', function() {
        console.log('BGM 재생 준비 완료');
    });
    
    bgmAudio.addEventListener('error', function(e) {
        console.error('BGM 로딩 실패:', e);
        document.getElementById('musicToggle').style.display = 'none';
    });
}

// BGM 재생 시작
function startBGM() {
    if (bgmAudio && !isPlaying) {
        bgmAudio.play().then(() => {
            isPlaying = true;
            updateMusicIcon();
            console.log('BGM 재생 시작');
        }).catch(error => {
            console.log('BGM 자동재생 실패 (브라우저 정책):', error);
        });
    }
}

// 음악 토글 기능
function toggleMusic() {
    if (!bgmAudio) return;
    
    if (isPlaying) {
        bgmAudio.pause();
        isPlaying = false;
    } else {
        bgmAudio.play().then(() => {
            isPlaying = true;
        }).catch(error => {
            console.error('BGM 재생 실패:', error);
            showToast('음악 재생에 실패했습니다.');
        });
    }
    updateMusicIcon();
}

// 음악 아이콘 업데이트
function updateMusicIcon() {
    const icon = document.getElementById('musicIcon');
    if (icon) {
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
}

// 페이지 초기화 함수
function initializePage() {
    setupGallery();
    console.log('청첩장 페이지가 로드되었습니다.');
}

// 갤러리 기능
function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

// 이미지 모달 열기
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.onclick = function() {
        document.body.removeChild(modal);
    };
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'max-w-full max-h-full object-contain';
    img.onclick = function(e) {
        e.stopPropagation();
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.className = 'absolute top-4 right-4 text-white text-2xl hover:opacity-70';
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
}

// 계좌번호 복사 기능
function copyAccount(accountInfo) {
    navigator.clipboard.writeText(accountInfo).then(function() {
        showToast('계좌번호가 복사되었습니다: ' + accountInfo);
    }).catch(function(err) {
        console.error('복사 실패:', err);
        showToast('복사에 실패했습니다. 다시 시도해주세요.');
    });
}

// 토스트 메시지 표시
function showToast(message) {
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-message fixed top-20 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 z-50 text-sm rounded';
    toast.style.backgroundColor = '#909FA6';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// 축하 메시지 기능
function addMessage() {
    const messageText = document.getElementById('messageText').value.trim();
    const messageName = document.getElementById('messageName').value.trim();
    
    if (!messageText || !messageName) {
        showToast('이름과 메시지를 모두 입력해주세요.');
        return;
    }
    
    const message = {
        name: messageName,
        text: messageText,
        date: new Date().toLocaleDateString('ko-KR')
    };
    
    let messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    messages.unshift(message);
    localStorage.setItem('weddingMessages', JSON.stringify(messages));
    
    document.getElementById('messageText').value = '';
    document.getElementById('messageName').value = '';
    
    loadMessages();
    showToast('축하 메시지가 등록되었습니다.');
}

// 메시지 목록 로드
function loadMessages() {
    const messageList = document.getElementById('messageList');
    const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    
    messageList.innerHTML = '';
    
    if (messages.length === 0) {
        messageList.innerHTML = '<p class="text-center text-gray-500 py-8">아직 등록된 축하 메시지가 없습니다.</p>';
        return;
    }
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'p-4 bg-white border border-gray-200';
        messageElement.innerHTML = `
            <div class="font-medium mb-2" style="color: #909FA6;">${message.name}</div>
            <div class="text-gray-700 mb-2 leading-relaxed">${message.text}</div>
            <div class="text-xs text-gray-500">${message.date}</div>
        `;
        messageList.appendChild(messageElement);
    });
}

// 카카오톡 공유 기능
function shareKakao() {
    if (navigator.share) {
        navigator.share({
            title: '이대형 ♥ 한빛송이 결혼식 안내',
            text: '2025년 12월 25일 오후 2시, 대전 웨딩홀에서 결혼식을 올립니다. 많은 축하 부탁드립니다.',
            url: window.location.href
        }).then(() => {
            showToast('공유 완료!');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

// 대체 공유 방법
function fallbackShare() {
    const text = `이대형 ♥ 한빛송이 결혼식 안내\n2025년 12월 25일 오후 2시\n대전 웨딩홀\n\n${window.location.href}`;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('공유 텍스트가 복사되었습니다. 카카오톡에 붙여넣기 해주세요.');
    }).catch(() => {
        showToast('브라우저에서 공유 기능을 지원하지 않습니다.');
    });
}

// 링크 복사 기능
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('링크가 복사되었습니다.');
    }).catch(() => {
        showToast('링크 복사에 실패했습니다. 다시 시도해주세요.');
    });
}

// 키보드 접근성
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
            document.body.removeChild(modal);
        }
    }
});

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('페이지 오류:', e.error);
}); 