// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeWeddingInvitation();
    loadMessages();
    initializeMap();
    addScrollAnimations();
});

// 청첩장 초기화
function initializeWeddingInvitation() {
    // 현재 날짜와 결혼식 날짜 계산
    const weddingDate = new Date('2024-12-25');
    const today = new Date();
    const timeDiff = weddingDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // D-Day 표시 (선택사항)
    if (daysDiff > 0) {
        console.log(`결혼식까지 ${daysDiff}일 남았습니다!`);
    }
    
    // 갤러리 이미지 클릭 이벤트
    initializeGallery();
    
    // 연락처 버튼 이벤트
    initializeContactButtons();
}

// 갤러리 초기화
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });
    });
}

// 이미지 모달 열기
function openImageModal(src, alt) {
    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeImageModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <img src="${src}" alt="${alt}">
                <button class="modal-close" onclick="closeImageModal()">×</button>
            </div>
        </div>
    `;
    
    // 모달 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .modal-content img {
            width: 100%;
            height: auto;
            border-radius: 10px;
        }
        .modal-close {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 40px;
            height: 40px;
            background: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// 이미지 모달 닫기
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// 연락처 버튼 초기화
function initializeContactButtons() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const smsLinks = document.querySelectorAll('a[href^="sms:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            console.log(`전화 걸기: ${phoneNumber}`);
        });
    });
    
    smsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('href').replace('sms:', '');
            console.log(`문자 보내기: ${phoneNumber}`);
        });
    });
}

// 축하 메시지 추가
function addMessage() {
    const messageText = document.getElementById('messageText').value.trim();
    const messageName = document.getElementById('messageName').value.trim();
    
    if (!messageText || !messageName) {
        alert('메시지와 이름을 모두 입력해주세요.');
        return;
    }
    
    const message = {
        id: Date.now(),
        text: messageText,
        author: messageName,
        date: new Date().toLocaleDateString('ko-KR')
    };
    
    // 로컬 스토리지에 저장
    saveMessage(message);
    
    // 메시지 목록에 추가
    displayMessage(message);
    
    // 입력 필드 초기화
    document.getElementById('messageText').value = '';
    document.getElementById('messageName').value = '';
    
    // 성공 메시지
    showNotification('축하 메시지가 등록되었습니다! 💕');
}

// 메시지 저장
function saveMessage(message) {
    let messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    messages.unshift(message); // 최신 메시지를 맨 위에
    
    // 최대 50개 메시지만 저장
    if (messages.length > 50) {
        messages = messages.slice(0, 50);
    }
    
    localStorage.setItem('weddingMessages', JSON.stringify(messages));
}

// 저장된 메시지 로드
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    const messageList = document.getElementById('messageList');
    
    if (messages.length === 0) {
        messageList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">아직 축하 메시지가 없습니다. 첫 번째 메시지를 남겨주세요! 💕</p>';
        return;
    }
    
    messageList.innerHTML = '';
    messages.forEach(message => {
        displayMessage(message);
    });
}

// 메시지 표시
function displayMessage(message) {
    const messageList = document.getElementById('messageList');
    const messageElement = document.createElement('div');
    messageElement.className = 'message-item';
    messageElement.innerHTML = `
        <div class="message-author">${escapeHtml(message.author)}</div>
        <div class="message-content">${escapeHtml(message.text).replace(/\n/g, '<br>')}</div>
        <div class="message-date">${message.date}</div>
    `;
    
    // 첫 번째 메시지가 "메시지가 없습니다" 텍스트인 경우 제거
    const noMessageText = messageList.querySelector('p');
    if (noMessageText) {
        noMessageText.remove();
    }
    
    messageList.insertBefore(messageElement, messageList.firstChild);
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 알림 표시
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 지도 초기화 (카카오맵 또는 구글맵 대신 간단한 지도 표시)
function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // 간단한 지도 대체 (실제로는 카카오맵이나 구글맵 API 사용)
    mapContainer.innerHTML = `
        <div style="
            width: 100%;
            height: 300px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2em;
            border-radius: 15px;
        ">
            <div style="text-align: center;">
                <i class="fas fa-map-marker-alt" style="font-size: 2em; margin-bottom: 10px;"></i>
                <p>서울 강남구 웨딩홀</p>
                <p style="font-size: 0.9em; opacity: 0.8;">지도 API 연동 예정</p>
                <button onclick="openExternalMap()" style="
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9em;
                ">길찾기</button>
            </div>
        </div>
    `;
}

// 외부 지도 앱 열기
function openExternalMap() {
    const address = '서울 강남구 웨딩홀';
    const encodedAddress = encodeURIComponent(address);
    
    // 모바일에서는 카카오맵 또는 네이버맵 앱 열기
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // 카카오맵 앱 시도
        window.location.href = `kakaomap://search?q=${encodedAddress}`;
        
        // 카카오맵이 없으면 웹 버전으로
        setTimeout(() => {
            window.open(`https://map.kakao.com/link/search/${encodedAddress}`, '_blank');
        }, 1000);
    } else {
        // 데스크톱에서는 구글맵 웹 버전
        window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
    }
}

// 스크롤 애니메이션
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 모든 섹션에 애니메이션 적용
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// 공유 기능
function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: '김민준 ♥ 이지은 결혼식 안내',
            text: '저희의 결혼식에 초대합니다!',
            url: window.location.href
        }).catch(console.error);
    } else {
        // 공유 API가 지원되지 않는 경우 URL 복사
        copyToClipboard(window.location.href);
        showNotification('링크가 복사되었습니다! 📋');
    }
}

// 클립보드에 복사
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // 구형 브라우저 지원
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// 키보드 이벤트 처리
document.addEventListener('keydown', function(e) {
    // ESC 키로 모달 닫기
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

// 터치 이벤트 처리 (모바일)
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    // 위로 스와이프 시 부드러운 스크롤
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            // 위로 스와이프
            window.scrollBy({
                top: 100,
                behavior: 'smooth'
            });
        } else {
            // 아래로 스와이프
            window.scrollBy({
                top: -100,
                behavior: 'smooth'
            });
        }
    }
});

// 페이지 가시성 변경 시 처리
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // 페이지가 다시 보일 때 메시지 새로고침
        loadMessages();
    }
});

// 온라인/오프라인 상태 처리
window.addEventListener('online', function() {
    showNotification('인터넷에 연결되었습니다! 🌐');
});

window.addEventListener('offline', function() {
    showNotification('인터넷 연결이 끊어졌습니다. 📱');
}); 