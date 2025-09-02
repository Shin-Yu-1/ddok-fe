import type { MapPanelItem } from '../types';

/**
 * 지도 패널에서 사용할 목 데이터
 * 각 카테고리별 샘플 데이터 포함
 */

export const panelMockData: MapPanelItem[] = [
  // 프로젝트 데이터
  {
    category: 'project',
    projectId: 1,
    title: '구지라지 프로젝트',
    location: {
      latitude: 37.567,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    teamStatus: 'RECRUITING',
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
  {
    category: 'project',
    projectId: 2,
    title: '똑똑 프로젝트',
    location: {
      latitude: 37.566,
      longitude: 126.977,
      address: '서울특별시 강남구 테헤란로',
    },
    teamStatus: 'ONGOING',
    bannerImageUrl: '/src/assets/images/avatar.png',
  },

  // 스터디 데이터
  {
    category: 'study',
    studyId: 1,
    title: '구지라지 스터디',
    location: {
      latitude: 37.565,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    teamStatus: 'ONGOING',
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
  {
    category: 'study',
    studyId: 2,
    title: '똑똑 스터디',
    location: {
      latitude: 37.566,
      longitude: 126.98,
      address: '서울특별시 강남구 테헤란로',
    },
    teamStatus: 'RECRUITING',
    bannerImageUrl: '/src/assets/images/avatar.png',
  },

  // 플레이어 데이터
  {
    category: 'player',
    userId: 1,
    nickname: '똑똑한 백엔드',
    location: {
      latitude: 37.565,
      longitude: 126.977,
      address: '서울특별시 강남구 테헤란로',
    },
    mainBadge: {
      type: 'login',
      tier: 'bronze',
    },
    abandonBadge: {
      isGranted: true,
      count: 5,
    },
    temperature: 36.5,
    profileImageUrl: '/src/assets/images/avatar.png',
  },

  // 추천 장소 데이터
  {
    category: 'cafe',
    cafeId: 1,
    title: '구지라지 카페',
    location: {
      latitude: 37.564,
      longitude: 126.976,
      address: '서울특별시 강남구 테헤란로',
    },
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
  {
    category: 'cafe',
    cafeId: 2,
    title: '새로운 카페',
    location: {
      latitude: 37.563,
      longitude: 126.977,
      address: '서울특별시 강남구 테헤란로',
    },
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
];
