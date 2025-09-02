import type { BaseMapItem, TeamStatus } from './common';

/**
 * 프로젝트 관련 타입 정의
 */

/** 지도상의 프로젝트 정보 */
export interface ProjectMapItem extends BaseMapItem {
  projectId: number;
  title: string;
  teamStatus: TeamStatus;
}

/** 패널의 프로젝트 아이템 정보 */
export interface ProjectPanelItem extends ProjectMapItem {
  bannerImageUrl: string;
}

/** 프로젝트 오버레이 정보 */
export interface ProjectOverlayData {
  category: string;
  projectId: number;
  title: string;
  bannerImageUrl: string;
  teamStatus: string;
  positions: string[];
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
