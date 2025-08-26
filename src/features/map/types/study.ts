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

export interface StudyOverlayType {
  category: string;
  studyId: number;
  title: string;
  bannerImageUrl: string;
  teamStatus: string;
  studyType: string;
  capacity: number;
  mode: string;
  address: string;
  preferredAges: {
    ageMin: number;
    ageMax: number;
  };
  expectedMonth: number;
  startDate: string;
}
