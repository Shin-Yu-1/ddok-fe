import type { BaseMapItem, TeamStatus } from './common';

/**
 * 프로젝트 관련 타입 정의
 */

export interface Project extends BaseMapItem {
  category: 'project';
  projectId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
}

export interface ProjectOverlay {
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
