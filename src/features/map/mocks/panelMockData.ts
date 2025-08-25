import type { MapItem } from '../types';

/**
 * 지도 패널에서 사용할 목 데이터
 * 각 카테고리별 샘플 데이터 포함
 */

export const panelMockData: MapItem[] = [
  // 프로젝트 데이터
  {
    category: 'project',
    projectId: 1,
    title: '구지라지 프로젝트',
    location: {
      latitude: 37.5665,
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
      latitude: 37.5665,
      longitude: 126.978,
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
      latitude: 37.5665,
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
      latitude: 37.5665,
      longitude: 126.978,
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
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    profileImageUrl: '/src/assets/images/avatar.png',
  },

  // 카페 데이터
  {
    category: 'cafe',
    cafeId: 1,
    title: '구지라지 카페',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
];
