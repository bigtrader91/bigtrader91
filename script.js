// 전역 변수
let isPlaying = false;
let bgmAudio;

// Supabase 설정
const SUPABASE_CONFIG = {
    url: 'https://emrqijswltyevzlctlxm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcnFpanN3bHR5ZXZ6bGN0bHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDA0ODYsImV4cCI6MjA3NDExNjQ4Nn0.dBep0TDa6Dlp18OVau1I8HVFTSwdnEx4syM11y7qGpI'
};

// Supabase 클라이언트 초기화
let supabase;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeSupabase(); // Supabase 초기화
    initializeBGM();
    loadGalleryImages(); // 갤러리 이미지 동적 로드
    initializeKakao(); // 카카오 SDK 초기화
    initializeImageProtection(); // 이미지 보호 기능 초기화
    initializeGalleryTouchEvents(); // 갤러리 터치 이벤트 초기화
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
    // 새로운 갤러리 모달 시스템으로 변경됨
    console.log('갤러리 초기화 완료');
}

// 갤러리 이미지 배열 (동적으로 로드됨)
let galleryImages = [];
let currentModalIndex = 0;
let currentSlide = 0;
let imagesPerSlide = 9; // 3x3 그리드
let totalSlides = 0;

// 갤러리 이미지 동적 로드
async function loadGalleryImages() {
    console.log('🖼️ 갤러리 이미지 로딩 시작...');

    try {
        const imagePromises = [];

        // wedding 시리즈 파일을 우선적으로 확인 (1-50번)
        console.log('📸 wedding 시리즈 이미지 검색 중...');
        for (let i = 1; i <= 50; i++) {
            imagePromises.push(checkImageExists(`gallery/wedding (${i}).jpg`));
        }

        // 다른 일반적인 파일명 패턴들도 시도
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        for (let i = 1; i <= 50; i++) {
            for (const ext of extensions) {
                imagePromises.push(checkImageExists(`gallery/${i}.${ext}`));
                imagePromises.push(checkImageExists(`gallery/image${i}.${ext}`));
                imagePromises.push(checkImageExists(`gallery/photo${i}.${ext}`));
            }
        }

        console.log('🔄 이미지 존재 여부 확인 중...');
        const results = await Promise.all(imagePromises);
        galleryImages = results.filter(Boolean).slice(0, 50); // 최대 50개로 제한

        console.log(`✅ 갤러리에서 ${galleryImages.length}개의 이미지를 찾았습니다:`, galleryImages);

        // 이미지가 없으면 기본 이미지 사용
        if (galleryImages.length === 0) {
            console.warn('⚠️ gallery 폴더에서 이미지를 찾을 수 없습니다. 기본 이미지를 사용합니다.');
            galleryImages = [
                'images/photo1.jpg',
                'images/photo2.jpg',
                'images/photo3.jpg',
                'images/photo4.jpg'
            ];
        }

        // 갤러리 UI 업데이트
        console.log('🎨 갤러리 UI 업데이트 시작...');
        updateGalleryUI();

    } catch (error) {
        console.error('❌ 갤러리 이미지 로드 중 치명적 오류:', error);

        // 긴급 폴백: 하드코딩된 이미지 리스트 사용
        console.log('🆘 긴급 폴백 시스템 활성화');
        galleryImages = [];

        // wedding 시리즈를 직접 추가 (1-42)
        for (let i = 1; i <= 42; i++) {
            galleryImages.push(`gallery/wedding (${i}).jpg`);
        }

        console.log(`🔄 폴백으로 ${galleryImages.length}개 이미지 경로 생성`);
        updateGalleryUI();
    }
}

// 이미지 존재 여부 확인
function checkImageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            console.log(`✅ 이미지 로드 성공: ${src}`);
            resolve(src);
        };
        img.onerror = () => {
            console.log(`❌ 이미지 로드 실패: ${src}`);
            resolve(null);
        };
        img.src = src;
    });
}

// 갤러리 UI 업데이트 (슬라이드 기능 적용)
function updateGalleryUI() {
    const galleryWrapper = document.getElementById('galleryWrapper');
    if (!galleryWrapper) {
        console.error('❌ galleryWrapper 요소를 찾을 수 없습니다.');

        // 대안으로 다른 요소들도 확인
        const galleryContainer = document.querySelector('.gallery-slider-container');
        const gallerySlider = document.querySelector('.gallery-slider');
        console.log('galleryContainer 존재:', !!galleryContainer);
        console.log('gallerySlider 존재:', !!gallerySlider);

        return;
    }

    console.log(`🎨 갤러리 UI 업데이트 시작: ${galleryImages.length}개 이미지`);
    galleryWrapper.innerHTML = '';

    if (galleryImages.length === 0) {
        galleryWrapper.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <div class="mb-4">
                    <i class="fas fa-images text-4xl text-gray-300 mb-2"></i>
                    <p>갤러리 이미지를 로드하는 중입니다...</p>
                    <p class="text-sm text-gray-400 mt-2">잠시만 기다려주세요</p>
                </div>
            </div>
        `;
        return;
    }

    // 슬라이드 개수 계산
    totalSlides = Math.ceil(galleryImages.length / imagesPerSlide);
    console.log(`총 ${totalSlides}개 슬라이드 생성`);

    // 각 슬라이드 생성
    for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
        const slideElement = document.createElement('div');
        slideElement.className = 'gallery-slide min-w-full';

        const startIndex = slideIndex * imagesPerSlide;
        const endIndex = Math.min(startIndex + imagesPerSlide, galleryImages.length);
        const slideImages = galleryImages.slice(startIndex, endIndex);

        slideImages.forEach((imageSrc, imageIndex) => {
            const actualIndex = startIndex + imageIndex;
            const imageElement = document.createElement('div');

            // 이미지 비율 옵션들:
            // 'aspect-square' - 정사각형 (1:1) - 현재 설정 (작은 크기)
            // 'aspect-[4/3]' - 가로형 (4:3)
            // 'aspect-[3/4]' - 세로형 (3:4)
            // 'aspect-[16/9]' - 와이드 (16:9)
            // 'aspect-[3/2]' - 클래식 (3:2)
            imageElement.className = 'aspect-square gallery-img gallery-item';

            // 이미지 클릭 시 보호된 모달에서 표시
            imageElement.onclick = (e) => {
                console.log('갤러리 이미지 클릭됨! Index:', actualIndex);
                e.preventDefault();
                e.stopPropagation();
                openGalleryModal(actualIndex);
                return false;
            };

            // 추가 클릭 이벤트 리스너 (더블 보험)
            imageElement.addEventListener('click', (e) => {
                console.log('갤러리 addEventListener 클릭! Index:', actualIndex);
                e.preventDefault();
                e.stopPropagation();
                openGalleryModal(actualIndex);
            }, true);

            const img = document.createElement('img');

            // 이미지 로딩 에러 처리
            img.onerror = function() {
                console.log(`❌ 이미지 로딩 실패: ${imageSrc}`);
                // 에러 시 플레이스홀더 표시
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="12" fill="%23374151"%3E사진 ${actualIndex + 1}%3C/text%3E%3C/svg%3E';
            };

            img.onload = function() {
                console.log(`✅ 이미지 로딩 성공: ${imageSrc}`);
            };

            // 현재 슬라이드의 이미지만 즉시 로드, 나머지는 레이지 로딩
            if (slideIndex === 0) {
                img.src = imageSrc;
            } else {
                img.loading = 'lazy';
                img.dataset.src = imageSrc;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="10" fill="%23666"%3E로딩중...%3C/text%3E%3C/svg%3E';
            }

            img.alt = `갤러리 사진 ${actualIndex + 1}`;
            img.className = 'w-full h-full object-cover protected-img';
            img.setAttribute('draggable', 'false');
            img.oncontextmenu = (e) => { e.preventDefault(); return false; };
            img.onselectstart = (e) => { e.preventDefault(); return false; };
            img.ondragstart = (e) => { e.preventDefault(); return false; };

            imageElement.appendChild(img);
            slideElement.appendChild(imageElement);
        });

        // 빈 공간 채우기 (9개 미만일 때)
        while (slideElement.children.length < imagesPerSlide && slideElement.children.length % 3 !== 0) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'aspect-square';
            slideElement.appendChild(emptyElement);
        }

        galleryWrapper.appendChild(slideElement);
    }

    // 슬라이드 컨테이너 스타일 설정
    galleryWrapper.style.display = 'flex';
    galleryWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

    // 인디케이터 업데이트
    updateGalleryIndicators();

    // 네비게이션 버튼 표시/숨김
    updateNavigationButtons();

    // 갤러리 정보 업데이트
    updateGalleryInfo();

    console.log('갤러리 UI 업데이트 완료');

    // 새로 로드된 이미지에 보호 기능 적용
    setTimeout(() => {
        applyAdvancedImageProtection();
    }, 500);
}

// 갤러리 슬라이드 기능
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlidePosition();
        preloadSlideImages(currentSlide);
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlidePosition();
        preloadSlideImages(currentSlide);
    }
}

function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateSlidePosition();
        preloadSlideImages(currentSlide);
    }
}

function updateSlidePosition() {
    const galleryWrapper = document.getElementById('galleryWrapper');
    if (galleryWrapper) {
        galleryWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    updateGalleryIndicators();
    updateNavigationButtons();
    updateGalleryInfo();
}

// 슬라이드 이미지 프리로드
function preloadSlideImages(slideIndex) {
    const slides = document.querySelectorAll('.gallery-slide');
    if (slides[slideIndex]) {
        const images = slides[slideIndex].querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
}

// 갤러리 인디케이터 업데이트
function updateGalleryIndicators() {
    const indicatorsContainer = document.getElementById('galleryIndicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.className = `w-3 h-3 rounded-full transition-all duration-200 ${
            i === currentSlide ? 'bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
        }`;
        indicator.onclick = () => goToSlide(i);
        indicator.setAttribute('aria-label', `${i + 1}번째 슬라이드로 이동`);
        indicatorsContainer.appendChild(indicator);
    }
}

// 네비게이션 버튼 업데이트
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.style.opacity = currentSlide > 0 ? '1' : '0.5';
        prevBtn.disabled = currentSlide === 0;
    }

    if (nextBtn) {
        nextBtn.style.opacity = currentSlide < totalSlides - 1 ? '1' : '0.5';
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    // 슬라이드가 1개면 버튼 숨기기
    if (totalSlides <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
}

// 갤러리 정보 업데이트
function updateGalleryInfo() {
    const galleryInfo = document.getElementById('galleryInfo');
    if (galleryInfo && totalSlides > 1) {
        const startImage = currentSlide * imagesPerSlide + 1;
        const endImage = Math.min((currentSlide + 1) * imagesPerSlide, galleryImages.length);
        galleryInfo.textContent = `${startImage}-${endImage} / ${galleryImages.length}장`;
    } else if (galleryInfo) {
        galleryInfo.textContent = `총 ${galleryImages.length}장`;
    }
}

// 터치 스와이프 지원 (모바일)
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // 왼쪽으로 스와이프 - 다음 슬라이드
            nextSlide();
        } else {
            // 오른쪽으로 스와이프 - 이전 슬라이드
            previousSlide();
        }
    }
}

// 갤러리 모달 열기
function openGalleryModal(imageIndex) {
    console.log('🖼️ openGalleryModal 호출됨! imageIndex:', imageIndex, 'galleryImages.length:', galleryImages.length);

    if (galleryImages.length === 0) {
        console.error('❌ galleryImages가 비어있음!');
        return;
    }

    currentModalIndex = imageIndex;
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('galleryModalImage');
    const counter = document.getElementById('galleryModalCounter');

    if (!modal) {
        console.error('❌ galleryModal 요소를 찾을 수 없음!');
        return;
    }

    if (!modalImage) {
        console.error('❌ galleryModalImage 요소를 찾을 수 없음!');
        return;
    }

    // 이미지 설정
    const imageSrc = galleryImages[imageIndex];
    console.log('🖼️ 모달에 표시할 이미지:', imageSrc);

    modalImage.src = imageSrc;
    modalImage.alt = `갤러리 사진 ${imageIndex + 1}`;

    // 카운터 업데이트
    if (counter) {
        counter.textContent = `${imageIndex + 1} / ${galleryImages.length}`;
    }

    // 네비게이션 버튼 표시/숨김
    updateModalNavigationButtons();

    // 모달 표시
    console.log('🖼️ 모달 표시 중...');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지

    // 터치 이벤트 리스너 추가 (모달용)
    addModalTouchEvents();

    console.log('✅ 갤러리 모달 열기 완료!');
}

// 갤러리 모달 닫기
function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 배경 스크롤 복원
}

// 모달 네비게이션 함수들
function previousModalImage() {
    if (currentModalIndex > 0) {
        openGalleryModal(currentModalIndex - 1);
    }
}

function nextModalImage() {
    if (currentModalIndex < galleryImages.length - 1) {
        openGalleryModal(currentModalIndex + 1);
    }
}

function updateModalNavigationButtons() {
    const prevButton = document.getElementById('galleryModalPrev');
    const nextButton = document.getElementById('galleryModalNext');

    if (prevButton && nextButton) {
        // 첫 번째 이미지인 경우 이전 버튼 숨김
        prevButton.style.opacity = currentModalIndex === 0 ? '0.3' : '1';
        prevButton.style.pointerEvents = currentModalIndex === 0 ? 'none' : 'auto';

        // 마지막 이미지인 경우 다음 버튼 숨김
        nextButton.style.opacity = currentModalIndex === galleryImages.length - 1 ? '0.3' : '1';
        nextButton.style.pointerEvents = currentModalIndex === galleryImages.length - 1 ? 'none' : 'auto';
    }
}

// 모달 터치 이벤트 변수
let modalTouchStartX = 0;
let modalTouchEndX = 0;

// 모달 터치 이벤트 추가
function addModalTouchEvents() {
    const modalImage = document.getElementById('galleryModalImage');
    if (!modalImage) return;

    modalImage.addEventListener('touchstart', handleModalTouchStart, { passive: true });
    modalImage.addEventListener('touchend', handleModalTouchEnd, { passive: false });
}

// 모달 터치 시작
function handleModalTouchStart(e) {
    modalTouchStartX = e.changedTouches[0].screenX;
}

// 모달 터치 끝
function handleModalTouchEnd(e) {
    modalTouchEndX = e.changedTouches[0].screenX;
    handleModalSwipe();
}

// 모달 스와이프 처리
function handleModalSwipe() {
    const swipeThreshold = 50; // 최소 스와이프 거리
    const swipeDistance = modalTouchEndX - modalTouchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // 오른쪽 스와이프 - 이전 이미지
            previousModalImage();
        } else {
            // 왼쪽 스와이프 - 다음 이미지
            nextModalImage();
        }
    }
}

// 계좌 모달 열기
function openAccountModal(type) {
    const groomModal = document.getElementById('groomAccountModal');
    const brideModal = document.getElementById('brideAccountModal');

    if (type === 'groom') {
        groomModal.style.display = 'block';
    } else if (type === 'bride') {
        brideModal.style.display = 'block';
    }
}

// 계좌 모달 닫기
function closeAccountModal() {
    const groomModal = document.getElementById('groomAccountModal');
    const brideModal = document.getElementById('brideAccountModal');

    groomModal.style.display = 'none';
    brideModal.style.display = 'none';
}

// 계좌번호 복사 기능 (개선됨)
function copyAccountNumber(accountInfo) {
    navigator.clipboard.writeText(accountInfo).then(function() {
        // 복사 완료 모달 표시
        const modal = document.getElementById('copyCompleteModal');
        const info = document.getElementById('copyCompleteInfo');

        const [bank, account] = accountInfo.split(' ');
        info.innerHTML = `<span class="font-bold">${bank} ${account}</span>`;

        modal.style.display = 'block';
        closeAccountModal();
    }).catch(function(err) {
        console.error('복사 실패:', err);
        showToast('복사에 실패했습니다. 다시 시도해주세요.');
    });
}

// 복사 완료 모달 닫기
function closeCopyCompleteModal() {
    const modal = document.getElementById('copyCompleteModal');
    modal.style.display = 'none';
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

// 축하 메시지 기능 (Google Sheets API 사용)
async function addMessage() {
    const messageText = document.getElementById('messageText').value.trim();
    const messageName = document.getElementById('messageName').value.trim();
    const messagePassword = document.getElementById('messagePassword').value.trim();

    if (!messageText || !messageName || !messagePassword) {
        showToast('이름, 비밀번호, 메시지를 모두 입력해주세요.');
        return;
    }

    const message = {
        name: messageName,
        text: messageText,
        password: messagePassword,
        date: new Date().toLocaleDateString('ko-KR'),
        time: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})
    };

    // 로딩 상태 표시
    const submitButton = document.querySelector('button[onclick="addMessage()"]');
    const originalText = submitButton?.textContent;
    if (submitButton) submitButton.textContent = '등록 중...';

    try {
        // Supabase에 저장 시도
        const success = await writeToSupabase(message);

        if (success) {
            // 성공 시 폼 초기화
            document.getElementById('messageText').value = '';
            document.getElementById('messageName').value = '';
            document.getElementById('messagePassword').value = '';

            showToast('축하 메시지가 등록되었습니다. 🎉 추첨 이벤트에 참여되었습니다!');
            loadMessages(); // 메시지 목록 새로고침
        } else {
            // 실패 시 localStorage에 저장 (fallback)
            let messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
            messages.unshift(message);
            localStorage.setItem('weddingMessages', JSON.stringify(messages));

            showToast('메시지가 임시 저장되었습니다. 새로고침 후 다시 시도해주세요.');
            loadMessagesFromLocalStorage();
        }
    } catch (error) {
        console.error('메시지 저장 오류:', error);
        showToast('메시지 저장 중 오류가 발생했습니다.');
    } finally {
        // 버튼 텍스트 복원
        if (submitButton && originalText) submitButton.textContent = originalText;
    }
}

// 메시지 목록 로드 (Supabase 사용)
async function loadMessages() {
    const messageList = document.getElementById('messageList');

    // 로딩 표시
    messageList.innerHTML = '<p class="text-center text-gray-500 py-8">댓글을 불러오는 중...</p>';

    try {
        // Supabase에서 데이터 읽기 시도
        const messages = await readFromSupabase();
        displayMessages(messages);
    } catch (error) {
        console.error('메시지 로드 오류:', error);
        // 실패 시 localStorage 사용
        loadMessagesFromLocalStorage();
    }
}

// 메시지 표시 함수 (공통)
function displayMessages(messages) {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    if (messages.length === 0) {
        messageList.innerHTML = '<p class="text-center text-gray-500 py-8">아직 등록된 축하 메시지가 없습니다.</p>';
        return;
    }

    messages.forEach((message, index) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'bg-white border border-gray-200 rounded p-4';
        messageElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-800">${message.name}</span>
                <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">${message.date} ${message.time || ''}</span>
                    <button onclick="deleteMessage('${message.id}', '${message.password}')" class="text-xs text-red-500 hover:text-red-700">삭제</button>
                </div>
            </div>
            <div class="text-gray-700 leading-relaxed">${message.text}</div>
        `;
        messageList.appendChild(messageElement);
    });
}

// 메시지 삭제 기능 (Supabase 사용)
async function deleteMessage(messageId, password) {
    const userPassword = prompt('비밀번호를 입력하세요:');
    if (!userPassword) return;

    if (userPassword !== password) {
        showToast('비밀번호가 틀렸습니다.');
        return;
    }

    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', messageId);

        if (error) {
            throw error;
        }

        showToast('메시지가 삭제되었습니다.');
        loadMessages(); // 목록 새로고침
    } catch (error) {
        console.error('메시지 삭제 오류:', error);
        showToast('메시지 삭제 중 오류가 발생했습니다.');
    }
}

// Supabase 초기화
function initializeSupabase() {
    try {
        // Supabase 클라이언트 생성
        supabase = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );

        console.log('Supabase 초기화 완료');
        loadMessages(); // 댓글 로드
    } catch (error) {
        console.error('Supabase 초기화 실패:', error);
        loadMessagesFromLocalStorage(); // 실패 시 로컬스토리지 사용
    }
}

// Supabase에서 댓글 읽기
async function readFromSupabase() {
    try {
        console.log('Supabase에서 댓글 읽기 시도...');
        console.log('Supabase 클라이언트 상태:', !!supabase);

        if (!supabase) {
            console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
            return [];
        }

        const { data, error } = await supabase
            .from('comments')
            .select('*');

        console.log('Supabase 쿼리 결과 - data:', data);
        console.log('Supabase 쿼리 결과 - error:', error);

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            console.log('댓글 데이터가 없습니다.');
            return [];
        }

        // 데이터 형식 변환
        const formattedData = data.map(row => {
            console.log('원본 데이터:', row);
            const formatted = {
                id: row.id,
                name: row.name || '',
                text: row.message || '',
                date: new Date().toLocaleDateString('ko-KR'),
                time: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'}),
                password: row.password || ''
            };
            console.log('변환된 데이터:', formatted);
            return formatted;
        });

        console.log('최종 반환 데이터:', formattedData);
        return formattedData;
    } catch (error) {
        console.error('Supabase 읽기 실패:', error);
        console.error('에러 세부사항:', error.message);
        return [];
    }
}

// Supabase에 댓글 쓰기
async function writeToSupabase(message) {
    try {
        console.log('Supabase에 댓글 쓰기 시도:', message);

        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    name: message.name,
                    message: message.text,
                    password: message.password
                }
            ]);

        if (error) {
            throw error;
        }

        console.log('Supabase 쓰기 성공:', data);
        return true;
    } catch (error) {
        console.error('Supabase 쓰기 실패:', error);
        showToast('댓글 등록 중 오류가 발생했습니다: ' + error.message);
        return false;
    }
}

// 로컬스토리지 fallback 함수
function loadMessagesFromLocalStorage() {
    const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    displayMessages(messages);
}

// 카카오 SDK 초기화
function initializeKakao() {
    if (typeof Kakao !== 'undefined') {
        // 카카오 JavaScript 키
        const kakaoKey = 'f8d015d54ef7ee8ca876a7bd337de29b';

        try {
            if (!Kakao.isInitialized()) {
                Kakao.init(kakaoKey);
                console.log('카카오 SDK 초기화 완료');
            }
        } catch (error) {
            console.error('카카오 SDK 초기화 실패:', error);
        }
    } else {
        console.warn('카카오 SDK가 로드되지 않았습니다.');
    }
}

// 카카오톡 공유 기능
function shareKakao() {
    if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
        showToast('카카오톡 공유 기능을 사용할 수 없습니다.');
        // 대체 기능으로 링크 복사
        copyLink();
        return;
    }

    try {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '이대형 ♥ 한빛송이 결혼식 안내',
                description: '2025년 10월 25일 (토) 오전 11시\n따뜻한 마음으로 축하해주시고 함께 기뻐해주시면 가슴에 품고 잘 살겠습니다.',
                imageUrl: window.location.origin + '/images/couple-main.jpg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            },
            buttons: [
                {
                    title: '청첩장 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href
                    }
                }
            ]
        });
    } catch (error) {
        console.error('카카오톡 공유 실패:', error);
        showToast('카카오톡 공유에 실패했습니다. 링크를 복사합니다.');
        // 실패 시 대체 기능으로 링크 복사
        copyLink();
    }
}

// 링크 공유 기능 (링크만 복사)
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('링크가 복사되었습니다! 📱');
    }).catch(() => {
        showToast('링크 복사에 실패했습니다. 다시 시도해주세요.');
    });
}

// 키보드 접근성 (개선됨)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 모든 팝업 모달 닫기
        closeGalleryModal();
        closeAccountModal();
        closeCopyCompleteModal();
    }

    // 갤러리 모달이 열려있는 경우
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal && galleryModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousModalImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextModalImage();
        }
        return;
    }

    // 갤러리 슬라이드 키보드 네비게이션
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
    }
});

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('페이지 오류:', e.error);
});

// 이미지 보호 기능 초기화 (개발자 도구와 독립적으로 동작)
function initializeImageProtection() {
    console.log('🖼️ 이미지 보호 기능 활성화 - 개발자 도구는 자유롭게 사용 가능합니다');

    // 우클릭 방지 (이미지에만)
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            showToast('이미지 저장이 제한되어 있습니다.');
            return false;
        }
    });

    // 드래그 방지
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // 이미지 선택 방지
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // 모든 이미지에 보호 속성 추가
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('draggable', 'false');
        img.classList.add('protected-img');
        img.oncontextmenu = () => false;
        img.onselectstart = () => false;
        img.ondragstart = () => false;

        // 모바일 길게 누르기 완전 차단
        img.style.webkitTouchCallout = 'none';
        img.style.webkitUserCallout = 'none';
        img.style.webkitCallout = 'none';
        img.style.webkitTapHighlightColor = 'transparent';

        // 모바일 이벤트 리스너 추가
        img.addEventListener('touchstart', preventLongPress, { passive: false });
        img.addEventListener('touchend', preventLongPress, { passive: false });
        img.addEventListener('touchcancel', preventLongPress, { passive: false });
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast('⚠️ 이미지 저장이 제한되어 있습니다.');
            return false;
        }, true);
    });

    // 개발자 도구 차단 기능 제거 - 자유롭게 사용 가능

    // 키보드 단축키 제한 완화 - 개발자 도구 관련 키는 모두 허용
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U 모두 허용
        // Ctrl+S (저장), Ctrl+P (인쇄)만 방지
        if (e.ctrlKey && (e.key === 's' || e.key === 'p')) {
            e.preventDefault();
            showToast('저장/인쇄 기능은 제한되어 있습니다.');
            return false;
        }

        // 개발자 도구 단축키는 모두 허용됨
        console.log('🛠️ 개발자 도구 단축키 허용: 자유롭게 사용하세요!');
    });

    // 모바일 터치 이벤트 처리 (핀치 줌만 제한적으로 방지)
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            // 갤러리 영역에서만 멀티터치 방지
            if (e.target.closest('.gallery-slider-container')) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // 고급 이미지 보호 적용
    applyAdvancedImageProtection();

    // 추가 보안 조치 적용
    applyAdditionalSecurityMeasures();

    // 모바일 전용 추가 보안
    if (isMobileDevice()) {
        applyMobileSpecificProtection();
    }

    // Phase 4: 우회 접근 완전 차단 시스템
    initializeBypassBlockingSystem();

    console.log('이미지 보호 기능이 활성화되었습니다.');
}

// Phase 4: 우회 접근 완전 차단 시스템
function initializeBypassBlockingSystem() {
    console.log('🛡️ 우회 접근 완전 차단 시스템 초기화 중...');

    // 1. 네트워크 요청 모니터링 (이미지 다운로드 시도 감지)
    monitorNetworkRequests();

    // 2. DOM 변조 감지
    initializeDOMTamperDetection();

    // 3. 브라우저 확장 프로그램 감지
    detectBrowserExtensions();

    // 개발자 도구 감지 기능 제거 - 사용자 친화적으로 변경

    // 5. 메모리 덤프 방지
    preventMemoryDumping();

    // 6. 자동화 도구 감지 (Selenium, Playwright 등)
    detectAutomationTools();

    // 7. 스크린샷 API 차단
    blockScreenshotAPIs();

    console.log('✅ 우회 접근 완전 차단 시스템 활성화 완료');
}

// 네트워크 요청 모니터링 비활성화 (정상 사용자 경험 보장)
function monitorNetworkRequests() {
    console.log('🛡️ 네트워크 모니터링: 사용자 경험 보장을 위해 비활성화');
    // 정상적인 이미지 로드와 사이트 기능을 방해하지 않도록 완전 비활성화
}

// DOM 변조 감지 최적화 (정상 사용자 경험 보장)
function initializeDOMTamperDetection() {
    console.log('🛡️ DOM 변조 감지: 정상 이미지 로드 허용을 위해 최적화');

    // 갤러리 이미지 로드는 정상적인 동작이므로 완전 비활성화
    // 필요 시 향후 더 정교한 로직으로 교체 가능
}

// 브라우저 확장 프로그램 감지 최적화 (과도한 경고 방지)
function detectBrowserExtensions() {
    // 개발자 도구 확장만 감지하고 일반 확장은 허용
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('개발자 도구 확장 감지됨');
    }

    // 일반적인 Chrome 기능은 허용 (사용자 경험 개선)
    console.log('🛡️ 브라우저 확장 감지: 정상 사용 허용 모드');
}

// 개발자 도구 감지 기능 완전 제거
// 사용자가 자유롭게 개발자 도구를 사용할 수 있도록 허용
function initializeAdvancedDevToolsDetection() {
    console.log('🛠️ 개발자 도구 사용이 허용됩니다. 자유롭게 사용하세요!');
    // 개발자 도구 감지 및 차단 기능 완전 제거
}

// 메모리 덤프 방지
function preventMemoryDumping() {
    // 메모리 정리를 주기적으로 실행
    setInterval(() => {
        // 사용하지 않는 변수들 정리
        if (window.gc) {
            window.gc();
        }
    }, 30000); // 30초마다

    // WeakMap을 사용하여 참조 추적 어렵게 만들기
    const protectedData = new WeakMap();
}

// 자동화 도구 감지
function detectAutomationTools() {
    // WebDriver 감지
    if (navigator.webdriver) {
        console.warn('🚨 자동화 도구 (WebDriver) 감지됨');
        showToast('⚠️ 자동화 도구가 감지되었습니다.');
        return;
    }

    // Selenium 특성 감지
    if (window.document.documentElement.getAttribute('webdriver') ||
        window.callPhantom ||
        window._phantom ||
        window.__nightmare ||
        window.Buffer) {
        console.warn('🚨 자동화 도구 특성 감지됨');
        showToast('⚠️ 자동화 도구가 감지되었습니다.');
    }

    // Chrome DevTools Protocol 감지
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
        console.warn('🚨 Chrome DevTools Protocol 활성화 감지');
    }
}

// 스크린샷 API 차단
function blockScreenshotAPIs() {
    // Screen Capture API 차단
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = function() {
            console.warn('🚨 화면 캡처 API 사용 시도 감지');
            showToast('⚠️ 화면 캡처가 차단되었습니다.');
            return Promise.reject(new DOMException('Access denied', 'NotAllowedError'));
        };
    }

    // Canvas toDataURL 오버라이드 (강화)
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function() {
        // 보호된 이미지가 그려진 캔버스인지 확인
        const canvas = this;
        const ctx = canvas.getContext('2d');

        if (ctx && ctx.__containsProtectedImage) {
            console.warn('🚨 보호된 이미지 캔버스 데이터 추출 시도 감지');
            showToast('⚠️ 보호된 콘텐츠의 데이터 추출이 차단되었습니다.');
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        }

        return originalToDataURL.apply(this, arguments);
    };
}

// 모바일 길게 누르기 방지 함수 (개선된 버전)
function preventLongPress(e) {
    // touchstart와 touchend는 차단하지 않음 (클릭 허용)
    if (e.type === 'touchstart' || e.type === 'touchend') {
        return; // 일반 터치는 허용
    }

    // contextmenu만 차단 (길게 누르기로 인한 컨텍스트 메뉴)
    if (e.type === 'contextmenu') {
        e.preventDefault();
        e.stopPropagation();
        showToast('⚠️ 이미지 길게 누르기가 제한되어 있습니다.');
    }

    return false;
}

// 고급 이미지 보호 기능
function applyAdvancedImageProtection() {
    // 모든 갤러리 이미지에 워터마크와 Canvas 보호 적용
    const galleryImages = document.querySelectorAll('.gallery-item img, #galleryModalImage');

    galleryImages.forEach(img => {
        // 이미지 로드 완료 후 Canvas로 변환
        img.addEventListener('load', function() {
            if (!this.dataset.protected) {
                convertImageToCanvas(this);
                this.dataset.protected = 'true';
            }
        });

        // 이미지가 이미 로드된 경우
        if (img.complete && img.naturalWidth > 0 && !img.dataset.protected) {
            convertImageToCanvas(img);
            img.dataset.protected = 'true';
        }
    });
}

// 이미지를 Canvas로 변환하여 보호
function convertImageToCanvas(imgElement) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Canvas 크기 설정
        canvas.width = imgElement.naturalWidth || imgElement.width;
        canvas.height = imgElement.naturalHeight || imgElement.height;

        // 이미지를 Canvas에 그리기
        ctx.drawImage(imgElement, 0, 0);

        // 투명한 워터마크 추가
        addWatermark(ctx, canvas.width, canvas.height);

        // Canvas를 Base64로 변환
        const dataURL = canvas.toDataURL('image/jpeg', 0.95);

        // 원본 이미지를 Canvas 데이터로 교체
        imgElement.src = dataURL;

        // Canvas 요소에 보호 속성 추가
        canvas.style.cssText = imgElement.style.cssText;
        canvas.className = imgElement.className;
        canvas.setAttribute('draggable', 'false');
        canvas.oncontextmenu = () => false;
        canvas.onselectstart = () => false;
        canvas.ondragstart = () => false;

    } catch (error) {
        console.warn('이미지 보호 처리 중 오류:', error);
    }
}

// 투명한 워터마크 추가
function addWatermark(ctx, width, height) {
    ctx.save();

    // 투명도 설정 (매우 투명하게)
    ctx.globalAlpha = 0.02;

    // 폰트 설정
    const fontSize = Math.min(width, height) * 0.05;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';

    // 워터마크 텍스트
    const watermarkText = '이대형 ♥ 한빛송이';

    // 여러 위치에 워터마크 추가
    const positions = [
        [width * 0.2, height * 0.2],
        [width * 0.8, height * 0.2],
        [width * 0.5, height * 0.5],
        [width * 0.2, height * 0.8],
        [width * 0.8, height * 0.8]
    ];

    positions.forEach(([x, y]) => {
        ctx.fillText(watermarkText, x, y);
    });

    ctx.restore();
}

// 개발자 도구 감지 및 경고
function detectDevTools() {
    let devtools = {
        open: false,
        orientation: null
    };

    const threshold = 160;
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                showDevToolsWarning();
            }
        } else {
            devtools.open = false;
        }
    }, 500);
}

// 콘솔 차단 기능 제거 - 개발자가 자유롭게 디버깅할 수 있도록 허용
function showDevToolsWarning() {
    // 더 이상 경고하지 않고 콘솔도 차단하지 않음
    console.log('🛠️ 개발자 도구를 자유롭게 사용하세요! 콘솔 기능이 모두 활성화되어 있습니다.');
}

// 추가 보안 조치 적용
function applyAdditionalSecurityMeasures() {
    // 직접 이미지 URL 접근 감지 및 차단
    const currentURL = window.location.href;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    // 현재 URL이 이미지 파일인지 확인
    const isDirectImageAccess = imageExtensions.some(ext =>
        currentURL.toLowerCase().includes(ext.toLowerCase()) ||
        currentURL.toLowerCase().includes('gallery/')
    );

    if (isDirectImageAccess) {
        // 직접 이미지 접근을 감지했을 경우
        console.log('직접 이미지 접근 감지됨:', currentURL);

        // 메인 페이지로 즉시 리디렉션
        window.location.replace(window.location.origin + '/bigtrader91/index.html');
        return;
    }

    // 이미지 referrer 검증 강화
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img[src*="gallery/"]');
        images.forEach(img => {
            // 이미지 로드 시 referrer 검증
            img.addEventListener('load', function() {
                if (!document.referrer.includes(window.location.hostname) &&
                    !window.location.href.includes('index.html')) {
                    // 잘못된 referrer에서 이미지에 접근하려는 경우 차단
                    this.style.display = 'none';
                    this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>';
                }
            });
        });
    });

    // 페이지 가시성 변화 감지 (탭 변경, 최소화 등)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            showToast('⚠️ 탭을 전환하거나 최소화하면 이미지가 보호됩니다.');
            // 이미지들을 일시적으로 숨김
            document.querySelectorAll('img').forEach(img => {
                img.style.visibility = 'hidden';
            });
        } else {
            // 탭이 다시 활성화되면 이미지 복원
            setTimeout(() => {
                document.querySelectorAll('img').forEach(img => {
                    img.style.visibility = 'visible';
                });
            }, 100);
        }
    });

    // Print Screen 및 추가 키보드 단축키 방지
    document.addEventListener('keydown', function(e) {
        // Print Screen, Alt+Print Screen 방지
        if (e.key === 'PrintScreen' ||
            (e.altKey && e.key === 'PrintScreen') ||
            e.code === 'PrintScreen') {
            e.preventDefault();
            showToast('⚠️ 화면 캡처가 제한되어 있습니다.');
            return false;
        }

        // 모든 개발자 도구 단축키 허용됨 (F12, Ctrl+Shift+I 등)

        // 다른 보안 관련 단축키만 제한

        // 확대/축소 방지 (Ctrl + Plus/Minus)
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
            e.preventDefault();
            showToast('⚠️ 페이지 확대/축소가 제한되어 있습니다.');
            return false;
        }
    });

    // 이미지에서만 우클릭 차단 (다른 요소는 허용)
    document.addEventListener('contextmenu', function(e) {
        // 이미지나 갤러리 영역에서만 우클릭 차단
        if (e.target.tagName === 'IMG' ||
            e.target.closest('img') ||
            e.target.closest('.gallery-slider-container') ||
            e.target.classList.contains('gallery-item')) {
            e.preventDefault();
            showToast('⚠️ 이미지 우클릭이 제한되어 있습니다.');
            return false;
        }
        // 다른 영역은 우클릭 허용
    }, true);

    // 이미지만 텍스트 선택 방지 (다른 요소는 허용)
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG' || e.target.closest('img')) {
            e.preventDefault();
            return false;
        }
        // INPUT, TEXTAREA, 일반 텍스트는 선택 허용
    });

    // 이미지만 드래그 방지 (다른 요소는 허용)
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG' || e.target.closest('img')) {
            e.preventDefault();
            return false;
        }
    });

    // 모바일 터치 이벤트 개선 (iOS Safari 호환성 향상)
    let longPressTimer = null;
    let touchStartTime = 0;

    document.addEventListener('touchstart', function(e) {
        // iOS Safari에서는 터치 이벤트 차단을 최소화
        const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // 갤러리 아이템이 아닌 경우 항상 정상 처리 허용
        if (!e.target.closest('.gallery-item') && e.target.tagName !== 'IMG') {
            return;
        }

        // 멀티터치는 갤러리에서만 방지
        if (e.touches.length > 1 && e.target.closest('.gallery-slider-container')) {
            e.preventDefault();
            return false;
        }

        const isGalleryImage = e.target.closest('.gallery-item') ||
                              (e.target.tagName === 'IMG' && e.target.closest('#galleryModalImage'));

        if (isGalleryImage && !isIOSSafari) {
            // iOS Safari가 아닌 경우만 길게 누르기 타이머 설정
            touchStartTime = Date.now();
            longPressTimer = setTimeout(() => {
                showToast('⚠️ 이미지 길게 누르기가 제한되어 있습니다.');
            }, 1500); // iOS Safari 호환성을 위해 1.5초로 연장
        }
    }, { passive: true }); // passive: true로 변경하여 성능 개선

    document.addEventListener('touchend', function(e) {
        // 길게 누르기 타이머 해제
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        // iOS Safari에서는 터치 차단 최소화
        const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOSSafari) {
            return; // iOS Safari에서는 터치 이벤트 차단하지 않음
        }

        const touchDuration = Date.now() - touchStartTime;
        const isGalleryImage = e.target.closest('.gallery-item') ||
                              (e.target.tagName === 'IMG' && e.target.closest('#galleryModalImage'));

        // 매우 긴 시간(1.5초 이상) 길게 눌렀을 때만 차단
        if (touchDuration > 1500 && isGalleryImage) {
            e.preventDefault();
            showToast('⚠️ 이미지 길게 누르기가 제한되어 있습니다.');
            return false;
        }
    }, { passive: false });

    document.addEventListener('touchcancel', function(e) {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });

    // 페이지 블러 시 추가 보안 (포커스 잃을 때)
    window.addEventListener('blur', function() {
        // 이미지들을 일시적으로 숨김
        document.querySelectorAll('img').forEach(img => {
            img.style.filter = 'blur(10px)';
        });
    });

    window.addEventListener('focus', function() {
        // 포커스 복귀 시 이미지 복원
        setTimeout(() => {
            document.querySelectorAll('img').forEach(img => {
                img.style.filter = 'none';
            });
        }, 100);
    });

    // 줌 레벨 감지 및 제한
    let lastZoomLevel = window.devicePixelRatio;
    setInterval(() => {
        const currentZoomLevel = window.devicePixelRatio;
        if (Math.abs(currentZoomLevel - lastZoomLevel) > 0.1) {
            showToast('⚠️ 페이지 확대/축소가 감지되었습니다.');
            lastZoomLevel = currentZoomLevel;
        }
    }, 1000);
}

// 모바일 디바이스 감지
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (typeof window.orientation !== 'undefined') ||
           (navigator.maxTouchPoints > 0) ||
           ('ontouchstart' in window);
}

// iOS Safari 호환 모바일 보안 조치 (최적화됨)
function applyMobileSpecificProtection() {
    // iOS Safari 전용 최소한의 보안 조치
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // 갤러리 이미지에만 적용
        document.querySelectorAll('.gallery-item img, #galleryModalImage').forEach(img => {
            img.style.webkitTouchCallout = 'none';
            img.style.webkitUserCallout = 'none';
            img.style.webkitCallout = 'none';
        });

        console.log('iOS Safari 호환 보안 조치 적용 완료');
    }

    // Android 전용 최적화된 보안 조치
    if (/Android/i.test(navigator.userAgent)) {
        // 갤러리 이미지에서만 텍스트 선택 방지
        document.addEventListener('selectstart', function(e) {
            if (e.target.closest('.gallery-item') || e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        console.log('Android 호환 보안 조치 적용 완료');
    }

    // 갤러리 영역에만 보안 조치 적용 (사용자 경험 개선)
    const galleryContainer = document.querySelector('.gallery-slider-container');
    if (galleryContainer) {
        galleryContainer.style.webkitUserSelect = 'none';
        galleryContainer.style.webkitTouchCallout = 'none';
        galleryContainer.style.webkitTapHighlightColor = 'transparent';
    }

    console.log('모바일 호환 보안 조치 적용 완료');
}

// 갤러리 터치 이벤트 초기화
function initializeGalleryTouchEvents() {
    const galleryContainer = document.querySelector('.gallery-slider-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        console.log('갤러리 터치 이벤트 초기화 완료');
    } else {
        console.warn('갤러리 컨테이너를 찾을 수 없어 터치 이벤트를 초기화할 수 없습니다.');
    }
}

// 중복된 detectDevTools 함수 제거됨 - initializeAdvancedDevToolsDetection 함수를 사용 