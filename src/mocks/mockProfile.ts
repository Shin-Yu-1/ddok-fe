import type {
  CompleteProfileInfo,
  Badge,
  AbandonBadge,
  ActiveHours,
  PortfolioItem,
  LocationInfo,
  TechStack,
  ParticipationHistory,
  TemperatureLevel,
} from '@/types/user';

// 온도 레벨 계산 함수
export const getTemperatureLevel = (temperature: number): TemperatureLevel => {
  if (temperature <= 10) return 'freezing';
  if (temperature <= 29) return 'cold';
  if (temperature <= 49) return 'cool';
  if (temperature <= 69) return 'warm';
  if (temperature <= 89) return 'hot';
  return 'burning';
};

// 뱃지 목 데이터
const mockBadges: Badge[] = [
  {
    type: 'login',
    tier: 'bronze',
  },
  {
    type: 'complete',
    tier: 'gold',
  },
];

// 포기 뱃지 목 데이터
const mockAbandonBadge: AbandonBadge = {
  isGranted: true,
  count: 2,
};

// 활동 시간 목 데이터
const mockActiveHours: ActiveHours = {
  start: '19',
  end: '23',
};

// 포트폴리오 목 데이터
const mockPortfolio: PortfolioItem[] = [
  {
    linkTitle: '깃헙 프로필',
    link: 'https://github.com/',
  },
  {
    linkTitle: '개인 블로그',
    link: 'https://naver.com',
  },
];

// 위치 정보 목 데이터
const mockLocation: LocationInfo = {
  latitude: 37.5665,
  longitude: 126.978,
  address: '서울특별시 강남구 테헤란로 123',
};

// 기술 스택 목 데이터
const mockTechStacks: TechStack[] = [
  { id: 1, name: 'TypeScript' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'C' },
  { id: 4, name: 'Python' },
  { id: 5, name: 'Java' },
  { id: 6, name: 'React' },
  { id: 7, name: 'Vue.js' },
  { id: 8, name: 'Angular' },
  { id: 9, name: 'Node.js' },
  { id: 10, name: 'Spring' },
];

// 참여 이력 목 데이터
const mockParticipationHistory: ParticipationHistory[] = [
  {
    id: 1,
    title: '똑(DDOK) 플랫폼 개발',
    type: 'project',
    status: 'ongoing',
    startDate: '2025.06.04',
  },
  {
    id: 2,
    title: 'React 심화 스터디',
    type: 'study',
    status: 'completed',
    startDate: '2025.06.04',
    endDate: '2025.08.12',
  },
  {
    id: 3,
    title: '알고리즘 문제 해결 스터디',
    type: 'study',
    status: 'ongoing',
    startDate: '2025.06.04',
  },
  {
    id: 4,
    title: 'E-커머스 풀스택 프로젝트',
    type: 'project',
    status: 'completed',
    startDate: '2025.06.04',
    endDate: '2025.08.12',
  },
  {
    id: 5,
    title: '똑(DDOK) 플랫폼 개발2',
    type: 'project',
    status: 'ongoing',
    startDate: '2025.06.04',
  },
  {
    id: 6,
    title: 'React 심화 스터디2',
    type: 'study',
    status: 'completed',
    startDate: '2025.06.04',
    endDate: '2025.08.12',
  },
  {
    id: 7,
    title: '알고리즘 문제 해결 스터디2',
    type: 'study',
    status: 'ongoing',
    startDate: '2025.06.04',
  },
  {
    id: 8,
    title: 'E-커머스 풀스택 프로젝트2',
    type: 'project',
    status: 'completed',
    startDate: '2025.06.04',
    endDate: '2025.08.12',
  },
];

// 본인 프로필 목 데이터 (수정 가능)
export const mockMyProfile: CompleteProfileInfo = {
  // 기본 정보
  userId: 123,
  nickname: '개발자라지',
  profileImage: '/src/assets/images/avatar.png',
  ageGroup: '20대',
  introduction: '로또 1등 당첨 기원 중',

  // 권한 관련
  isMine: true,
  isProfilePublic: true,
  chatRoomId: null,
  dmRequestPending: false,

  // 온도와 레벨
  temperature: 36.5,
  temperatureLevel: getTemperatureLevel(76.0),

  // 뱃지
  badges: mockBadges,
  abandonBadge: mockAbandonBadge,

  // 포지션
  mainPosition: '백엔드',
  subPositions: ['프론트엔드', '디자이너'],

  // 성향
  traits: ['정리의 신', '실행력 갓', '내향인'],

  // 활동 시간
  activeHours: mockActiveHours,

  // 포트폴리오
  portfolio: mockPortfolio,

  // 위치
  location: mockLocation,

  // 별도 API 데이터들
  techStacks: mockTechStacks,
  participationHistory: mockParticipationHistory,
};

// 타인 프로필 목 데이터 (수정 불가)
export const mockOtherProfile: CompleteProfileInfo = {
  // 기본 정보
  userId: 1,
  nickname: '디자이너 쏘',
  profileImage: '/src/assets/images/avatar.png',
  ageGroup: '30대',
  introduction:
    'UX/UI 디자이너입니다. 사용자 중심의 디자인을 추구하며, 개발자와의 협업을 즐깁니다.',

  // 권한 관련
  isMine: false,
  isProfilePublic: true,
  chatRoomId: null,
  dmRequestPending: false,

  // 온도와 레벨
  temperature: 89.2,
  temperatureLevel: getTemperatureLevel(89.2),

  // 뱃지
  badges: [
    {
      type: 'complete',
      tier: 'silver',
    },
    {
      type: 'login',
      tier: 'gold',
    },
  ],
  abandonBadge: {
    isGranted: false,
    count: 0,
  },

  // 포지션
  mainPosition: '프론트엔드',
  subPositions: ['게임'],

  // 성향
  traits: ['정리의 신', '실행력 갓', '내향인'],

  // 활동 시간
  activeHours: {
    start: '9',
    end: '18',
  },

  // 포트폴리오
  portfolio: [
    {
      linkTitle: '깃헙 프로필',
      link: 'https://github.com/',
    },
    {
      linkTitle: '개인 블로그',
      link: 'https://naver.com',
    },
  ],

  // 위치
  location: {
    latitude: 37.5172,
    longitude: 127.0473,
    address: '서울특별시 서초구 서초대로 123',
  },

  techStacks: mockTechStacks,
  participationHistory: mockParticipationHistory,
};
