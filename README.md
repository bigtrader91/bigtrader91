# 모바일 청첩장 (Wedding Invitation)

GitHub Pages를 이용한 반응형 모바일 청첩장입니다.

## 🎉 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **아름다운 UI**: 현대적이고 우아한 디자인
- **인터랙티브 기능**:
  - 축하 메시지 작성 및 저장 (로컬 스토리지)
  - 갤러리 이미지 확대 보기
  - 전화/문자 바로 연결
  - 지도 연동 (길찾기)
  - 부드러운 스크롤 애니메이션
- **모바일 최적화**: 터치 제스처, 모바일 앱 연동

## 📁 파일 구조

```
bigtrader91/
├── index.html          # 메인 HTML 파일
├── style.css           # CSS 스타일시트
├── script.js           # JavaScript 기능
├── images/             # 이미지 폴더
│   ├── couple-photo.jpg    # 신랑신부 사진
│   ├── photo1.jpg          # 갤러리 사진 1
│   ├── photo2.jpg          # 갤러리 사진 2
│   ├── photo3.jpg          # 갤러리 사진 3
│   └── photo4.jpg          # 갤러리 사진 4
└── README.md           # 프로젝트 설명
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
   - `style.css`
   - `script.js`
   - `images/` 폴더와 이미지들
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

## 🖼️ 이미지 준비

`images/` 폴더에 다음 이미지들을 추가하세요:

1. **couple-photo.jpg**: 신랑신부 메인 사진 (정사각형 권장, 최소 300x300px)
2. **photo1.jpg ~ photo4.jpg**: 갤러리 사진들 (정사각형 권장, 최소 500x500px)

### 이미지 최적화 팁
- 파일 크기: 각 이미지당 500KB 이하 권장
- 형식: JPG 또는 PNG
- 해상도: 모바일 화면에 맞게 적절히 조정

## ✏️ 내용 수정 방법

### 기본 정보 수정 (`index.html`)
```html
<!-- 신랑신부 이름 -->
<h1 class="couple-names">김민준 ♥ 이지은</h1>

<!-- 결혼식 날짜 -->
<p class="wedding-date">2024년 12월 25일 오후 2시</p>

<!-- 결혼식 장소 -->
<p class="wedding-venue">서울 강남구 웨딩홀</p>
```

### 연락처 수정
```html
<!-- 전화번호 수정 -->
<a href="tel:010-1234-5678"><i class="fas fa-phone"></i></a>
<a href="sms:010-1234-5678"><i class="fas fa-sms"></i></a>
```

### 색상 테마 변경 (`style.css`)
```css
/* 메인 색상 변경 */
.main-header {
    background: linear-gradient(135deg, #새로운색상1 0%, #새로운색상2 100%);
}
```

## 📱 모바일 기능

- **전화 걸기**: 연락처의 전화 아이콘 터치
- **문자 보내기**: 연락처의 문자 아이콘 터치
- **지도 앱 연동**: 지도 섹션의 "길찾기" 버튼
- **이미지 확대**: 갤러리 이미지 터치
- **축하 메시지**: 로컬 저장으로 새로고침 후에도 유지

## 🛠️ 고급 기능 추가

### 카카오맵 연동
1. [카카오 개발자센터](https://developers.kakao.com/)에서 앱 키 발급
2. `script.js`의 `initializeMap()` 함수 수정

### 구글 애널리틱스 추가
```html
<!-- index.html의 <head> 태그 안에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### PWA (Progressive Web App) 변환
1. `manifest.json` 파일 생성
2. Service Worker 추가
3. 모바일 홈 화면에 추가 가능

## 🎨 커스터마이징

### 테마 색상
- 보라색 계열: `#667eea`, `#764ba2`
- 핑크색 계열: `#f093fb`, `#f5576c`
- 배경색: `#f5f7fa`, `#c3cfe2`

### 폰트 변경
```css
/* 다른 폰트 사용 시 */
@import url('https://fonts.googleapis.com/css2?family=원하는폰트&display=swap');

body {
    font-family: '원하는폰트', sans-serif;
}
```

## 📞 지원

문제가 발생하거나 추가 기능이 필요한 경우:
1. GitHub Issues에 문의
2. 코드 수정 후 Pull Request 제출

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자유롭게 사용, 수정, 배포할 수 있습니다.

---

💕 **행복한 결혼식 되세요!** 💕 