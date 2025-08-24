import type { BaseMapItem, TeamStatus } from './common';

/**
 * 스터디 관련 타입 정의
 */

export interface Study extends BaseMapItem {
  category: 'study';
  studyId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
}

// 스터디 생성/수정 시 사용할 입력 타입
export interface StudyInput {
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}
