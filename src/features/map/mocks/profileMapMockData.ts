import type { MapItem } from '../types';

/**
 * 프로필 지도 응답 데이터
 */

export const profileMapMockData: MapItem[] = [
  {
    category: 'project',
    projectId: 1,
    title: '구지라지 프로젝트',
    teamStatus: 'ONGOING',
    location: {
      address: '부산 해운대구 우동 센텀중앙로 90',
      region1depthName: '부산',
      region2depthName: '해운대구',
      region3depthName: '우동',
      roadName: '센텀중앙로',
      mainBuildingNo: '90',
      subBuildingNo: '',
      zoneNo: '48058',
      latitude: 37.567,
      longitude: 126.978,
    },
  },
  {
    category: 'study',
    studyId: 1,
    title: '구지라지 스터디',
    teamStatus: 'CLOSED',
    location: {
      address: '부산 해운대구 우동 센텀중앙로 90',
      region1depthName: '부산',
      region2depthName: '해운대구',
      region3depthName: '우동',
      roadName: '센텀중앙로',
      mainBuildingNo: '90',
      subBuildingNo: '',
      zoneNo: '48058',
      latitude: 37.566,
      longitude: 126.978,
    },
  },
];
