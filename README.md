# 📖 똑DDOK — 당신 곁의 동료, 딸깍!

> 지도 기반 프로젝트·스터디 매칭 & 팀 협업 플랫폼 

<br />

지도 기반으로 스터디/프로젝트를 빠르게 찾고 참여하고, 팀 협업(채팅·일정·알림)까지 한 곳에서 처리하는 플랫폼입니다.   

- 프로젝트 기간: 2025.08 ~ 2025.09 (기획 및 개발)   
- 시연영상 [YouTube](https://youtu.be/tJxeeBno15E?si=37zNZ9FemquKkHhN)   
- 배포: ~https://www.deepdirect.site/~   


![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=FFD62E)
![Zustand](https://img.shields.io/badge/Zustand-443e38?logo=react&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=react-query&logoColor=white)
![SCSS Modules](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![dayjs](https://img.shields.io/badge/day.js-FF5F2E?logo=javascript&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?logo=socketdotio&logoColor=white)

<br />

---

## 내 기여
| 카테고리 | 기여 내용 |
| --- | --- |
| **실시간 채팅** | - 채팅 컴포넌트 제작 ([#42](https://github.com/DeepDirect/ddok-fe/pull/42))<br>- 채팅 UI 구현 ([#127](https://github.com/DeepDirect/ddok-fe/pull/127), [#166](https://github.com/DeepDirect/ddok-fe/pull/166), [#199](https://github.com/DeepDirect/ddok-fe/pull/199))<br>- 안읽음 표시 구현 ([#158](https://github.com/DeepDirect/ddok-fe/pull/158), [#166](https://github.com/DeepDirect/ddok-fe/pull/166))<br>- 뒤로가기 기능 ([#207](https://github.com/DeepDirect/ddok-fe/pull/207)) |
| **검색/조회 페이지** | - 프로젝트/스터디/플레이어 조회 페이지 구현 ([#53](https://github.com/DeepDirect/ddok-fe/pull/53), [#65](https://github.com/DeepDirect/ddok-fe/pull/65), [#68](https://github.com/DeepDirect/ddok-fe/pull/68), [#76](https://github.com/DeepDirect/ddok-fe/pull/76), [#77](https://github.com/DeepDirect/ddok-fe/pull/77), [#112](https://github.com/DeepDirect/ddok-fe/pull/112), [#118](https://github.com/DeepDirect/ddok-fe/pull/118), [#147](https://github.com/DeepDirect/ddok-fe/pull/147))<br>- 조회 페이지 API 연동 ([#76](https://github.com/DeepDirect/ddok-fe/pull/76), [#77](https://github.com/DeepDirect/ddok-fe/pull/77), [#80](https://github.com/DeepDirect/ddok-fe/pull/80)) |
| **공통/환경 구성** | - 공통 컴포넌트 생성 ([#7](https://github.com/DeepDirect/ddok-fe/pull/7))<br>- axios 설정 및 공용 데이터 요청 훅 제작 ([#13](https://github.com/DeepDirect/ddok-fe/pull/13))<br>- README 작성 ([#189](https://github.com/DeepDirect/ddok-fe/pull/189)) |


<br />

## 구현 기능
- **실시간 채팅 UI**
  - 안 읽음 상태 표시
  - 채팅 상세 페이지 & 뒤로가기/스타일 개선
- **검색/조회 페이지**
  - 프로젝트/스터디/플레이어 검색
  - 조회 페이지 API 연동 및 결과 반영
  - 조회 카드/리스트 컴포넌트
- **공통 컴포넌트/환경**
  - axios 훅 기반 공통 요청 모듈
  - 재사용 가능한 UI 컴포넌트
- **UX 개선**
  - 검색과 채팅 데이터 즉시 동기화

<br />

## 이슈 해결 사례
1) 실시간 안 읽음 표시 버그 해결
   - 문제: 채팅 화면 이탈(언마운트) 타이밍에 마지막 읽은 메시지 전송이 누락되어 새로운 메세지가 생겼을 때 표시되지 않거나 안 읽음 표시가 남는 현상 발생.
   - 원인: cleanup 시점의 네트워크 취소/지연 + 캐시만 갱신하고 서버 반영이 실패하는 케이스 존재
   - 해결:
     - 로그인 사용자의 개인 구독 채널(/sub/users/{userId}/notifications)을 추가 구독하여 웹소켓을 통해 알림(payload: roomId, createdAt)을 수신하면 클라이언트 상태에 즉시 반영.
     - 같은 cleanup 구간에서 직접 POST(백업 경로)를 추가해 네트워크 취소나 탭 전환에도 서버 반영을 보장
   - 결과:
     - 탭 전환/재접속 상황에서 안 읽음 표시가 실시간으로 안정적 반영
     - 사용자 체감 오류 감소

2) 검색 데이터 반영 불일치
   - 문제: 검색 결과 데이터가 채팅 페이지에 반영되지 않음
   - 원인: 페이징 처리 초기화 누락되어 기존 페이지 값에서 1씩 더해진 상태로 요청함.
   - 해결: 검색어 변경될 때마다 페이징 초기화 처리함.
   - 결과: 0부터 요청되어 검색 결과 데이터가 정상적으로 반영됨

<br />

---

## 📁 디렉토리 구조

```bash
src/
├── api/         # API 호출 함수 (axios 등)
├── assets/      # 이미지, 폰트 등 정적 리소스
├── components/  # 공통 UI 컴포넌트
├── constants/   # 상수 값 정의
├── features/    # 기능 단위 모듈 (채팅, 프로젝트 등)
├── hooks/       # 공통 커스텀 훅
├── layouts/     # 공통 페이지 레이아웃
├── mocks/       # 목(Mock) 데이터
├── pages/       # 페이지 컴포넌트
├── router/      # 라우팅 설정
├── schemas/     # 요청/응답 타입 및 Zod 스키마
├── stores/      # Zustand 전역 상태 관리
├── styles/      # 글로벌 스타일, 디자인 토큰
├── types/       # 전역 TypeScript 타입 정의
└── utils/       # 공용 유틸리티 함수
```

<br />

---

## 🏃‍➡️ 설치 및 실행
```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

<br/>

---

## Credits
원본 저장소: [링크](https://github.com/DeepDirect/ddok-fe)   
팀원:
| 이름      | 역할                 | GitHub 링크                                     |
|----------|--------------------|------------------------------------------------|
| 정원용     | 팀장, Full Stack, Infra    | [@projectmiluju](https://github.com/jihun-dev) |
| 권혜진     | Backend            | [@sunsetkk](https://github.com/sunsetkk)       |
| 박건      | Frontend            | [@Jammanb0](https://github.com/Jammanb0)       |
| 박소현     | Frontend           | [@ssoogit](https://github.com/ssoogit)         |
| 박재경     | Full Stack  | [@Shin-Yu-1](https://github.com/Shin-Yu-1) |
| 이은지     | Frontend           | [@ebbll](https://github.com/ebbll)             |
| 최범근     | Backend            | [@vayaconChoi](https://github.com/vayaconChoi) |


