# 모바일 청첩장 (Wedding Invitation)

GitHub Pages를 이용한 미니멀한 모바일 청첩장입니다.

## 🎉 주요 기능

- **미니멀 디자인**: 심플하고 은은한 각진 모던 디자인
- **Pretendard 폰트**: 로컬 폰트 파일 사용으로 빠른 로딩
- **BGM 자동재생**: 첫 클릭 시 배경음악 자동 시작
- **축의금 계좌**: 양가 부모님 포함 총 6개 계좌 원클릭 복사
- **반응형 디자인**: 모바일 우선 최적화
- **인터랙티브 기능**:
  - 풀스크린 첫화면 이미지
  - 갤러리 모달 팝업
  - 축하 메시지 작성 및 저장 (로컬 스토리지)
  - 카카오톡 공유 / 링크 복사
  - 전화 바로 연결

## 🎨 디자인 특징

- **색상 스킴**: 
  - 바탕: #EDEEF0
  - 주 컬러: #EDE1E3, #D1DFE8
  - 보조: #909FA6
- **미니멀 스타일**: 각진 요소, 심플한 레이아웃
- **모바일 친화적**: 터치 최적화, 부드러운 인터랙션

## 📁 파일 구조

```
bigtrader91/
├── index.html              # 메인 HTML 파일
├── script.js               # JavaScript 기능
├── docs/
│   └── 체크리스트.md        # 개발 체크리스트
├── fonts/                  # Pretendard 폰트 파일들
│   ├── Pretendard-Thin.woff
│   ├── Pretendard-ExtraLight.woff
│   ├── Pretendard-Light.woff
│   ├── Pretendard-Regular.woff
│   ├── Pretendard-Medium.woff
│   ├── Pretendard-SemiBold.woff
│   ├── Pretendard-Bold.woff
│   ├── Pretendard-ExtraBold.woff
│   └── Pretendard-Black.woff
├── images/                 # 이미지 폴더
│   ├── couple-main.jpg     # 첫화면 풀스크린 이미지
│   ├── couple-photo.jpg    # 신랑신부 프로필 사진
│   ├── photo1.jpg          # 갤러리 사진 1
│   ├── photo2.jpg          # 갤러리 사진 2
│   ├── photo3.jpg          # 갤러리 사진 3
│   └── photo4.jpg          # 갤러리 사진 4
├── audio/                  # 오디오 파일
│   └── BGM.mp3            # 배경음악
└── README.md              # 프로젝트 설명
```

## 🚀 GitHub Pages 배포 방법

### 1단계: GitHub 저장소 생성
1. GitHub에 로그인
2. 새 저장소(Repository) 생성
3. 저장소 이름을 `사용자이름.github.io`로 설정
   - 예: `honggildong.github.io`
4. Public으로 설정하고 생성

### 2단계: 파일 업로드
1. 생성된 저장소에 모든 파일 업로드:
   - `index.html`
   - `script.js`
   - `fonts/` 폴더와 모든 폰트 파일들
   - `images/` 폴더와 이미지들
   - `audio/` 폴더와 BGM.mp3
   - `docs/` 폴더
   - `README.md`

### 3단계: GitHub Pages 활성화
1. 저장소의 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 선택
3. **Source** 섹션에서:
   - **Deploy from a branch** 선택
   - **Branch**: `main` (또는 `master`) 선택
   - **Folder**: `/ (root)` 선택
4. **Save** 버튼 클릭

### 4단계: 배포 확인
- 몇 분 후 `https://사용자이름.github.io`로 접속하여 확인
- 배포 상태는 저장소의 **Actions** 탭에서 확인 가능

## 🖼️ 이미지 준비 가이드

다음 이미지들을 준비하여 `images/` 폴더에 추가하세요:

1. **couple-main.jpg**: 첫화면 풀스크린 이미지 (16:9 비율 권장, 1920x1080px)
2. **couple-photo.jpg**: 신랑신부 프로필 사진 (정사각형 권장, 500x500px)
3. **photo1.jpg ~ photo4.jpg**: 갤러리 사진들 (정사각형 권장, 800x800px)

### 이미지 최적화 팁
- 파일 크기: 각 이미지당 1MB 이하 권장
- 형식: JPG (용량 효율적) 또는 PNG (고품질)
- 해상도: 모바일 화면에 맞게 적절히 조정

## 🎵 BGM 준비

- `audio/BGM.mp3` 파일을 준비하세요
- 권장 사양: MP3 형식, 128kbps, 3-5분 길이
- 저작권 이슈가 없는 음악 사용 권장

## ✏️ 내용 수정 방법

### 기본 정보 수정 (`index.html`)
```html
<!-- 신랑신부 이름 -->
<h1 class="text-3xl md:text-4xl font-light tracking-widest mb-4">이대형 & 한빛송이</h1>

<!-- 결혼식 날짜 -->
<p class="text-lg font-light opacity-90">2025. 12. 25</p>

<!-- 결혼식 장소 -->
<p class="text-sm text-gray-600">대전 웨딩홀</p>
<p class="text-sm text-gray-600">3층 그랜드볼룸</p>
```

### 축의금 계좌 수정
```html
<!-- 계좌번호 수정 예시 -->
<p class="text-sm text-gray-600">농협 302-1790-0147-51</p>
<button onclick="copyAccount('농협 302-1790-0147-51')">복사</button>
```

### 연락처 수정
```html
<!-- 전화번호 수정 -->
<a href="tel:010-5755-9112">
    <i class="fas fa-phone text-xs" style="color: #909FA6;"></i>
</a>
```

## 💰 축의금 계좌 현황

**신랑측 (3개):**
1. 신랑 이대형: 농협 302-1790-0147-51
2. 아버지 이명행: 농협 123-456-789012
3. 어머니 허희순: 신한은행 110-987-654321

**신부측 (3개):**
1. 신부 한빛송이: 농협 302-3924-2203-51
2. 아버지 한봉호: 우리은행 1002-123-456789
3. 어머니 이순남: 국민은행 123456-78-901234

## 📱 모바일 기능

- **BGM 제어**: 우상단 음악 버튼으로 재생/일시정지
- **전화 걸기**: 연락처의 전화 아이콘 터치
- **계좌 복사**: 축의금 섹션의 "복사" 버튼 터치
- **이미지 확대**: 갤러리 이미지 터치로 모달 팝업
- **공유하기**: 하단 고정 버튼으로 카카오톡 공유/링크 복사
- **축하 메시지**: 로컬 저장으로 새로고침 후에도 유지

## 🎨 색상 커스터마이징

### 메인 색상 변경
```css
/* CSS에서 색상 변경 시 */
:root {
    --bg-main: #EDEEF0;
    --primary: #EDE1E3;
    --secondary: #D1DFE8;
    --accent: #909FA6;
}
```

### HTML에서 인라인 스타일 변경
```html
<!-- 배경색 변경 예시 -->
<div style="background-color: #새로운색상;">
```

## 🛠️ 고급 기능

### PWA (Progressive Web App) 변환
1. `manifest.json` 파일 생성
2. Service Worker 추가
3. 모바일 홈 화면에 추가 가능

### 방문자 통계 (Google Analytics)
```html
<!-- index.html의 <head> 태그 안에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 커스텀 도메인 연결
1. 도메인 구매 후 DNS 설정
2. GitHub Pages Settings에서 Custom domain 설정
3. HTTPS 강제 활성화

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS (CDN)
- **Icons**: Font Awesome 6
- **Font**: Pretendard (로컬 파일)
- **Hosting**: GitHub Pages
- **Storage**: localStorage (축하 메시지)
- **Share**: Kakao JavaScript SDK

## 📋 개발 체크리스트

프로젝트의 모든 요구사항과 완료 상태는 [`docs/체크리스트.md`](docs/체크리스트.md)에서 확인할 수 있습니다.

## 🐛 문제 해결

### 자주 발생하는 문제들

1. **BGM이 자동 재생되지 않을 때**
   - 브라우저 정책상 사용자 상호작용 후 재생됩니다
   - 화면 아무곳이나 한 번 클릭하세요

2. **폰트가 로드되지 않을 때**
   - `fonts/` 폴더와 모든 .woff 파일이 업로드되었는지 확인
   - 브라우저 캐시를 새로고침하세요

3. **이미지가 표시되지 않을 때**
   - 파일명이 정확한지 확인 (대소문자 구분)
   - 이미지 파일 크기가 GitHub 제한(25MB)을 넘지 않는지 확인

4. **모바일에서 레이아웃이 깨질 때**
   - 브라우저 호환성 확인 (iOS Safari, Android Chrome)
   - 뷰포트 설정이 올바른지 확인

## 📞 지원 및 기여

- 🐞 **버그 신고**: GitHub Issues
- 💡 **기능 제안**: GitHub Discussions
- 🔧 **코드 기여**: Pull Request 환영

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자유롭게 사용, 수정, 배포할 수 있습니다.

---

## 🎊 특별 감사

- **Pretendard Font**: [https://github.com/orioncactus/pretendard](https://github.com/orioncactus/pretendard)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **Font Awesome**: [https://fontawesome.com](https://fontawesome.com)

---

💕 **행복한 결혼식 되세요!** 💕 

## 📱 카카오톡 공유 설정

실제 카카오톡 공유 팝업을 사용하려면 카카오 개발자 센터에서 앱을 등록해야 합니다.

### 빠른 설정
1. [카카오 개발자 센터](https://developers.kakao.com/) 접속
2. 애플리케이션 추가 → JavaScript 키 발급
3. `script.js`에서 `YOUR_JAVASCRIPT_KEY`를 발급받은 키로 교체
4. 플랫폼에 도메인 등록 (GitHub Pages: `https://사용자명.github.io`)

### 상세 가이드
자세한 설정 방법은 [`docs/카카오톡_공유_설정.md`](docs/카카오톡_공유_설정.md)를 참고하세요.

**주요 기능**:
- 🎨 **예쁜 카드 형태**: 이미지와 함께 풍부한 정보 표시
- 📱 **모바일 최적화**: 카카오톡 앱에서 바로 공유 가능
- 🔄 **자동 fallback**: 실패 시 텍스트 복사 방식으로 전환
- 🎯 **직접 링크**: 축하메시지 섹션으로 바로 이동 가능 