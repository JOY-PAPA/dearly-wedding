# DEARLY WEDDING

베리굿 웨딩 김다애 플래너의 소개, 실제 진행 후기, 인스타그램과 상담 문의를 담은 공식 홈페이지입니다.

## 배포

- GitHub Pages: `https://joy-papa.github.io/dearly-wedding/`
- 기존 Sites 배포는 별도로 유지됩니다.
- `main` 브랜치에 변경사항을 올리면 GitHub Actions가 정적 사이트를 자동으로 다시 배포합니다.

## 로컬 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm install
npm run dev
```

## 주요 명령어

- `npm run build`: Sites/Vinext 배포 빌드
- `npm run build:pages`: GitHub Pages용 정적 사이트 생성
- `npm test`: 렌더링 테스트
