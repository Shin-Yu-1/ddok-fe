import type { MapOverlayData } from '../types';

export const overlayMockData: MapOverlayData[] = [
  // 프로젝트
  {
    category: 'project',
    projectId: 1,
    title: '구지라지 프로젝트',
    bannerImageUrl: 'https://cdn.example.com/images/default.png',
    teamStatus: 'RECRUITING',
    positions: ['백엔드', '프론트'],
    capacity: 4,
    mode: 'offline',
    address: '서울 마포구',
    preferredAges: {
      ageMin: 20,
      ageMax: 30,
    },
    expectedMonth: 3,
    startDate: '2025-09-10',
  },

  // 스터디
  {
    category: 'study',
    studyId: 1,
    title: '구지라지 스터디',
    bannerImageUrl: 'https://cdn.example.com/images/default.png',
    teamStatus: 'RECRUITING',
    studyType: '취업/면접',
    capacity: 4,
    mode: 'offline',
    address: '서울 마포구',
    preferredAges: {
      ageMin: 20,
      ageMax: 30,
    },
    expectedMonth: 3,
    startDate: '2025-09-10',
  },

  // 플레이어
  {
    category: 'player',
    userId: 1,
    nickname: '구지라지 똑똑이',
    profileImageUrl: 'https://cdn.example.com/images/users/1.jpg',
    mainBadge: {
      type: 'login',
      tier: 'bronze',
    },
    abandonBadge: {
      isGranted: true,
      count: 5,
    },
    mainPosition: 'backend',
    address: '서울 강남구',
    latestProject: {
      id: 101,
      title: '구지라지 프로젝트',
      teamStatus: 'RECRUITING',
    },
    latestStudy: {
      id: 202,
      title: '구지라지 알고리즘 스터디',
      teamStatus: 'ONGOING',
    },
    temperature: 36.5,
    isMine: false,
  },

  // 추천 장소
  {
    category: 'cafe',
    cafeId: 1,
    title: '구지라지 카페',
    bannerImageUrl: 'https://cdn.example.com/images/cafes/1.jpg',
    rating: 4.5,
    reviewCount: 23,
    address: '서울 강남구',
  },
];
