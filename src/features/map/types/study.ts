import type { BaseMapItem, TeamStatus } from './common';

/**
 * 스터디 관련 타입 정의
 */

/** 지도상의 스터디 정보 */
export interface StudyMapItem extends BaseMapItem {
  studyId: number;
  title: string;
  teamStatus: TeamStatus;
}

/** 패널의 스터디 아이템 정보 */
export interface StudyPanelItem extends BaseMapItem {
  studyId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
}

/** 스터디 오버레이 정보 */
export interface StudyOverlayData {
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
